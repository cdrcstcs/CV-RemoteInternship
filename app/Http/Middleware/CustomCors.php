<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomCors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Illuminate\Http\Response
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Add CORS headers
        $response->headers->set('Access-Control-Allow-Origin', '*');  // Allow all origins (use specific origin in production)
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Origin'); // Allowed headers
        $response->headers->set('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, etc.)
        $response->headers->set('Access-Control-Max-Age', '3600'); // Cache pre-flight response for 1 hour

        // Handle OPTIONS request (pre-flight requests)
        if ($request->getMethod() === 'OPTIONS') {
            return response()->json([], Response::HTTP_OK);
        }

        return $response;
    }
}
