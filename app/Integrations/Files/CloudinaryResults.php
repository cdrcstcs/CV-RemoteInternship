<?php

namespace App\Integrations\Files;

class CloudinaryResults
{
    public bool $isSuccess;
    public string $insecureUrl;
    public string $secureUrl;
    public string $msg;

    public static function success(string $secureUrl, string $insecureUrl): CloudinaryResults
    {
        $results = new CloudinaryResults();
        $results->isSuccess = true;
        $results->secureUrl = $secureUrl;
        $results->insecureUrl = $insecureUrl;
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
