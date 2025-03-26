<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class EditorController extends Controller
{
    /**
     * Remove the background from an image via Cloudinary.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeBackground(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'activeImage' => 'required|string',
            'format' => 'required|string',
        ]);

        $activeImage = $validatedData['activeImage'];
        $format = $validatedData['format'];

        // Log incoming request details
        Log::info('Incoming request to remove background', [
            'activeImage' => $activeImage,
            'format' => $format,
        ]);

        // Cloudinary configuration from .env file
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        // Generate the URL for background removal
        $form = explode($format, $activeImage);
        $pngConvert = $form[0] . "png"; // Convert image to PNG format
        $parts = explode("/upload/", $pngConvert);
        $removeUrl = $parts[0] . "/upload/e_background_removal/" . $parts[1];

        // Log the generated remove URL
        Log::info('Generated remove URL', ['removeUrl' => $removeUrl]);

        // Poll the URL to check if the image is processed
        $maxAttempts = 20;
        $delay = 1; // Delay between each attempt in seconds
        $isProcessed = false;

        try {
            for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
                // Log each attempt
                Log::info('Attempt ' . ($attempt + 1) . ': Checking image processing for URL: ' . $removeUrl);

                // Check if the image is processed
                $response = Http::get($removeUrl);

                if ($response->ok()) {
                    $isProcessed = true;
                    Log::info("Image processed successfully for URL: {$removeUrl}");
                    break;
                }

                // Delay before rechecking
                sleep($delay);
            }

            if (!$isProcessed) {
                // Log the timeout and return a response
                Log::error('Image processing timed out', [
                    'removeUrl' => $removeUrl,
                    'attempts' => $maxAttempts,
                ]);
                return response()->json([
                    'error' => 'Image processing timed out.',
                ], 408); // HTTP 408 Request Timeout
            }

            // Return the processed image URL
            Log::info('Returning processed image URL', ['removeUrl' => $removeUrl]);
            return response()->json([
                'success' => $removeUrl,
            ], 200);

        } catch (Exception $e) {
            // Log the exception with full details
            Log::error('Error during background removal process', [
                'exception' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
                'removeUrl' => $removeUrl,
            ]);

            // Return a generic error response
            return response()->json([
                'error' => 'An error occurred while processing the image.',
            ], 500); // HTTP 500 Internal Server Error
        }
    }

    /**
     * Replace the background of an image via Cloudinary.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function replaceBackground(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'activeImage' => 'required|string',
            'prompt' => 'nullable|string',
        ]);

        $activeImage = $validatedData['activeImage'];
        $prompt = $validatedData['prompt'];

        // Log incoming request details
        Log::info('Incoming request to replace background', [
            'activeImage' => $activeImage,
            'prompt' => $prompt,
        ]);

        // Generate the URL for background replacement
        $parts = explode("/upload/", $activeImage);
        $bgReplaceUrl = $prompt
            ? "{$parts[0]}/upload/e_gen_background_replace:prompt_" . urlencode($prompt) . "/{$parts[1]}"
            : "{$parts[0]}/upload/e_gen_background_replace/{$parts[1]}";

        // Log the generated replace URL
        Log::info('Generated background replace URL', ['bgReplaceUrl' => $bgReplaceUrl]);

        // Poll the URL to check if the image is processed
        $maxAttempts = 20;
        $delay = 1; // Delay between each attempt in seconds
        $isProcessed = false;

        try {
            for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
                // Log each attempt
                Log::info('Attempt ' . ($attempt + 1) . ': Checking image processing for URL: ' . $bgReplaceUrl);

                // Check if the image is processed
                $response = Http::get($bgReplaceUrl);

                if ($response->ok()) {
                    $isProcessed = true;
                    Log::info("Image processed successfully for URL: {$bgReplaceUrl}");
                    break;
                }

                // Delay before rechecking
                sleep($delay);
            }

            if (!$isProcessed) {
                // Log the timeout and return a response
                Log::error('Image processing timed out', [
                    'bgReplaceUrl' => $bgReplaceUrl,
                    'attempts' => $maxAttempts,
                ]);
                return response()->json([
                    'error' => 'Image processing timed out.',
                ], 408); // HTTP 408 Request Timeout
            }

            // Return the processed image URL
            Log::info('Returning processed image URL', ['bgReplaceUrl' => $bgReplaceUrl]);
            return response()->json([
                'success' => $bgReplaceUrl,
            ], 200);

        } catch (Exception $e) {
            // Log the exception with full details
            Log::error('Error during background replacement process', [
                'exception' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
                'bgReplaceUrl' => $bgReplaceUrl,
            ]);

            // Return a generic error response
            return response()->json([
                'error' => 'An error occurred while processing the image.',
            ], 500); // HTTP 500 Internal Server Error
        }
    }

    /**
     * Extract objects from an image via Cloudinary.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function extractImage(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'prompts' => 'required|array',
            'prompts.*' => 'required|string',
            'activeImage' => 'required|string',
            'multiple' => 'nullable|boolean',
            'mode' => 'nullable|in:default,mask',
            'invert' => 'nullable|boolean',
            'format' => 'required|string',
        ]);

        $prompts = $validatedData['prompts'];
        $activeImage = $validatedData['activeImage'];
        $multiple = $validatedData['multiple'] ?? false;
        $mode = $validatedData['mode'] ?? 'default';
        $invert = $validatedData['invert'] ?? false;
        $format = $validatedData['format'];

        // Log incoming request details
        Log::info('Incoming request to extract image', [
            'activeImage' => $activeImage,
            'prompts' => $prompts,
            'multiple' => $multiple,
            'mode' => $mode,
            'invert' => $invert,
            'format' => $format,
        ]);

        // Generate the URL for extraction
        $form = explode($format, $activeImage);
        $pngConvert = $form[0] . "png"; // Convert image to PNG format
        $parts = explode("/upload/", $pngConvert);

        // Build the extract parameters string
        $extractParams = 'prompt_(' . implode(';', array_map('urlencode', $prompts)) . ')';
        if ($multiple) $extractParams .= ';multiple_true';
        if ($mode === 'mask') $extractParams .= ';mode_mask';
        if ($invert) $extractParams .= ';invert_true';

        $extractUrl = $parts[0] . '/upload/e_extract:' . $extractParams . '/' . $parts[1];

        // Log the generated extract URL
        Log::info('Generated extract URL', ['extractUrl' => $extractUrl]);

        // Poll the URL to check if the image is processed
        $maxAttempts = 20;
        $delay = 1; // Delay between each attempt in seconds
        $isProcessed = false;

        try {
            for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
                // Log each attempt
                Log::info('Attempt ' . ($attempt + 1) . ': Checking image processing for URL: ' . $extractUrl);


                // Check if the image is processed
                $response = Http::get($extractUrl);

                if ($response->ok()) {
                    $isProcessed = true;
                    Log::info("Image processed successfully for URL: {$extractUrl}");
                    break;
                }

                // Delay before rechecking
                sleep($delay);
            }

            if (!$isProcessed) {
                // Log the timeout and return a response
                Log::error('Image processing timed out', [
                    'extractUrl' => $extractUrl,
                    'attempts' => $maxAttempts,
                ]);
                return response()->json([
                    'error' => 'Image processing timed out.',
                ], 408); // HTTP 408 Request Timeout
            }

            // Return the processed image URL
            Log::info('Returning processed image URL', ['extractUrl' => $extractUrl]);
            return response()->json([
                'success' => $extractUrl,
            ], 200);

        } catch (Exception $e) {
            // Log the exception with full details
            Log::error('Error during image extraction process', [
                'exception' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
                'extractUrl' => $extractUrl,
            ]);

            // Return a generic error response
            return response()->json([
                'error' => 'An error occurred while processing the image.',
            ], 500); // HTTP 500 Internal Server Error
        }
    }

    /**
     * Generate the fill transformation URL and check if the image is processed.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function genFill(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'activeImage' => 'required|string',
            'aspect' => 'required|string',
            'width' => 'required|string',
            'height' => 'required|string',
        ]);

        $activeImage = $validatedData['activeImage'];
        $aspect = $validatedData['aspect'];
        $width = $validatedData['width'];
        $height = $validatedData['height'];

        // Log incoming request data for debugging
        Log::info('Incoming request to generate fill URL', [
            'activeImage' => $activeImage,
            'aspect' => $aspect,
            'width' => $width,
            'height' => $height,
        ]);

        // Generate the fill transformation URL
        $parts = explode('/upload/', $activeImage);
        $fillUrl = "{$parts[0]}/upload/ar_{$aspect},b_gen_fill,c_pad,w_{$width},h_{$height}/{$parts[1]}";

        // Log the generated fill URL
        Log::info('Generated fill URL', ['fillUrl' => $fillUrl]);

        // Poll the URL to check if the image is processed
        $maxAttempts = 20;
        $delay = 1; // Delay between each attempt in seconds
        $isProcessed = false;

        try {
            for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
                // Log each attempt for debugging
                Log::info('Attempt ' . ($attempt + 1) . ': Checking image processing for URL: ' . $fillUrl);


                // Check if the image is processed
                $response = Http::get($fillUrl);

                if ($response->ok()) {
                    $isProcessed = true;
                    Log::info("Image processed successfully for URL: {$fillUrl}");
                    break;
                }

                // Delay before rechecking
                sleep($delay);
            }

            if (!$isProcessed) {
                // Log the timeout and return a response
                Log::error('Image processing failed', [
                    'fillUrl' => $fillUrl,
                    'attempts' => $maxAttempts,
                ]);
                return response()->json([
                    'error' => 'Image processing failed.',
                ], 408); // HTTP 408 Request Timeout
            }

            // Return the processed image URL
            Log::info('Returning processed image URL', ['fillUrl' => $fillUrl]);
            return response()->json([
                'success' => $fillUrl,
            ], 200);

        } catch (Exception $e) {
            // Log the exception with full details
            Log::error('Error during image processing', [
                'exception' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
                'fillUrl' => $fillUrl,
            ]);

            // Return a generic error response
            return response()->json([
                'error' => 'An error occurred while processing the image.',
            ], 500); // HTTP 500 Internal Server Error
        }
    }
    
    /**
     * Remove the background from an image via Cloudinary using a custom prompt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function genRemove(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'prompt' => 'required|string',
            'activeImage' => 'required|string',
        ]);

        $prompt = $validatedData['prompt'];
        $activeImage = $validatedData['activeImage'];

        // Log incoming request data for debugging
        Log::info('Incoming request for image background removal', [
            'prompt' => $prompt,
            'activeImage' => $activeImage,
        ]);

        // Generate the URL for image background removal
        $parts = explode("/upload/", $activeImage);
        $removeUrl = "{$parts[0]}/upload/e_gen_remove:{$prompt}/{$parts[1]}";

        // Log the generated remove URL
        Log::info('Generated remove URL', ['removeUrl' => $removeUrl]);

        // Poll the URL to check if the image is processed
        $maxAttempts = 20;
        $delay = 1; // Delay between each attempt in seconds
        $isProcessed = false;

        try {
            for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
                // Log each attempt for debugging
                Log::info('Attempt ' . ($attempt + 1) . ': Checking image processing for URL: ' . $removeUrl);

                // Check if the image is processed
                $response = Http::get($removeUrl);

                if ($response->ok()) {
                    $isProcessed = true;
                    Log::info("Image processed successfully for URL: {$removeUrl}");
                    break;
                }

                // Delay before rechecking
                sleep($delay);
            }

            if (!$isProcessed) {
                // Log the timeout and return a response
                Log::error('Image processing failed', [
                    'removeUrl' => $removeUrl,
                    'attempts' => $maxAttempts,
                ]);
                return response()->json([
                    'error' => 'Image processing failed.',
                ], 408); // HTTP 408 Request Timeout
            }

            // Return the processed image URL
            Log::info('Returning processed image URL', ['removeUrl' => $removeUrl]);
            return response()->json([
                'success' => $removeUrl,
            ], 200);

        } catch (Exception $e) {
            // Log the exception with full details
            Log::error('Error during image processing', [
                'exception' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
                'removeUrl' => $removeUrl,
            ]);

            // Return a generic error response
            return response()->json([
                'error' => 'An error occurred while processing the image.',
            ], 500); // HTTP 500 Internal Server Error
        }
    }

    /**
     * Recolor an image via Cloudinary.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function recolorImage(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'tag' => 'required|string',
            'color' => 'required|string',
            'activeImage' => 'required|string',
        ]);

        $tag = $validatedData['tag'];
        $color = $validatedData['color'];
        $activeImage = $validatedData['activeImage'];

        // Log the incoming request for debugging
        Log::info('Incoming request for image recoloring', [
            'tag' => $tag,
            'color' => $color,
            'activeImage' => $activeImage,
        ]);

        // Generate the URL for image recoloring
        $parts = explode("/upload/", $activeImage);
        $recolorUrl = "{$parts[0]}/upload/e_gen_recolor:{$tag};{$color}/{$parts[1]}";

        // Log the generated recolor URL
        Log::info('Generated recolor URL', ['recolorUrl' => $recolorUrl]);

        // Poll the URL to check if the image is processed
        $maxAttempts = 20;
        $delay = 1; // Delay between each attempt in seconds
        $isProcessed = false;

        try {
            for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
                // Log each attempt for debugging
                Log::info('Attempt ' . ($attempt + 1) . ': Checking image processing for URL: ' . $recolorUrl);

                // Check if the image is processed
                $response = Http::get($recolorUrl);

                if ($response->ok()) {
                    $isProcessed = true;
                    Log::info("Image processed successfully for URL: {$recolorUrl}");
                    break;
                }

                // Delay before rechecking
                sleep($delay);
            }

            if (!$isProcessed) {
                // Log the timeout and return a response
                Log::error('Image processing failed', [
                    'recolorUrl' => $recolorUrl,
                    'attempts' => $maxAttempts,
                ]);
                return response()->json([
                    'error' => 'Image processing failed.',
                ], 408); // HTTP 408 Request Timeout
            }

            // Return the processed image URL
            Log::info('Returning processed image URL', ['recolorUrl' => $recolorUrl]);
            return response()->json([
                'success' => $recolorUrl,
            ], 200);

        } catch (Exception $e) {
            // Log the exception with full details
            Log::error('Error during image processing', [
                'exception' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
                'recolorUrl' => $recolorUrl,
            ]);

            // Return a generic error response
            return response()->json([
                'error' => 'An error occurred while processing the image.',
            ], 500); // HTTP 500 Internal Server Error
        }
    }

    /**
     * Crop a video via Cloudinary.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function cropVideo(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'activeVideo' => 'required|string',
            'aspect' => 'required|string',
            'height' => 'required|string',
        ]);

        $activeVideo = $validatedData['activeVideo'];
        $aspect = $validatedData['aspect'];
        $height = $validatedData['height'];

        // Log the incoming request for debugging
        Log::info('Incoming request for video cropping', [
            'activeVideo' => $activeVideo,
            'aspect' => $aspect,
            'height' => $height,
        ]);

        // Generate the URL for video cropping
        $parts = explode("/upload/", $activeVideo);
        $fillUrl = "{$parts[0]}/upload/ar_{$aspect},c_fill,g_auto,h_{$height}/{$parts[1]}";

        // Log the generated crop URL
        Log::info('Generated video crop URL', ['fillUrl' => $fillUrl]);

        // Poll the URL to check if the video is processed
        $maxAttempts = 20;
        $delay = 1; // Delay between each attempt in seconds
        $isProcessed = false;

        try {
            for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
                // Log each attempt for debugging
                Log::info('Attempt ' . ($attempt + 1) . ': Checking image processing for URL: ' . $fillUrl);

                // Check if the video is processed
                $response = Http::get($fillUrl);

                if ($response->ok()) {
                    $isProcessed = true;
                    Log::info("Video processed successfully for URL: {$fillUrl}");
                    break;
                }

                // Delay before rechecking
                sleep($delay);
            }

            if (!$isProcessed) {
                // Log the timeout and return a response
                Log::error('Video processing failed', [
                    'fillUrl' => $fillUrl,
                    'attempts' => $maxAttempts,
                ]);
                return response()->json([
                    'error' => 'Video processing failed.',
                ], 408); // HTTP 408 Request Timeout
            }

            // Return the processed video URL
            Log::info('Returning processed video URL', ['fillUrl' => $fillUrl]);
            return response()->json([
                'success' => $fillUrl,
            ], 200);

        } catch (Exception $e) {
            // Log the exception with full details
            Log::error('Error during video processing', [
                'exception' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
                'fillUrl' => $fillUrl,
            ]);

            // Return a generic error response
            return response()->json([
                'error' => 'An error occurred while processing the video.',
            ], 500); // HTTP 500 Internal Server Error
        }
    }

    /**
     * Initiate transcription for a video and check the transcription status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function initiateTranscription(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'publicId' => 'required|string',
        ]);

        $publicId = $validatedData['publicId'];

        // Cloudinary configuration from .env file
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        // Log the request for debugging
        Log::info('Initiating transcription for video', ['publicId' => $publicId]);

        try {
            // Initiate transcription via Cloudinary API
            $response = Http::withBasicAuth($apiKey, $apiSecret)->post(
                "https://api.cloudinary.com/v1_1/{$cloudName}/video/upload/{$publicId}",
                [
                    'resource_type' => 'video',
                    'raw_convert' => 'google_speech',
                ]
            );

            if (!$response->successful()) {
                return response()->json(['error' => 'Failed to initiate transcription.'], 500);
            }

            // Poll for transcription status
            $maxAttempts = 20;
            $delay = 2000; // 2 seconds delay
            $status = 'pending';

            for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
                $status = $this->checkTranscriptionStatus($publicId);

                Log::info('Attempt ' . ($attempt + 1) . ': Transcription status - ' . $status);

                if ($status === 'complete') {
                    $subtitledVideoUrl = $this->generateSubtitledVideoUrl($publicId);
                    return response()->json([
                        'success' => 'Transcription completed',
                        'subtitledVideoUrl' => $subtitledVideoUrl,
                    ]);
                } elseif ($status === 'failed') {
                    return response()->json(['error' => 'Transcription failed'], 500);
                }

                // Delay before checking again
                usleep($delay * 1000); // Convert delay to microseconds
            }

            return response()->json(['error' => 'Transcription timed out'], 408);
        } catch (Exception $e) {
            Log::error('Error in transcription process', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'Error in transcription process: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Check the status of transcription.
     *
     * @param string $publicId
     * @return string
     */
    private function checkTranscriptionStatus(string $publicId): string
    {
        try {
            $response = Http::withBasicAuth(env('CLOUDINARY_API_KEY'), env('CLOUDINARY_API_SECRET'))
                ->get("https://api.cloudinary.com/v1_1/" . env('CLOUDINARY_CLOUD_NAME') . "/resources/video/{$publicId}");

            if ($response->successful()) {
                $result = $response->json();
                if (isset($result['info']['raw_convert']['google_speech'])) {
                    return $result['info']['raw_convert']['google_speech']['status'];
                }
            }
            return 'pending'; // Default if status is not available
        } catch (Exception $e) {
            Log::error('Error checking transcription status', ['exception' => $e->getMessage()]);
            return 'pending'; // Assume pending if an error occurs
        }
    }

    /**
     * Generate the URL for the subtitled video.
     *
     * @param string $publicId
     * @return string
     */
    private function generateSubtitledVideoUrl(string $publicId): string
    {
        return cloudinary_url($publicId, [
            'resource_type' => 'video',
            'transformation' => [
                [
                    'overlay' => [
                        'resource_type' => 'subtitles',
                        'public_id' => "{$publicId}.transcript",
                    ],
                ],
                ['flags' => 'layer_apply'],
            ],
        ]);
    }
    /**
     * Upload an image to Cloudinary.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadImage(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'image' => 'required|file|mimes:jpg,jpeg,png,gif,webp', // You can specify your allowed file types here
        ]);

        $image = $validatedData['image'];

        // Cloudinary configuration from .env file
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        try {
            // Open the image file as a stream
            $imageStream = fopen($image->getRealPath(), 'r');

            // Upload image to Cloudinary
            $response = Http::withBasicAuth($apiKey, $apiSecret)
                ->attach(
                    'file',
                    $imageStream,
                    $image->getClientOriginalName()
                )
                ->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                    'upload_preset' => 'restyled', // Your upload preset
                    'use_filename' => true,
                    'unique_filename' => false,
                    'filename_override' => $image->getClientOriginalName(),
                ]);

            // Check if the upload was successful
            if ($response->successful()) {
                return response()->json([
                    'success' => $response->json(),
                ]);
            }

            return response()->json(['error' => 'Upload failed'], 500);
        } catch (Exception $e) {
            Log::error('Error uploading image to Cloudinary', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'Error processing file'], 500);
        }
    }

    /**
     * Upload a video to Cloudinary.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadVideo(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'video' => 'required|file|mimes:mp4,mkv,avi,webm', // You can specify your allowed video file types here
        ]);

        $video = $validatedData['video'];

        // Cloudinary configuration from .env file
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        try {
            // Open the video file as a stream
            $videoStream = fopen($video->getRealPath(), 'r');

            // Upload video to Cloudinary
            $response = Http::withBasicAuth($apiKey, $apiSecret)
                ->attach(
                    'file',
                    $videoStream,
                    $video->getClientOriginalName()
                )
                ->post("https://api.cloudinary.com/v1_1/{$cloudName}/video/upload", [
                    'upload_preset' => 'restyled', // Your upload preset
                    'use_filename' => true,
                    'unique_filename' => false,
                    'filename_override' => $video->getClientOriginalName(),
                ]);

            // Check if the upload was successful
            if ($response->successful()) {
                return response()->json([
                    'success' => $response->json(),
                ]);
            }

            return response()->json(['error' => 'Upload failed'], 500);
        } catch (Exception $e) {
            Log::error('Error uploading video to Cloudinary', ['exception' => $e->getMessage()]);
            return response()->json(['error' => 'Error processing file'], 500);
        }
    }
}
