<?php

namespace App\Integrations\Files;

class CloudinaryResults
{
    public bool $isSuccess;
    public string $insecureUrl;
    public string $secureUrl;
    public string $msg = '';

    public ?int $width = null;
    public ?int $height = null;
    public ?string $name = null;
    public ?string $publicId = null;
    public ?string $format = null;
    public ?string $resourceType = null;
    public ?array $tags = null;


    public static function success(
        string $secureUrl,
        string $insecureUrl,
        int $width,
        int $height,
        string $name,
        string $publicId,
        string $format,
        string $resourceType,
        array $tags
    ): CloudinaryResults {
        $results = new CloudinaryResults();
        $results->isSuccess = true;
        $results->secureUrl = $secureUrl;
        $results->insecureUrl = $insecureUrl;
        $results->width = $width;
        $results->height = $height;
        $results->name = $name;
        $results->publicId = $publicId;
        $results->format = $format;
        $results->resourceType = $resourceType;
        $results->tags = $tags;


        return $results;
    }

    public static function failed(string $msg): CloudinaryResults
    {
        $results = new CloudinaryResults();
        $results->isSuccess = false;
        $results->msg = $msg;
        return $results;
    }
}
