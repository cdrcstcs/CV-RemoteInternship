<?php
namespace App\Integrations\Files;

use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CloudinaryVideoClient
{
    protected $cloudinaryInstance;

    public function __construct()
    {
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        if (!$cloudName || !$apiKey || !$apiSecret) {
            Log::error("Cloudinary configuration is missing in the environment file.");
            throw new \Exception("Cloudinary configuration is missing in the environment file.");
        }

        $this->cloudinaryInstance = Configuration::instance([
            'cloud' => [
                'cloud_name' => $cloudName,
                'api_key' => $apiKey,
                'api_secret' => $apiSecret
            ],
            'url' => [
                'secure' => true
            ]
        ]);
    }

    /**
     * Upload video to Cloudinary
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     * @return CloudinaryVideoResults
     */
    public function uploadVideo($file): CloudinaryVideoResults
    {
        Log::debug("uploadVideo called");

        try {
            // Use the UploadApi to upload the video file
            $uploadClient = new UploadApi();

            // Upload video using the file path
            $uploadResult = $uploadClient->upload(
                $file->getRealPath(), // The file path
                [
                    'resource_type' => 'video', // We are uploading a video
                    'folder' => 'my_videos', // Optional: Upload to 'my_videos' folder
                ]
            );

            Log::info("Cloudinary video upload completed", ['results' => $uploadResult]);

            // Map the results to CloudinaryVideoResults
            $videoResults = CloudinaryVideoResults::success(
                $uploadResult['secure_url'],
                $uploadResult['url'],
                $uploadResult['width'] ?? 0,
                $uploadResult['height'] ?? 0,
                $uploadResult['original_filename'],
                $uploadResult['public_id'],
                $uploadResult['format'],
                $uploadResult['resource_type'],
                $uploadResult['tags'] ?? [],
                $uploadResult['poster'] ?? null // Optional poster
            );

            return $videoResults;

        } catch (\Exception $e) {
            Log::error("Exception during Cloudinary video upload", [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return CloudinaryVideoResults::failed($e->getMessage());
        }
    }
}
