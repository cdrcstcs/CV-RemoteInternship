<?php

namespace App\Services;

use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Api\Resources\ExplicitResource;
use Cloudinary\Cloudinary;

class CloudinaryService
{
    protected $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => [
                'secure' => true, // Ensures secure URLs for uploaded media
            ]
        ]);
    }

    /**
     * Upload an image to Cloudinary.
     *
     * @param  string $filePath
     * @param  array  $options
     * @return array
     */
    public function uploadImage($filePath, $options = [])
    {
        try {
            // Upload the file to Cloudinary
            $response = $this->cloudinary->uploadApi()->upload($filePath, $options);
            return $response;
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Upload a video to Cloudinary.
     *
     * @param  string $filePath
     * @param  array  $options
     * @return array
     */
    public function uploadVideo($filePath, $options = [])
    {
        try {
            $response = $this->cloudinary->uploadApi()->upload($filePath, array_merge($options, ['resource_type' => 'video']));
            return $response;
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Delete a media item from Cloudinary.
     *
     * @param  string $publicId
     * @return array
     */
    public function deleteMedia($publicId)
    {
        try {
            $response = $this->cloudinary->api()->deleteResources($publicId);
            return $response;
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
