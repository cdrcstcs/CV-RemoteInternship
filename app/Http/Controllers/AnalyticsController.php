<?php
// app/Http/Controllers/AnalyticsController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;

class AnalyticsController extends Controller
{

    public function getAnalyticsData()
    {
        try {
            // Get total users and products count
            $totalUsers = User::count();
            $totalProducts = Product::count();

            // Get sales data
            $salesData = Order::selectRaw('
                COUNT(*) as totalSales,
                SUM(totalAmount) as totalRevenue
            ')
            ->first();

            $totalSales = $salesData->totalSales ?? 0;
            $totalRevenue = $salesData->totalRevenue ?? 0;

            return response()->json([
                'users' => $totalUsers,
                'products' => $totalProducts,
                'totalSales' => $totalSales,
                'totalRevenue' => $totalRevenue,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching analytics data', 'error' => $e->getMessage()], 500);
        }
    }

    public function getDailySalesData(Request $request)
    {
        try {
            $endDate = Carbon::now();
            $startDate = Carbon::now()->subDays(7); // Last 7 days

            $dailySalesData = Order::whereBetween('createdAt', [$startDate, $endDate])
                ->selectRaw('
                    DATE(createdAt) as date,
                    COUNT(*) as sales,
                    SUM(totalAmount) as revenue
                ')
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get();

            // Generate all dates in the range
            $dateArray = $this->getDatesInRange($startDate, $endDate);

            // Map each date to sales and revenue data
            $formattedData = $dateArray->map(function ($date) use ($dailySalesData) {
                $foundData = $dailySalesData->firstWhere('date', $date);

                return [
                    'date' => $date,
                    'sales' => $foundData->sales ?? 0,
                    'revenue' => $foundData->revenue ?? 0,
                ];
            });

            return response()->json([
                'dailySalesData' => $formattedData,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching daily sales data', 'error' => $e->getMessage()], 500);
        }
    }

    private function getDatesInRange($startDate, $endDate)
    {
        $dates = [];
        $currentDate = $startDate->copy();

        while ($currentDate->lte($endDate)) {
            $dates[] = $currentDate->format('Y-m-d');
            $currentDate->addDay();
        }

        return collect($dates); // Return as collection for easy mapping
    }
}
