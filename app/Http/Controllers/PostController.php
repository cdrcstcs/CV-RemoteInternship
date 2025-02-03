<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    public function getFeedPosts(Request $request)
    {
        try {
            $posts = Post::with([
                    'author:id,name,username,profile_picture,headline',
                    'comments.user:id,name,profile_picture',
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
            $request->validate([
                'content' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $imageUrl = null;

            if ($request->hasFile('image')) {
                $uploadedFile = $request->file('image');
                $path = $uploadedFile->store('post_images', 'public');
                $imageUrl = Storage::url($path);
            }

            $newPost = Post::create([
                'author_id' => $request->user()->id,
                'content' => $request->input('content'),
                'image' => $imageUrl,
            ]);

            return response()->json($newPost->load('author'), 201);
        } catch (\Exception $error) {
            Log::error("Error in createPost controller: ", ['error' => $error]);
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
            $post = Post::with(['author:id,name,username,profile_picture,headline', 'comments.user:id,name,profile_picture,username,headline'])
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

            return response()->json($comment->load('user:id,name,profile_picture'), 201);
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
