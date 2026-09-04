import { analyticsService } from "@/services/analytics.service";
import { requireAuth } from "@/lib/auth";
import { DollarSign, Package, ShoppingBag, Truck, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default async function AnalyticsPage() {
  await requireAuth();
  
  const stats = await analyticsService.getDashboardStats();
  const salesData = await analyticsService.getSalesOverTime(30);

  return (
    <div className="p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-2xl font-bold font-serif text-[#0D0D0D]">Analytics Dashboard</h1>
        <p className="text-sm text-gray-500">Live data overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-[#E0DCD5] shadow-sm flex flex-col">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <DollarSign className="w-5 h-5 text-[#C9A96E]" />
            <h2 className="text-sm font-medium">Total Confirmed Revenue</h2>
          </div>
          <p className="text-3xl font-serif text-[#0D0D0D]">Rs. {stats.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#E0DCD5] shadow-sm flex flex-col">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <ShoppingBag className="w-5 h-5 text-[#C9A96E]" />
            <h2 className="text-sm font-medium">Total Orders</h2>
          </div>
          <p className="text-3xl font-serif text-[#0D0D0D]">{stats.totalOrders}</p>
          <p className="text-xs text-gray-400 mt-2">({stats.todayOrders} today)</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#E0DCD5] shadow-sm flex flex-col">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Package className="w-5 h-5 text-orange-400" />
            <h2 className="text-sm font-medium">Pending Processing</h2>
          </div>
          <p className="text-3xl font-serif text-[#0D0D0D]">{stats.pendingOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#E0DCD5] shadow-sm flex flex-col">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Truck className="w-5 h-5 text-green-500" />
            <h2 className="text-sm font-medium">Successfully Shipped</h2>
          </div>
          <p className="text-3xl font-serif text-[#0D0D0D]">{stats.shippedOrders + stats.deliveredOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-[#E0DCD5] shadow-sm">
            <h3 className="font-medium text-[#0D0D0D] mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#C9A96E]" /> Payment Methods Breakdown
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Advance Payment</span>
                  <span className="font-medium">Rs. {stats.advanceRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#C9A96E] h-2 rounded-full" style={{ width: `${stats.totalRevenue > 0 ? (stats.advanceRevenue / stats.totalRevenue) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Cash on Delivery (COD)</span>
                  <span className="font-medium">Rs. {stats.codRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#0D0D0D] h-2 rounded-full" style={{ width: `${stats.totalRevenue > 0 ? (stats.codRevenue / stats.totalRevenue) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-red-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800">Cancelled Orders</h3>
              <p className="text-2xl font-serif text-red-600 mt-1">{stats.cancelledOrders}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-200" />
          </div>

          <div className="bg-white p-6 rounded-lg border border-orange-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-orange-800">Low Stock Products</h3>
              <p className="text-2xl font-serif text-orange-600 mt-1">{stats.lowStockCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-[#E0DCD5] shadow-sm">
          <h3 className="font-medium text-[#0D0D0D] mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C9A96E]" /> 30-Day Sales History
          </h3>
          {salesData.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
              {salesData.reverse().map((data: any) => (
                <div key={data.date} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="font-medium text-sm text-[#0D0D0D]">
                      {format(new Date(data.date), "MMM d, yyyy")}
                    </div>
                    <div className="text-xs text-gray-500">{data.orders} orders</div>
                  </div>
                  <div className="font-medium text-[#0D0D0D]">
                    Rs. {data.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              No sales data available for the last 30 days.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
