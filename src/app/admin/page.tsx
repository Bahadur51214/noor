import { requireAuth } from "@/lib/auth";
import { analyticsService } from "@/services/analytics.service";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Truck,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  await requireAuth();

  const stats = await analyticsService.getDashboardStats();

  const recentOrders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      total: true,
      status: true,
      createdAt: true,
    },
  });

  const lowStockProducts = await db.product.findMany({
    where: { stock: { lte: 5 }, status: { not: "ARCHIVED" } },
    take: 5,
    orderBy: { stock: "asc" },
    select: { id: true, name: true, sku: true, stock: true },
  });

  return (
    <div className="p-6 max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#0D0D0D]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back to NOOR Admin</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#E0DCD5] shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 mb-1">
            <DollarSign className="w-4 h-4 text-[#C9A96E]" />
            <span className="text-xs font-medium uppercase tracking-wider">Revenue</span>
          </div>
          <p className="text-2xl font-serif text-[#0D0D0D]">Rs. {stats.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E0DCD5] shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 mb-1">
            <ShoppingBag className="w-4 h-4 text-[#C9A96E]" />
            <span className="text-xs font-medium uppercase tracking-wider">Orders Today</span>
          </div>
          <p className="text-2xl font-serif text-[#0D0D0D]">{stats.todayOrders}</p>
          <p className="text-xs text-gray-400 mt-1">{stats.totalOrders} total</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E0DCD5] shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 mb-1">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-medium uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-2xl font-serif text-[#0D0D0D]">{stats.pendingOrders}</p>
          <p className="text-xs text-gray-400 mt-1">{stats.pendingVerification} awaiting payment</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E0DCD5] shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 mb-1">
            <Truck className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium uppercase tracking-wider">Delivered</span>
          </div>
          <p className="text-2xl font-serif text-[#0D0D0D]">{stats.deliveredOrders}</p>
        </div>
      </div>

      {/* Two columns: Recent Orders + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-[#E0DCD5] shadow-sm">
          <div className="p-5 border-b border-[#E0DCD5] flex justify-between items-center">
            <h2 className="font-medium text-[#0D0D0D]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-[#C9A96E] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order: any) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm text-[#0D0D0D]">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Rs. {Number(order.total).toLocaleString()}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                    order.status === "PENDING" ? "bg-orange-100 text-orange-700" :
                    order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
            {recentOrders.length === 0 && (
              <p className="p-6 text-center text-gray-400 text-sm">No orders yet</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg border border-[#E0DCD5] shadow-sm">
          <div className="p-5 border-b border-[#E0DCD5] flex justify-between items-center">
            <h2 className="font-medium text-[#0D0D0D] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400" /> Low Stock Alerts
            </h2>
            <Link href="/admin/inventory" className="text-xs text-[#C9A96E] hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStockProducts.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-sm text-[#0D0D0D]">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.sku}</p>
                </div>
                <span className={`text-sm font-bold ${p.stock <= 0 ? "text-red-600" : "text-orange-600"}`}>
                  {p.stock} left
                </span>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="p-6 text-center text-green-600 text-sm">All products are well-stocked ✓</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
