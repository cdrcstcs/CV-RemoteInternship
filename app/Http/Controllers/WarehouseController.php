<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Category;
use App\Models\Inventory;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class WarehouseController extends Controller
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

            // Get the warehouse(s) managed by the current user
            $userWarehouses = Warehouse::where('users_id', $request->user()->id)->get();

            if ($userWarehouses->isEmpty()) {
                return response()->json(['error' => 'No warehouses found for this user.'], 404);
            }

            // Get all product IDs from the inventories of these warehouses
            $productIdsInWarehouse = Inventory::whereIn('warehouses_id', $userWarehouses->pluck('id'))
                ->pluck('products_id')
                ->unique(); // Get unique product IDs

            // Log the product IDs from the warehouse inventory
            Log::info('Products in the managed warehouses:', $productIdsInWarehouse->toArray());

            // Start by querying the orders and joining with order items
            $ordersQuery = OrderItem::query()
                ->with(['order'])  // eager load relationships
                ->whereIn('products_id', $productIdsInWarehouse) // Filter by product IDs in the warehouse inventory
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
    
                // Check if category_name exists before accessing it
                if (isset($items->first()['category_name'])) {
                    $totalAmount = $items->map(function ($item) {
                        return $item['amount']; 
                    })->sum(); 
                    
                    return [
                        'category_name' => $items->first()['category_name'],
                        'total_amount' => $totalAmount,
                    ];
                } else {
                    return null; // Handle missing category_name
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
    public function getProductsForWarehouse(Request $request)
    {
        try {
            // Get the warehouses managed by the current user
            $userWarehouses = Warehouse::where('users_id', $request->user()->id)->get();

            if ($userWarehouses->isEmpty()) {
                return response()->json(['error' => 'No warehouses found for this user.'], 404);
            }

            // Get all product IDs from the inventories of these warehouses, ensuring uniqueness
            $productsInWarehouse = Inventory::whereIn('warehouses_id', $userWarehouses->pluck('id'))
                ->with('product')
                ->distinct('products_id') // Get unique products by product_id
                ->get();

            // If no products found, return a 404 response
            if ($productsInWarehouse->isEmpty()) {
                return response()->json(['error' => 'No products found for the warehouses.'], 404);
            }

            return response()->json($productsInWarehouse);
        } catch (\Exception $e) {
            // Log any exceptions that occur during the execution
            Log::error('Error occurred in getProductsForWarehouse method:', [
                'message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            // Return a generic error response
            return response()->json(['error' => 'An error occurred while processing your request.'], 500);
        }
    }

}
