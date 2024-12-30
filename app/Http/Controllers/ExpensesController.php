<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ExpensesController extends Controller
{
    /**
     * Get aggregated expense data (total cost by category or product).
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function filterExpenses(Request $request)
    {
        // Validate the incoming request for date filters and category
        $validated = $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'category' => 'nullable|string',
        ]);
        $startDate = $validated['start_date'] ?? null;
        $endDate = $validated['end_date'] ?? null;
        $categoryFilter = $validated['category'] ?? null;
        $ordersQuery = Order::with('orderItems.product')
            ->when($startDate, function ($query) use ($startDate) {
                return $query->whereDate('order_date', '>=', Carbon::parse($startDate));
            })
            ->when($endDate, function ($query) use ($endDate) {
                return $query->whereDate('order_date', '<=', Carbon::parse($endDate));
            });
        $orders = $ordersQuery->get();
        $aggregatedData = $orders->flatMap(function ($order) use ($categoryFilter) {
            return $order->orderItems->map(function ($orderItem) use ($categoryFilter) {
                $product = $orderItem->product;
                $categoryNames = $product->categories->pluck('category_name')->toArray();

                // If there's a category filter, check if product belongs to the selected category
                if ($categoryFilter && !in_array($categoryFilter, $categoryNames)) {
                    return null; // Skip this item if it doesn't belong to the selected category
                }

                return [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'amount' => $orderItem->total_amount,
                    'categories' => $categoryNames,
                    'order_date' => $order->order_date,
                ];
            });
        })->filter()->groupBy('product_name')->map(function ($items, $productName) {
            $totalAmount = $items->sum('amount');
            return [
                'product_name' => $productName,
                'total_amount' => $totalAmount,
                'categories' => $items->first()['categories'],
            ];
        });

        // Prepare the response format
        $response = $aggregatedData->map(function ($item) {
            return [
                'name' => $item['product_name'],
                'amount' => $item['total_amount'],
                'categories' => $item['categories'],
            ];
        });

        return response()->json($response);
    }
}
