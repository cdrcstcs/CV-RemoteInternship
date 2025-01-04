<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Category;
use App\Models\Inventory;
use App\Models\Warehouse;
use App\Models\Vehicle;
use App\Models\VehicleManagement;
use App\Models\Shipment;
use App\Models\Route;

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

        // Validate the incoming request for date filters (removed category validation)
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $startDate = $validated['start_date'] ?? null;
        $endDate = $validated['end_date'] ?? null;

        // Log the validated filter values (category has been removed)
        Log::info('Validated filter values:', [
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        // Get the warehouses managed by the current user
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

        // Aggregate the data without filtering by category
        $aggregatedData = collect($orderItems)->map(function ($orderItem) {
            $product = $orderItem->product;

            return [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'amount' => $orderItem->total_amount,
                'order_date' => $orderItem->order->order_date,  // Using the order's date here
            ];
        });

        // Log the structure of aggregatedData before processing further
        Log::info('Aggregated Data Structure:', $aggregatedData->toArray());

        // Now we can sum the amounts by product (instead of category) if needed
        $aggregatedData = $aggregatedData->groupBy('product_name')->map(function ($items) {
            Log::info('Processing group:', [
                'product_name' => $items->first()['product_name'] ?? 'N/A',
                'item_count' => $items->count(),
            ]);

            // Check if product_name exists before accessing it
            if (isset($items->first()['product_name'])) {
                $totalAmount = $items->map(function ($item) {
                    return $item['amount']; 
                })->sum(); 

                return [
                    'product_name' => $items->first()['product_name'],
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
                'name' => $item['product_name'],
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

    public function getInventoriesForWarehouse(Request $request)
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
    public function updateInventory(Request $request)
    {
        try {
            // Validate incoming data to ensure we have required fields
            $validated = $request->validate([
                'inventory_updates' => 'required|array',
                'inventory_updates.*.inventory_id' => 'required|exists:inventory,id',
                'inventory_updates.*.stock' => 'nullable|integer|min:0',
                'inventory_updates.*.weight_per_unit' => 'nullable|numeric|min:0',
            ]);

            // Loop through the updates and apply them
            $updatedInventories = [];

            foreach ($validated['inventory_updates'] as $update) {
                // Find the inventory by its ID and eager load the product
                $inventory = Inventory::with('product')->find($update['inventory_id']);

                if (!$inventory) {
                    return response()->json(['error' => 'Inventory not found.'], 404);
                }

                // Update the fields that are provided (stock and/or weight_per_unit)
                if (isset($update['stock'])) {
                    $inventory->stock = $update['stock'];
                }

                if (isset($update['weight_per_unit'])) {
                    $inventory->weight_per_unit = $update['weight_per_unit'];
                }

                // Update the 'last_updated' timestamp
                $inventory->last_updated = now();
                $inventory->save(); // Save the updated inventory

                // The product data is already eager loaded, so we can directly access it
                $product = $inventory->product;

                // Add the updated inventory and product details to the response
                $updatedInventories[] = [
                    'inventory_id' => $inventory->id,
                    'stock' => $inventory->stock,
                    'weight_per_unit' => $inventory->weight_per_unit,
                    'last_updated' => $inventory->last_updated,
                    'product' => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'sku' => $product->sku, // If SKU is needed, otherwise remove
                        'price' => $product->price, // If price is needed, otherwise remove
                    ]
                ];
            }

            return response()->json([
                'message' => 'Inventory updated successfully.',
                'updated_inventories' => $updatedInventories
            ]);

        } catch (\Exception $e) {
            // Log any exceptions that occur during the execution
            Log::error('Error occurred in updateInventory method:', [
                'message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            // Return a generic error response
            return response()->json(['error' => 'An error occurred while updating the inventory.'], 500);
        }
    }

    /**
     * Get an aggregated expense report with total shipment amounts, 
     * total maintenance costs, and total product expenses grouped by day.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function lineChart(Request $request)
    {
        try {
            Log::info('Incoming expense report request data:', $request->all());
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);
            $startDate = $validated['start_date'] ?? null;
            $endDate = $validated['end_date'] ?? null;
            Log::info('Validated filter values:', [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);

            // Get the warehouses managed by the current user
            $userWarehouses = Warehouse::where('users_id', $request->user()->id)->get();
            if ($userWarehouses->isEmpty()) {
                return response()->json(['error' => 'No warehouses found for this user.'], 404);
            }

            // Get all product IDs from the inventories of these warehouses
            $productIdsInWarehouse = Inventory::whereIn('warehouses_id', $userWarehouses->pluck('id'))
                ->pluck('products_id')
                ->unique();

            Log::info('Products in the managed warehouses:', $productIdsInWarehouse->toArray());

            // Query order items
            $orderItemsQuery = OrderItem::query()->with(['order'])
                ->whereIn('products_id', $productIdsInWarehouse)
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

            Log::info('Executing query for order items:', [
                'query' => $orderItemsQuery->toSql(),
                'bindings' => $orderItemsQuery->getBindings(),
            ]);

            $orderItems = $orderItemsQuery->get();
            Log::info('Fetched order items:', ['count' => $orderItems->count()]);

            // Aggregate product data (group by order date)
            $aggregatedProductData = collect($orderItems)->flatMap(function ($orderItem) {
                $product = $orderItem->product;
                $categoryNames = $product->categories->pluck('category_name')->toArray();
                return collect($categoryNames)->map(function ($categoryName) use ($orderItem, $product) {
                    return [
                        'category_name' => $categoryName,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'amount' => $orderItem->total_amount,
                        'order_date' => $orderItem->order->order_date, // This is the date to group by
                    ];
                });
            })->filter();

            // Aggregate the product data by order date and sum the amounts per date
            $aggregatedProductData = $aggregatedProductData->groupBy('order_date')->map(function ($items) {
                return [
                    'date' => $items->first()['order_date'],  // Use the order_date as the "date" key
                    'total_product_expenses' => $items->sum('amount'),
                ];
            });

            Log::info('Aggregated product expenses data:', $aggregatedProductData->toArray());

            // Query maintenance costs by date
            $maintenanceCostsQuery = VehicleManagement::query()
                ->selectRaw('DATE(last_maintenance_date) as date, SUM(maintenance_cost) as total_maintenance_cost')
                ->when($startDate, function ($query) use ($startDate) {
                    return $query->whereDate('last_maintenance_date', '>=', Carbon::parse($startDate));
                })
                ->when($endDate, function ($query) use ($endDate) {
                    return $query->whereDate('last_maintenance_date', '<=', Carbon::parse($endDate));
                })
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            Log::info('Maintenance cost data:', $maintenanceCostsQuery->toArray());

            // Query shipments by date
            $shipmentsQuery = Shipment::query()
                ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total_shipment_amount')
                ->when($startDate, function ($query) use ($startDate) {
                    return $query->whereDate('created_at', '>=', Carbon::parse($startDate));
                })
                ->when($endDate, function ($query) use ($endDate) {
                    return $query->whereDate('created_at', '<=', Carbon::parse($endDate));
                })
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            Log::info('Shipment data:', $shipmentsQuery->toArray());

            // Combine the data from product expenses, maintenance costs, and shipment amounts
            $combinedData = collect();

            // Add shipments data
            $shipmentsQuery->each(function ($shipment) use ($combinedData) {
                $combinedData->put($shipment->date, [
                    'date' => $shipment->date,
                    'total_shipment_amount' => $shipment->total_shipment_amount,
                    'total_maintenance_cost' => 0,
                    'total_product_expenses' => 0,
                ]);
            });

            // Add maintenance data
            $maintenanceCostsQuery->each(function ($maintenance) use ($combinedData) {
                $combinedData->put($maintenance->date, [
                    'date' => $maintenance->date,
                    'total_shipment_amount' => $combinedData->get($maintenance->date)['total_shipment_amount'] ?? 0,
                    'total_maintenance_cost' => $maintenance->total_maintenance_cost,
                    'total_product_expenses' => $combinedData->get($maintenance->date)['total_product_expenses'] ?? 0,
                ]);
            });

            // Add product expense data
            $aggregatedProductData->each(function ($item) use ($combinedData) {
                $combinedData->put($item['date'], [
                    'date' => $item['date'],
                    'total_shipment_amount' => $combinedData->get($item['date'])['total_shipment_amount'] ?? 0,
                    'total_maintenance_cost' => $combinedData->get($item['date'])['total_maintenance_cost'] ?? 0,
                    'total_product_expenses' => $item['total_product_expenses'],
                ]);
            });

            // Format the response
            $response = $combinedData->values();

            // Return the aggregated data as a JSON response
            return response()->json($response);
        } catch (\Exception $e) {
            Log::error('Error occurred in lineChart method:', [
                'message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'An error occurred while processing your request.'], 500);
        }
    }


    /**
     * Get aggregated warehouse count by country.
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getGeography(Request $request)
    {
        try {
            // Log the incoming request (optional)
            Log::info('Incoming geography request data:', $request->all());

            // Fetch all warehouses and their locations
            $warehouses = Warehouse::all();

            // Aggregate warehouse count by country (extracted from the location field)
            $mappedLocations = $warehouses->reduce(function ($acc, $warehouse) {
                // Extract the country from the location field
                $location = $warehouse->location;

                // Assume the country is the part after the last comma
                $country = $this->extractCountryFromLocation($location);

                // Initialize country if it doesn't exist in accumulator
                if (!isset($acc[$country])) {
                    $acc[$country] = 0;
                }

                // Increment the count for the country
                $acc[$country]++;
                return $acc;
            }, []);

            // Format the result into an array of objects with 'id' as country and 'value' as count
            $formattedLocations = collect($mappedLocations)->map(function ($count, $country) {
                return [
                    'id' => $country,  // Country name (or code)
                    'value' => $count  // Number of warehouses in this country
                ];
            })->values(); // Reset array keys

            // Return the formatted response
            return response()->json($formattedLocations, 200);

        } catch (\Exception $e) {
            // Log the exception error
            Log::error('Error occurred in getGeography method:', [
                'message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            // Return a generic error response
            return response()->json(['message' => 'An error occurred while fetching data.'], 500);
        }
    }

    /**
     * Extract country from a location string.
     *
     * @param  string  $location
     * @return string
     */
    private function extractCountryFromLocation($location)
    {
        // Split the location by commas
        $parts = explode(',', $location);

        // The country should be the last part of the array
        $country = trim(end($parts));

        // Return the country
        return $country;
    }
}
