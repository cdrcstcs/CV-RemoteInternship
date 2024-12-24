<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Cloudinary\Cloudinary;
use Cloudinary\Api\Upload\UploadApi;

class ProductController extends Controller
{
    public function __construct()
    {
        // Cloudinary configuration
        \Cloudinary::config([
            'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
            'api_key' => env('CLOUDINARY_API_KEY'),
            'api_secret' => env('CLOUDINARY_API_SECRET')
        ]);
    }

    /**
     * Get all products
     */
    public function getAllProducts()
    {
        try {
            $products = Product::all();
            return response()->json(['products' => $products]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get featured products from cache or DB
     */
    public function getFeaturedProducts()
    {
        try {
            // First check Redis cache
            $featuredProducts = Cache::get('featured_products');

            if ($featuredProducts) {
                return response()->json(json_decode($featuredProducts));
            }

            // If not in Redis, fetch from MongoDB
            $featuredProducts = Product::where('isFeatured', true)->get();

            if ($featuredProducts->isEmpty()) {
                return response()->json(['message' => 'No featured products found'], 404);
            }

            // Store in Redis for future requests
            Cache::put('featured_products', $featuredProducts->toJson(), now()->addMinutes(10));

            return response()->json($featuredProducts);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a new product
     */
    public function createProduct(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'image' => 'nullable|image',
                'category' => 'nullable|string',
            ]);

            $imageUrl = '';
            if ($request->hasFile('image')) {
                $uploadedFile = $request->file('image');
                $uploadResponse = \Cloudinary\Uploader::upload($uploadedFile->getRealPath(), [
                    'folder' => 'products'
                ]);
                $imageUrl = $uploadResponse['secure_url'];
            }

            $product = Product::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'image' => $imageUrl,
                'category' => $validated['category'],
            ]);

            return response()->json($product, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete product
     */
    public function deleteProduct($id)
    {
        try {
            $product = Product::findOrFail($id);

            // Delete the image from Cloudinary
            if ($product->image) {
                $publicId = basename(parse_url($product->image, PHP_URL_PATH), ".jpg");
                \Cloudinary\Uploader::destroy('products/' . $publicId);
            }

            $product->delete();

            // Clear cache after product deletion
            Cache::forget('featured_products');

            return response()->json(['message' => 'Product deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get recommended products (random sample)
     */
    public function getRecommendedProducts()
    {
        try {
            $products = Product::inRandomOrder()->limit(4)->get();
            return response()->json($products);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get products by category
     */
    public function getProductsByCategory($category)
    {
        try {
            $products = Product::where('category', $category)->get();
            return response()->json(['products' => $products]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Toggle the featured status of a product
     */
    public function toggleFeaturedProduct($id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->isFeatured = !$product->isFeatured;
            $product->save();

            // Update cache after toggling featured status
            $this->updateFeaturedProductsCache();

            return response()->json($product);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update featured products cache
     */
    private function updateFeaturedProductsCache()
    {
        try {
            $featuredProducts = Product::where('isFeatured', true)->get();
            Cache::put('featured_products', $featuredProducts->toJson(), now()->addMinutes(10));
        } catch (\Exception $e) {
            \Log::error('Error updating featured products cache: ' . $e->getMessage());
        }
    }
}
