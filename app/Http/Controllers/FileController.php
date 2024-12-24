<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CloudinaryService;

class FileController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,webp,mp4|max:10240', // max file size 10MB
        ]);

        $file = $request->file('file');
        
        // Upload to Cloudinary
        $response = $this->cloudinaryService->uploadImage($file->getPathname());
        
        if (isset($response['error'])) {
            return response()->json(['error' => $response['error']], 500);
        }

        // Successfully uploaded file to Cloudinary
        return response()->json([
            'message' => 'File uploaded successfully',
            'url' => $response['secure_url'],
            'public_id' => $response['public_id']
        ]);
    }
}
