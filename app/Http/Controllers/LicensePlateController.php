<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Illuminate\Http\Request;

class LicensePlateController extends Controller
{
    // Define the URL of the FastAPI server
    protected $fastApiUrl = 'http://localhost:5000/recognise'; // Replace with your FastAPI URL

    // Function to handle the image upload and call FastAPI
    public function processLicensePlate(Request $request)
    {
        // Increase the max execution time to 1 hour (3600 seconds)
        set_time_limit(3600); // Set to 1 hour

        // Log the incoming request
        Log::info('Received a request to process a license plate image.', [
            'request_data' => $request->all(),
        ]);

        // Validate the incoming request to ensure a file is present
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:10240', // 10MB max image size
        ]);

        // Get the uploaded file from the request
        $image = $request->file('image');

        try {
            // Convert the image to base64 string
            $imageData = base64_encode(file_get_contents($image->getRealPath()));

            // Log the base64 image data (or part of it) for debugging
            Log::info('Converted image to base64 for sending to FastAPI.', [
                'image_name' => $image->getClientOriginalName(),
                'image_base64' => substr($imageData, 0, 50),  // Log only part of the base64 string
            ]);

            // Send the base64-encoded image to FastAPI with a longer timeout (1 hour)
            $response = Http::timeout(3600)->post($this->fastApiUrl, [
                'image' => $imageData, // Send base64 encoded image
            ]);

            // Log the response from FastAPI
            Log::info('Response from FastAPI server:', [
                'response_status' => $response->status(),
                'response_body' => $response->body(),
            ]);

            // Check if the request to FastAPI was successful
            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'success' => true,
                    'license_plate_results' => $data,
                ]);
            } else {
                return response()->json(['success' => false, 'message' => 'Error from FastAPI server']);
            }
        } catch (FileException $e) {
            Log::error('File upload error.', ['exception' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'File upload error: ' . $e->getMessage()]);
        } catch (\Exception $e) {
            Log::error('General error during license plate processing.', ['exception' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
        }
    }
}
