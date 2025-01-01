<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{
    // Fetch ratings for a specific product
    public function getProductRatings($productId)
    {
        // Retrieve all ratings for a product
        $ratings = Rating::where('products_id', $productId)->get();

        return response()->json($ratings);
    }

    // Store a new rating/feedback for a product
    public function storeRating(Request $request, $productId)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'rating_value' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Store the rating
        $rating = new Rating();
        $rating->rating_value = $request->input('rating_value');
        $rating->feedback = $request->input('feedback');
        $rating->products_id = $productId;
        $rating->shipments_id = $request->input('shipments_id'); // Assuming you have a shipment_id if applicable
        $rating->date_created = now(); // Add the current timestamp
        $rating->save();

        return response()->json(['message' => 'Rating submitted successfully', 'rating' => $rating]);
    }
}
