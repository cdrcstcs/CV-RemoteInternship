<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Agence104\LiveKit\RoomServiceClient;
use Agence104\LiveKit\IngressClient;
use Agence104\LiveKit\AccessToken;
use Agence104\LiveKit\AccessTokenOptions;
use Agence104\LiveKit\VideoGrant;
use Agence104\LiveKit\TrackSource;
use Agence104\LiveKit\IngressInput;
use App\Models\User;
use App\Models\Stream;
use Illuminate\Support\Facades\Log; // Import the Log facade

class LiveKitController extends Controller
{
    protected $roomService;
    protected $ingressClient;

    public function __construct()
    {
        $this->roomService = new RoomServiceClient(
            env('LIVEKIT_URL'),
            env('LIVEKIT_API_KEY'),
            env('LIVEKIT_API_SECRET')
        );

        $this->ingressClient = new IngressClient(env('LIVEKIT_URL'));
    }

    // Reset all ingresses and rooms related to the user
    public function resetIngresses(Request $request, $hostIdentity)
    {
        $self = $request->user(); // Get the authenticated user from the request

        Log::info("User {$self->id} is attempting to reset ingresses and rooms for host identity {$hostIdentity}");

        $ingresses = $this->ingressClient->listIngress(['roomName' => $hostIdentity]);
        $rooms = $this->roomService->listRooms([$hostIdentity]);

        foreach ($rooms as $room) {
            $this->roomService->deleteRoom($room->name);
            Log::info("Room {$room->name} deleted successfully for user {$self->id}");
        }

        foreach ($ingresses as $ingress) {
            if ($ingress->ingressId) {
                $this->ingressClient->deleteIngress($ingress->ingressId);
                Log::info("Ingress {$ingress->ingressId} deleted successfully for user {$self->id}");
            }
        }

        return response()->json(['message' => 'Ingresses and rooms reset successfully']);
    }

    // Create an ingress for the user
    public function createIngress(Request $request, $ingressType)
    {
        $self = $request->user(); // Get the authenticated user from the request

        Log::info("User {$self->id} is attempting to create an ingress of type {$ingressType}");

        // Reset any existing ingresses before creating a new one
        $this->resetIngresses($request, $self->id);

        // Prepare ingress options
        $options = [
            'name' => $self->first_name . ' ' . $self->last_name,
            'roomName' => $self->id,
            'participantName' => $self->first_name . ' ' . $self->last_name,
            'participantIdentity' => $self->id,
        ];

        if ($ingressType === IngressInput::WHIP_INPUT) {
            $options['bypassTranscoding'] = true;
        } else {
            $options['video'] = [
                'source' => TrackSource::CAMERA,
                'preset' => IngressVideoEncodingPreset::H264_1080P_30FPS_3_LAYERS,
            ];

            $options['audio'] = [
                'source' => TrackSource::MICROPHONE,
                'preset' => IngressAudioEncodingPreset::OPUS_STEREO_96KBPS,
            ];
        }

        // Create the ingress
        $ingress = $this->ingressClient->createIngress($ingressType, $options);

        if (!$ingress || !$ingress->url || !$ingress->streamKey) {
            Log::error("User {$self->id} failed to create ingress of type {$ingressType}");
            return response()->json(['error' => 'Failed to create ingress'], 500);
        }

        // Store the stream information in the database
        $stream = Stream::updateOrCreate(
            ['user_id' => $self->id],
            [
                'ingress_id' => $ingress->ingressId,
                'server_url' => $ingress->url,
                'stream_key' => $ingress->streamKey,
            ]
        );

        Log::info("Ingress created successfully for user {$self->id}, ingress ID: {$ingress->ingressId}");

        // Trigger a cache revalidation or any additional steps
        // This could be customized to use Laravel's cache mechanism or a custom cache invalidation approach
        // revalidatePath('/u/' . $self->username . '/keys'); // Implement cache invalidation if needed

        return response()->json(['message' => 'Ingress created successfully', 'ingress' => $ingress]);
    }

    // Example: Create Access Token for user to join room
    public function createAccessToken(Request $request, $roomName)
    {
        $self = $request->user(); // Get the authenticated user from the request

        Log::info("User {$self->id} is requesting an access token for room {$roomName}");

        $participantName = $self->first_name . ' ' . $self->last_name;
        $participantIdentity = $self->id;

        $tokenOptions = new AccessTokenOptions();
        $tokenOptions->setIdentity($participantIdentity);

        // Define video grants
        $videoGrant = new VideoGrant();
        $videoGrant->setRoomJoin()
            ->setRoomName($roomName);

        // Create the Access Token
        $accessToken = new AccessToken(env('LIVEKIT_API_KEY'), env('LIVEKIT_API_SECRET'));
        $accessToken->init($tokenOptions)
            ->setGrant($videoGrant);

        $jwt = $accessToken->toJwt();

        Log::info("Access token generated successfully for user {$self->id} to join room {$roomName}");

        return response()->json(['token' => $jwt]);
    }
}
