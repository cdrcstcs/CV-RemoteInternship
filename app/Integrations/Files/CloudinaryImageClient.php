<?php

namespace App\Integrations\Files;

use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str; // Make sure this is at the top of the file if you want to use Str::uuid()

class CloudinaryImageClient
{
    protected $cloudinaryInstance;
    
    public function __construct()
    {
        // Retrieve Cloudinary credentials from the environment file
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        // Check if the necessary configuration values are available
        if (!$cloudName || !$apiKey || !$apiSecret) {
            Log::error("Cloudinary configuration is missing in the environment file.");
            throw new \Exception("Cloudinary configuration is missing in the environment file.");
        }

        // Set up Cloudinary instance with your configuration
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

    public function uploadImage(string $mimeType, string $base64FileContents): CloudinaryResults
    {
        Log::debug("uploadImage called", [
            'mimeType' => $mimeType,
            'base64_length' => strlen($base64FileContents),
            'base64_preview' => substr($base64FileContents, 0, 30) . '...' // Only log part to avoid massive output
        ]);

        // Format the file URI for Cloudinary upload
        $formattedUploadUri = self::createUri($mimeType, $base64FileContents);
        Log::debug("Formatted upload URI", [
            'uri_sample' => substr($formattedUploadUri, 0, 50) . '...' // Partial preview
        ]);

        try {
            // Instantiate Cloudinary UploadApi
            $uploadClient = new UploadApi();
            Log::debug("UploadApi client instantiated.");

            // Upload the image
            $results = $uploadClient->upload($formattedUploadUri, ['resource_type' => 'image']);
            Log::info("Cloudinary upload completed", [
                'results' => $results
            ]);
            $results['original_filename'] = (string) Str::uuid();

            // Create success result object
            $successResult = CloudinaryResults::success(
                $results['secure_url'],
                $results['url'],
                $results['width'],
                $results['height'],
                $results['original_filename'],
                $results['public_id'],
                $results['format'],
                $results['resource_type']
            );

            Log::debug("Returning success result", [
                'secure_url' => $results['secure_url'],
                'url' => $results['url'],
                'dimensions' => $results['width'] . 'x' . $results['height'],
                'filename' => $results['original_filename'],
                'public_id' => $results['public_id'],
                'format' => $results['format'],
                'resource_type' => $results['resource_type']
            ]);

            return $successResult;

        } catch (\Exception $e) {
            Log::error("Exception during Cloudinary upload", [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            $failedResult = CloudinaryResults::failed($e->getMessage());

            Log::debug("Returning failure result", [
                'error_message' => $e->getMessage()
            ]);

            return $failedResult;
        }
    }


    /**
     * Utility function to create a data URI from base64 file contents.
     *
     * @param string $mimeType Example: image/jpeg
     * @param string $base64FileContents The base64-encoded file contents
     * @return string The formatted data URI (e.g., 'data:image/jpeg;base64, ...')
     */
    private static function createUri(string $mimeType, string $base64FileContents): string
    {
        return 'data:' . $mimeType . ';base64,' . $base64FileContents;
    }
}
