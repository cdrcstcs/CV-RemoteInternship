<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Cloudinary\Cloudinary;
use Cloudinary\Uploader;
use Cloudinary\Api\Upload\UploadApi;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    protected $cloudinary;

    public function __construct()
    {
        // Initialize Cloudinary instance with configuration
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key' => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET')
            ]
        ]);
    }
    
    public function fetchProductById($id)
    {
        try {
            // Fetch product along with its categories and supplier (using eager loading)
            $product = Product::with(['categories', 'supplier'])
                ->findOrFail($id); // This will throw a ModelNotFoundException if the product is not found

            return response()->json($product, 200); // Return the product data as JSON response
        } catch (ModelNotFoundException $e) {
            // Return a 404 error if product not found
            return response()->json([
                'error' => 'Product not found'
            ], 404);
        }
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

            // If not in Redis, fetch from database
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
                'isFeatured' => 'nullable|boolean',  // Add validation for isFeatured
            ]);

            // Handle image upload to Cloudinary
            $imageUrl = '';
            if ($request->hasFile('image')) {
                $uploadedFile = $request->file('image');
                $uploadResponse = Uploader::upload($uploadedFile->getRealPath(), [
                    'folder' => 'products',
                ]);
                $imageUrl = $uploadResponse['secure_url'];
            }

            $product = Product::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'image' => $imageUrl,
                'category' => $validated['category'],
                'isFeatured' => $validated['isFeatured'] ?? false,  // Default to false if not provided
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

            // Delete the image from Cloudinary if it exists
            if ($product->image) {
                $publicId = basename(parse_url($product->image, PHP_URL_PATH), ".jpg");
                Uploader::destroy('products/' . $publicId);
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

     public function getProductsByCategory(Request $request)
    {
        try {
            // Get the categories array from the request input
            $categoriesInput = $request->input('categories');

            // Check if the categories input is provided and is an array
            if (empty($categoriesInput) || !is_array($categoriesInput)) {
                // Log the error
                Log::warning('Categories input is empty or not an array');
                
                // Return a response with a specific message for invalid categories input
                return response()->json(['message' => 'Categories input must be a non-empty array'], 400);
            }

            // Log the incoming categories input
            Log::info('Searching for products by categories', ['categories' => $categoriesInput]);

            // Normalize the category input (lowercase all category names)
            $categoriesInput = array_map('strtolower', $categoriesInput);

            // Search for categories where the category_name or description contains any of the provided categories (case-insensitive)
            $categories = Category::where(function ($query) use ($categoriesInput) {
                foreach ($categoriesInput as $category) {
                    $query->orWhereRaw('LOWER(category_name) LIKE ?', ['%' . $category . '%'])
                        ->orWhereRaw('LOWER(description) LIKE ?', ['%' . $category . '%']);
                }
            })->get();

            // Log the found categories
            Log::info('Categories found', ['categories' => $categories->pluck('category_name')]);

            // Check if any categories were found
            if ($categories->isEmpty()) {
                Log::warning('No categories found', ['categories' => $categoriesInput]);
                return response()->json(['message' => 'No categories found for the given search terms'], 404);
            }

            // Collect all products related to these categories using the pivot table
            $products = $categories->flatMap(function ($category) {
                return $category->products; // Fetch related products for each category
            });

            // Log the found products
            Log::info('Products found for categories', ['products' => $products->pluck('name')]);

            // Return the unique products (to avoid duplicates)
            return response()->json(['products' => $products->unique('id')]);

        } catch (\Exception $e) {
            // Log the general error
            Log::error('Error fetching products by categories', [
                'error' => $e->getMessage(),
                'stack' => $e->getTraceAsString()
            ]);

            // Handle any potential errors
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
