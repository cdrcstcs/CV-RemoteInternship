<?php
   
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ExpenseController extends Controller
{
    /**
    * Get aggregated expense data (total cost by category or product).
    *
    * @param  Request  $request
    * @return \Illuminate\Http\JsonResponse
    */
    public function filterExpenses(Request $request)
    {
        try {
            // Log incoming request parameters
            Log::info('Incoming request data:', $request->all());

            // Validate the incoming request for date filters and category
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'category' => 'nullable|string',
            ]);

            $startDate = $validated['start_date'] ?? null;
            $endDate = $validated['end_date'] ?? null;
            $categoryFilter = $validated['category'] ?? null;

            // Log the validated filter values
            Log::info('Validated filter values:', [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'category' => $categoryFilter,
            ]);

            // Start by querying the orders and joining with order items
            $ordersQuery = OrderItem::query()
                ->with(['order'])  // eager load relationships
                ->when($startDate, function ($query) use ($startDate) {
                    return $query->whereHas('order', function ($query) use ($startDate) {
                        $query->whereDate('order_date', '>=', Carbon::parse($startDate));
                    });
                })
                ->when($endDate, function ($query) use ($endDate) {
                    return $query->whereHas('order', function ($query) use ($endDate) {
                        $query->whereDate('order_date', '<=', Carbon::parse($endDate));
                    });
                });

            // Log the SQL query before executing
            Log::info('Executing query for order items:', [
                'query' => $ordersQuery->toSql(),
                'bindings' => $ordersQuery->getBindings(),
            ]);

            // Get the order items
            $orderItems = $ordersQuery->get();
            Log::info('Fetched order items:', ['count' => $orderItems->count()]);

            // Aggregate the data by category, filtering by category if needed
            $aggregatedData = collect($orderItems)->flatMap(function ($orderItem) use ($categoryFilter) {
                $product = $orderItem->product;
                $categoryNames = $product->categories->pluck('category_name')->toArray();

                // If there's a category filter, check if the product belongs to the selected category
                if ($categoryFilter && !in_array($categoryFilter, $categoryNames)) {
                    return null; // Skip this item if it doesn't belong to the selected category
                }

                // Aggregate by product and category
                return collect($categoryNames)->map(function ($categoryName) use ($orderItem, $product) {
                    return [
                        'category_name' => $categoryName,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'amount' => $orderItem->total_amount,
                        'order_date' => $orderItem->order->order_date,  // Using the order's date here
                    ];
                });
            })->filter();

            // Log the structure of aggregatedData before processing further
            Log::info('Aggregated Data Structure:', $aggregatedData->toArray());

            // Group by category and product, then sum the amounts
            $aggregatedData = $aggregatedData->groupBy(['category_name'])->map(function ($items) {
                Log::info('Processing group:', [
                    'category_name' => $items->first()['category_name'] ?? 'N/A',
                    'item_count' => $items->count(),
                ]);
    
                // Check if product_name exists before accessing it
                if (isset($items->first()['category_name'])) {
                    $totalAmount = $items->map(function ($item) {
                        return $item['amount']; 
                    })->sum(); 
                    
                    return [
                        'category_name' => $items->first()['category_name'],
                        'total_amount' => $totalAmount,
                    ];
                } else {
                    return null; // Handle missing product_name
                }
            })->filter(); // Remove any null values

            // Log the aggregated data before returning
            Log::info('Aggregated data after grouping and summing:', $aggregatedData->toArray());

            // Prepare the response format
            $response = $aggregatedData->map(function ($item) {
                return [
                    'name' => $item['category_name'],
                    'amount' => $item['total_amount'],
                ];
            });

            // Log the final response data
            Log::info('Response data:', $response->toArray());

            return response()->json($response);

        } catch (\Exception $e) {
            // Log any exceptions that occur during the execution
            Log::error('Error occurred in filterExpenses method:', [
                'message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            // Return a generic error response
            return response()->json(['error' => 'An error occurred while processing your request.'], 500);
        }
    }
}
