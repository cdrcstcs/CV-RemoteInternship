<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Category;
use App\Models\Inventory;
use App\Models\Warehouse;
use App\Models\VehicleManagement;
use App\Models\Shipment;
use App\Models\Route;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Integrations\files\CloudinaryImageClient; // Use the custom Cloudinary client
use App\Events\OrderStatusUpdated;

class WarehouseController extends Controller
{
    protected $cloudinaryClient;

    public function __construct()
    {
        // Initialize custom Cloudinary image client
        $this->cloudinaryClient = new CloudinaryImageClient();
    }

    public function createInventory(Request $request)
    {
        // Log the incoming request data
        Log::info('Create Inventory request received', [
            'user_id' => $request->user()->id,
            'product_details' => $request->input('product'),
            'inventory_details' => $request->input('inventory')
        ]);

        // Get the user's warehouses
        $userWarehouses = Warehouse::where('users_id', $request->user()->id)->get();

        // If no warehouses are found for the user, return an error
        if ($userWarehouses->isEmpty()) {
            Log::warning('No warehouses found for the user', ['user_id' => $request->user()->id]);
            return response()->json(['message' => 'No warehouses found for this user.'], 400);
        }

        // Select the first warehouse (default)
        $defaultWarehouse = $userWarehouses->first();
        Log::info('Selected default warehouse', ['warehouse_id' => $defaultWarehouse->id]);

        try {
            // Validate the incoming request
            $validated = $request->validate([
                'product' => [
                    'name' => ['required', 'string'],
                    'description' => ['required', 'string'],
                    'price' => ['required', 'numeric'],
                    'image' => ['nullable', 'image'],
                    'category' => ['nullable', 'string'],
                    'isFeatured' => ['nullable', 'boolean'],  // Default to false if not provided
                ],
                'inventory' => [
                    'stock' => ['required', 'numeric'],
                    'weightPerUnit' => ['required', 'numeric'],
                ]
            ]);

            // Log the validated product and inventory data
            Log::info('Validated product and inventory data', [
                'product' => $validated['product'],
                'inventory' => $validated['inventory']
            ]);

            // Handle image upload to Cloudinary
            $imageUrl = '';
            if ($request->hasFile('product.image')) {
                try {
                    // Retrieve the image file
                    $uploadedFile = $request->file('product.image');
                    $mimeType = $uploadedFile->getClientMimeType();
                    $base64Contents = base64_encode($uploadedFile->getContent());

                    // Upload image using custom Cloudinary client
                    $uploadResult = $this->cloudinaryClient->uploadImage($mimeType, $base64Contents);
                    
                    // If the upload is successful, we get the secure URL
                    if ($uploadResult->isSuccess) {
                        $imageUrl = $uploadResult->secureUrl;
                        Log::info('Product image uploaded to Cloudinary', ['image_url' => $imageUrl]);
                    } else {
                        throw new \Exception("Cloudinary image upload failed: " . $uploadResult->msg);
                    }
                } catch (\Exception $e) {
                    Log::error('Error uploading image to Cloudinary', [
                        'error_message' => $e->getMessage(),
                        'image' => $uploadedFile->getClientOriginalName()
                    ]);
                    throw $e;  // Re-throw the exception after logging it
                }
            }

            // Create Product (First, handle the product)
            $product = Product::create([
                'name' => $validated['product']['name'],
                'description' => $validated['product']['description'],
                'price' => $validated['product']['price'],
                'image' => $imageUrl,
                'category' => $validated['product']['category'],
                'isFeatured' => $validated['product']['isFeatured'] == true,
            ]);
            Log::info('Product created successfully', ['product_id' => $product->id, 'product_name' => $product->name]);

            // Create Inventory (After creating the product)
            $inventory = Inventory::create([
                'stock' => $validated['inventory']['stock'],
                'last_updated' => Carbon::now(),
                'weight_per_unit' => $validated['inventory']['weightPerUnit'],
                'products_id' => $product->id,  // Link inventory to the newly created product
                'warehouses_id' => $defaultWarehouse->id,  // Use the first warehouse from the user's warehouses
            ]);
            Log::info('Inventory created and linked to product', ['inventory_id' => $inventory->id, 'product_id' => $product->id]);

            // Return both the created product and inventory
            return response()->json(['product' => $product, 'inventory' => $inventory], 201);
        } catch (\Exception $e) {
            // Log any exception that occurs during the process
            Log::error('Error creating product and inventory', [
                'user_id' => $request->user()->id,
                'error_message' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get the total weight of inventory and capacity for the warehouse owned by the authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTotalInventoryWeightForUserWarehouse(Request $request)
    {
        try {
            // Get the warehouse managed by the current user (assuming only one warehouse)
            $warehouse = Warehouse::where('users_id', $request->user()->id)->first();

            // Check if the user has a warehouse
            if (!$warehouse) {
                return response()->json(['error' => 'No warehouse found for this user.'], 404);
            }

            // Get all inventories for the user's warehouse
            $inventories = Inventory::where('warehouses_id', $warehouse->id)
                ->with('product') // Eager load product to get weight_per_unit
                ->get();

            // Calculate total weight for the warehouse
            $totalWeight = 0;
            foreach ($inventories as $inventory) {
                // Calculate weight for this inventory (stock * weight_per_unit)
                $totalWeight += $inventory->stock * $inventory->weight_per_unit;
            }

            // Prepare the response data
            $responseData = [
                'warehouse_name' => $warehouse->warehouse_name,
                'total_weight' => $totalWeight,
                'capacity' => $warehouse->capacity // Include warehouse capacity in the response
            ];

            // Return the total weight and warehouse capacity
            return response()->json($responseData);

        } catch (\Exception $e) {
            // Log the exception and return a generic error message
            \Log::error('Error occurred while calculating total inventory weight: ' . $e->getMessage());

            return response()->json(['error' => 'An error occurred while processing your request.'], 500);
        }
    }

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
            // Log incoming request parameters
            Log::info('Request received in getInventoriesForWarehouse', [
                'user_id' => $request->user()->id,
                'product_name' => $request->input('product_name'),
                'category' => $request->input('category')
            ]);

            // Get the warehouses managed by the current user
            $userWarehouses = Warehouse::where('users_id', $request->user()->id)->get();

            // Log the warehouses fetched
            Log::info('Warehouses fetched for user', [
                'user_warehouses_count' => $userWarehouses->count(),
                'warehouses' => $userWarehouses->pluck('id')->toArray()
            ]);

            if ($userWarehouses->isEmpty()) {
                return response()->json(['error' => 'No warehouses found for this user.'], 404);
            }

            // Start building the query to get inventories
            $query = Inventory::whereIn('warehouses_id', $userWarehouses->pluck('id'))
                ->with(['product', 'product.categories'])  // Eager load product and its categories
                ->distinct('products_id'); // Get unique products by product_id

            // Apply filters if provided in the request
            if ($request->has('product_name')) {
                $query->whereHas('product', function ($query) use ($request) {
                    $query->where('name', 'like', '%' . $request->input('product_name') . '%');
                });
            }

            // Filter by category if provided
            if ($request->has('category')) {
                $query->whereHas('product.categories', function ($query) use ($request) {
                    $query->where('category_name', 'like', '%' . $request->input('category') . '%');
                });
            }

            // Log the final query before executing
            Log::info('Query built for fetching products in warehouse', [
                'query' => $query->toSql(),
                'bindings' => $query->getBindings()
            ]);

            // Execute the query
            $productsInWarehouse = $query->get();

            // Log the result of the query
            Log::info('Products fetched from warehouse', [
                'products_count' => $productsInWarehouse->count(),
                'products' => $productsInWarehouse->pluck('product.name')->toArray()
            ]);

            // If no products found, return a 404 response
            if ($productsInWarehouse->isEmpty()) {
                return response()->json(['error' => 'No products found for the warehouses with the given filters.'], 404);
            }

            // Return the products with their categories
            return response()->json($productsInWarehouse->map(function ($inventory) {
                return [
                    'product' => $inventory->product,
                    'categories' => $inventory->product->categories, // Add product categories to the response
                    'stock' => $inventory->stock,
                    'weight_per_unit' => $inventory->weight_per_unit,
                    'warehouse_id' => $inventory->warehouses_id
                ];
            }));

        } catch (\Exception $e) {
            // Log any exceptions that occur during the execution
            Log::error('Error occurred in getInventoriesForWarehouse method:', [
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

    public function getOrdersByUserWarehouse(Request $request)
    {
        try {
            // Log incoming request parameters
            Log::info('Incoming request data:', $request->all());

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
                ->whereHas('order', function ($query) {
                    // Filter orders that are marked as 'Paid'
                    $query->where('status', 'Paid');
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
            $response = collect($orderItems)->map(function ($orderItem) {
                return $orderItem->order;  // Return the entire order associated with the order item
            });

            // Log the response data before returning
            Log::info('Response data:', $response->toArray());

            return response()->json($response);

        } catch (\Exception $e) {
            // Log any exceptions that occur during the execution
            Log::error('Error occurred in getOrdersByUserWarehouse method:', [
                'message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            // Return a generic error response
            return response()->json(['error' => 'An error occurred while processing your request.'], 500);
        }
    }

    public function updateOrderStatus(Request $request, $orderId)
    {
        try {
            // Log incoming request parameters
            Log::info('Incoming request data for updating order status:', $request->all());

            // Validate the incoming request to ensure the new status is provided
            $validated = $request->validate([
                'status' => 'required|string', // List the possible statuses
            ]);

            $newStatus = $validated['status'];

            // Get the order by ID
            $order = Order::find($orderId);

            if (!$order) {
                return response()->json(['error' => 'Order not found.'], 404);
            }

            // Get the warehouses that belong to the user
            $userWarehouses = Warehouse::where('users_id', $request->user()->id)->get();
            if ($userWarehouses->isEmpty()) {
                return response()->json(['error' => 'No warehouses found for this user.'], 404);
            }

            // Get all product IDs from the inventories of these warehouses
            $productIdsInWarehouse = Inventory::whereIn('warehouses_id', $userWarehouses->pluck('id'))
                ->pluck('products_id')
                ->unique();

            Log::info('Products in the managed warehouses:', $productIdsInWarehouse->toArray());

            // Query order items for the given order to ensure they belong to this order and their products exist in the managed warehouses
            $orderItems = OrderItem::where('orders_id', $orderId) // Ensure these items are for the correct order
                ->whereIn('products_id', $productIdsInWarehouse) // Ensure the products are available in the user's warehouses
                ->get();

            if ($orderItems->isEmpty()) {
                return response()->json(['error' => 'No valid order items found in the managed warehouses for this order.'], 404);
            }

            // Update the status of the order
            $order->status = $newStatus;
            $order->save();

            // Log the status update
            Log::info('Order status updated successfully:', [
                'order_id' => $orderId,
                'new_status' => $newStatus,
            ]);
            event(new OrderStatusUpdated($order));

            // Return the updated order details
            return response()->json([
                'message' => 'Order status updated successfully.',
                'order' => $order,
            ]);

        } catch (\Exception $e) {
            // Log any exceptions that occur during the execution
            Log::error('Error occurred in updateOrderStatus method:', [
                'message' => $e->getMessage(),
                'stack' => $e->getTraceAsString(),
            ]);

            // Return a generic error response
            return response()->json(['error' => 'An error occurred while processing your request.'], 500);
        }
    }


}
