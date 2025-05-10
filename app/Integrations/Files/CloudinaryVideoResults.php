<?php

namespace App\Integrations\Files;

class CloudinaryVideoResults
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
    public ?string $posterUrl = null; // ✅ added for video poster

    public static function success(
        string $secureUrl,
        string $insecureUrl,
        ?int $width,
        ?int $height,
        string $name,
        string $publicId,
        string $format,
        string $resourceType,
        array $tags,
        ?string $posterUrl = null // ✅ optional poster parameter
    ): CloudinaryVideoResults {
        $results = new CloudinaryVideoResults();
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
        $results->posterUrl = $posterUrl;

        return $results;
    }

    public static function failed(string $msg): CloudinaryVideoResults
    {
        $results = new CloudinaryVideoResults();
        $results->isSuccess = false;
        $results->msg = $msg;
        return $results;
    }
}
