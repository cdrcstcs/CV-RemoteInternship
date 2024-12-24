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

        // Specify the allowed origin (e.g., frontend running at http://localhost:5173)
        // You can also use environment variables for dynamic origin configuration in production
        $allowedOrigin = 'http://localhost:5173';

        $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);  // Allow only specific origin
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, Origin'); // Allowed headers
        $response->headers->set('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, etc.)
        $response->headers->set('Access-Control-Max-Age', '3600000'); // Cache pre-flight response for 1 hour

        // Handle OPTIONS request (pre-flight requests)
        if ($request->getMethod() === 'OPTIONS') {
            return response()->json([], Response::HTTP_OK);
        }

        return $response;
    }
}
