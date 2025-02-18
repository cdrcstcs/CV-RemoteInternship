<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Integrations\files\CloudinaryImageClient; // Use the custom Cloudinary client

class PostController extends Controller
{

    protected $cloudinaryClient;

    public function __construct()
    {
        // Initialize custom Cloudinary image client
        $this->cloudinaryClient = new CloudinaryImageClient();
    }
    public function getFeedPosts(Request $request)
    {
        try {
            $posts = Post::with([
                'author:id,first_name,last_name,phone_number,email,language,profile_picture,banner_img,headline,about',
                'comments.user:id,first_name,last_name,phone_number,email,language,profile_picture,banner_img,headline,about',
                'likes'
            ])
            ->orderBy('created_at', 'desc')
            ->get();
            

            return response()->json($posts, 200);
        } catch (\Exception $error) {
            Log::error("Error in getFeedPosts controller: ", ['error' => $error]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    public function createPost(Request $request)
    {
        try {
            // Validate the incoming request
            $request->validate([
                'content' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $imageUrl = null;

            // Check if an image file is provided
            if ($request->hasFile('image')) {
                $uploadedFile = $request->file('image');
                $mimeType = $uploadedFile->getClientMimeType();
                $base64Contents = base64_encode($uploadedFile->getContent());

                // Upload image to Cloudinary using the custom Cloudinary client
                $uploadResult = $this->cloudinaryClient->uploadImage($mimeType, $base64Contents);

                // Check the upload result
                if ($uploadResult->isSuccess) {
                    $imageUrl = $uploadResult->secureUrl;
                    Log::info('Post image uploaded to Cloudinary', ['image_url' => $imageUrl]);
                } else {
                    // If upload failed, throw an exception with the message from Cloudinary
                    throw new \Exception("Cloudinary image upload failed: " . $uploadResult->msg);
                }
            }

            // Create the new post in the database
            $newPost = Post::create([
                'author_id' => $request->user()->id,
                'content' => $request->input('content'),
                'image' => $imageUrl,
            ]);

            // Return the newly created post along with its author relationship
            return response()->json($newPost->load('author'), 201);
        } catch (\Exception $error) {
            // Log the exception for debugging
            Log::error("Error in createPost controller: ", [
                'error' => $error->getMessage(),
                'stack' => $error->getTraceAsString(),
            ]);

            // Return a generic server error response
            return response()->json(['message' => 'Server error'], 500);
        }
    }


    public function deletePost(Request $request, $id)
    {
        try {
            $post = Post::findOrFail($id);

            if ($post->author_id !== $request->user()->id) {
                return response()->json(['message' => 'You are not authorized to delete this post'], 403);
            }

            // Delete the image from storage if it exists
            if ($post->image) {
                $imagePath = str_replace('/storage/', '', $post->image);
                Storage::disk('public')->delete($imagePath);
            }

            $post->delete();

            return response()->json(['message' => 'Post deleted successfully'], 200);
        } catch (\Exception $error) {
            Log::error("Error in deletePost controller: ", ['error' => $error]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    public function getPostById(Request $request, $id)
    {
        try {
            $post = Post::with(['author:id,first_name,last_name,phone_number,email,language,profile_picture,banner_img,headline,about', 'comments.user:id,first_name,last_name,phone_number,email,language,profile_picture,banner_img,headline,about'])
                ->findOrFail($id);

            return response()->json($post, 200);
        } catch (\Exception $error) {
            Log::error("Error in getPostById controller: ", ['error' => $error]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    public function createComment(Request $request, $id)
    {
        try {
            $request->validate(['content' => 'required|string']);
            $post = Post::findOrFail($id);

            $comment = $post->comments()->create([
                'user_id' => $request->user()->id,
                'content' => $request->input('content'),
            ]);

            // Create a notification if the comment owner is not the post owner
            if ($post->author_id !== $request->user()->id) {
                Notification::create([
                    'recipient_id' => $post->author_id,
                    'type' => 'comment',
                    'related_user' => $request->user()->id,
                    'related_post' => $id,
                ]);
            }

            return response()->json($comment->load('user:id,first_name,last_name,phone_number,email,language,profile_picture,banner_img,headline,about'), 201);
        } catch (\Exception $error) {
            Log::error("Error in createComment controller: ", ['error' => $error]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    public function likePost(Request $request, $id)
    {
        try {
            $post = Post::findOrFail($id);
            $userId = $request->user()->id;

            if ($post->likes()->where('user_id', $userId)->exists()) {
                // Unlike the post
                $post->likes()->detach($userId);
            } else {
                // Like the post
                $post->likes()->attach($userId);
                // Create a notification if the post owner is not the user who liked
                if ($post->author_id !== $userId) {
                    Notification::create([
                        'recipient_id' => $post->author_id,
                        'type' => 'like',
                        'related_user' => $userId,
                        'related_post' => $id,
                    ]);
                }
            }

            return response()->json($post->load('likes'), 200);
        } catch (\Exception $error) {
            Log::error("Error in likePost controller: ", ['error' => $error]);
            return response()->json(['message' => 'Server error'], 500);
        }
    }
}
