<?php

namespace App\Integrations\Files;

use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;

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
        // Format the file URI for Cloudinary upload
        $formattedUploadUri = self::createUri($mimeType, $base64FileContents);

        try {
            // Instantiate Cloudinary UploadApi
            $uploadClient = new UploadApi();
            // Upload the image
            $results = $uploadClient->upload($formattedUploadUri, ['resource_type' => 'image']);

            Log::info("Cloudinary upload results: " . json_encode($results));
            // Return success result with Cloudinary URLs
            return CloudinaryResults::success($results['secure_url'], $results['url']);
        } catch (\Exception $e) {
            // Log any errors during upload
            Log::error("Failed to upload file to Cloudinary: " . $e->getMessage());
            // Return failure result
            return CloudinaryResults::failed($e->getMessage());
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
