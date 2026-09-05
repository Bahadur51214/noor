import { orderService } from "@/services/order.service";
import { OrdersClient } from "@/components/admin/orders/orders-client";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireAuth();
  const params = await searchParams;

  const filters = {
    status: typeof params.status === "string" ? params.status : undefined,
    paymentStatus: typeof params.paymentStatus === "string" ? params.paymentStatus : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    city: typeof params.city === "string" ? params.city : undefined,
    dateFrom: typeof params.dateFrom === "string" ? params.dateFrom : undefined,
    dateTo: typeof params.dateTo === "string" ? params.dateTo : undefined,
    courier: typeof params.courier === "string" ? params.courier : undefined,
  };

  const { orders, total, pages } = await orderService.getAll({
    page: typeof params.page === "string" ? parseInt(params.page) : 1,
    limit: 20,
    ...filters,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-serif text-black">Orders ({total})</h1>
      </div>

      {/* Filter Form - simple implementation that sets query params */}
      <div className="bg-white p-4 rounded-md border border-[#E0DCD5]">
        <form className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Search Order</label>
            <input
              type="text"
              name="search"
              defaultValue={filters.search}
              placeholder="Search ID, Name..."
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select name="status" defaultValue={filters.status} className="w-full border rounded-md p-2 text-sm bg-white">
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PAYMENT_VERIFICATION">Payment Verification</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="PAYMENT_ISSUE">Payment Issue</option>
              <option value="RETURNED">Returned</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">City</label>
            <input
              type="text"
              name="city"
              defaultValue={filters.city}
              placeholder="e.g. Lahore"
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date From</label>
            <input
              type="date"
              name="dateFrom"
              defaultValue={filters.dateFrom}
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date To</label>
            <input
              type="date"
              name="dateTo"
              defaultValue={filters.dateTo}
              className="w-full border rounded-md p-2 text-sm"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" className="w-full bg-[#0D0D0D] text-white">
              <Search className="w-4 h-4 mr-2" /> Filter
            </Button>
            {(filters.search || filters.status || filters.city || filters.dateFrom || filters.dateTo) && (
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/orders">Clear</Link>
              </Button>
            )}
          </div>
        </form>
      </div>

      <OrdersClient initialOrders={orders} filters={filters} />

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }).map((_, i) => {
            const pageNum = i + 1;
            // Simplified pagination link generation
            const searchParams = new URLSearchParams();
            if (filters.status) searchParams.set("status", filters.status);
            if (filters.search) searchParams.set("search", filters.search);
            if (filters.city) searchParams.set("city", filters.city);
            if (filters.dateFrom) searchParams.set("dateFrom", filters.dateFrom);
            if (filters.dateTo) searchParams.set("dateTo", filters.dateTo);
            searchParams.set("page", pageNum.toString());

            return (
              <Button
                key={pageNum}
                variant={
                  (typeof params.page === "string" ? parseInt(params.page) : 1) === pageNum
                    ? "default"
                    : "outline"
                }
                asChild
              >
                <Link href={`/admin/orders?${searchParams.toString()}`}>{pageNum}</Link>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
