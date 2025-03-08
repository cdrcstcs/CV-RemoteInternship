<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\RecursiveTranslation;
use Illuminate\Support\Facades\Log;

class TranslateResponse
{
    protected $translator;

    public function __construct(RecursiveTranslation $translator)
    {
        $this->translator = $translator;
    }

    /**
     * Handle an incoming request and translate the response.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Log that the translation process is starting
        Log::info('Translation middleware started for user: ' . ($request->user() ? $request->user()->id : 'Guest'));

        // Get the response after the request is handled
        $response = $next($request);

        // Get the authenticated user's language, defaulting to 'en' if not set
        $userLanguage = $request->user() && $request->user()->language ? $request->user()->language : 'en';

        // Log the detected user language
        Log::info('Detected language for translation: ' . $userLanguage);

        // Check if the response is a JSON response
        if ($response instanceof \Illuminate\Http\JsonResponse) {
            // Log the content before translation (if not too large)
            Log::info('Original response content: ', (array) $response->getData(true));

            $content = $response->getData(true); // Get the response data as an array
            // Translate the content recursively
            $translatedContent = $this->translator->translate($content, $userLanguage);

            // Log the translated content (you may want to be cautious logging sensitive data)
            Log::info('Translated response content: ', (array) $translatedContent);

            // Update the response with the translated content
            $response->setData($translatedContent);
        }

        // Log when the translation process is complete
        Log::info('Translation middleware completed for user: ' . ($request->user() ? $request->user()->id : 'Guest'));

        return $response;
    }
}
