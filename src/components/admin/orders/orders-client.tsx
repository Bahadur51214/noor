"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { exportOrdersAction } from "@/actions/export.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

function escapeHtml(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function OrdersClient({ initialOrders, filters }: { initialOrders: any[]; filters: any }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Column preferences
  const [columns, setColumns] = useState({
    orderNumber: true,
    orderDate: true,
    customerName: true,
    phone: true,
    email: true,
    city: true,
    area: true,
    address: true,
    landmark: true,
    productName: true,
    sku: true,
    quantity: true,
    orderTotal: true,
    deliveryCharges: true,
    discount: true,
    paymentMethod: true,
    paymentStatus: true,
    orderStatus: true,
    courier: true,
    trackingNumber: true,
  });

  const toggleAll = () => {
    if (selectedIds.length === initialOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialOrders.map((o) => o.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExport = async (type: "selected" | "filtered") => {
    try {
      setExportLoading(true);
      const data = await exportOrdersAction({
        orderIds: type === "selected" ? selectedIds : undefined,
        filters: type === "filtered" ? filters : undefined,
      });

      if (!data || data.length === 0) {
        toast.error("No orders found to export.");
        return;
      }

      // Build CSV
      const headers = Object.entries(columns)
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => key);

      const rows: string[][] = [];

      data.forEach((order) => {
        // Flat map per item line
        order.orderItems.forEach((item: any) => {
          const row: string[] = [];
          
          if (columns.orderNumber) row.push(order.orderNumber);
          if (columns.orderDate) row.push(format(new Date(order.createdAt), "yyyy-MM-dd HH:mm"));
          if (columns.customerName) row.push(order.customerName || "");
          if (columns.phone) row.push(order.customerPhone || "");
          if (columns.email) row.push(order.customerEmail || "");
          if (columns.city) row.push(order.city || "");
          if (columns.area) row.push(order.area || "");
          if (columns.address) row.push(order.address || "");
          if (columns.landmark) row.push(order.landmark || "");
          if (columns.productName) row.push(item.productName || "");
          if (columns.sku) row.push(item.sku || "");
          if (columns.quantity) row.push(item.quantity?.toString() || "");
          if (columns.orderTotal) row.push(order.total?.toString() || "");
          if (columns.deliveryCharges) row.push(order.deliveryFee?.toString() || "");
          if (columns.discount) row.push(order.discountAmount?.toString() || "");
          if (columns.paymentMethod) row.push(order.paymentMethod || "");
          if (columns.paymentStatus) row.push(order.paymentStatus || "");
          if (columns.orderStatus) row.push(order.status || "");
          if (columns.courier) row.push(order.courier || "");
          if (columns.trackingNumber) row.push(order.trackingNumber || "");

          rows.push(row.map(val => `"${String(val).replace(/"/g, '""')}"`));
        });
      });

      const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `shipping_sheet_${format(new Date(), "yyyyMMdd_HHmm")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Export successful!");
      setExportModalOpen(false);
    } catch (e) {
      toast.error("Export failed.");
    } finally {
      setExportLoading(false);
    }
  };

  const handlePrint = async (type: "selected" | "filtered") => {
    try {
      setExportLoading(true);
      const data = await exportOrdersAction({
        orderIds: type === "selected" ? selectedIds : undefined,
        filters: type === "filtered" ? filters : undefined,
      });

      if (!data || data.length === 0) {
        toast.error("No orders found to print.");
        return;
      }

      // Generate HTML for print
      let printContents = `
        <html>
        <head>
          <title>Shipping Sheet</title>
          <style>
            body { font-family: sans-serif; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
            th { background-color: #f5f5f5; }
            .header { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Shipping Sheet</h2>
            <p>Generated: ${format(new Date(), "yyyy-MM-dd HH:mm")}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Address</th>
                <th>City</th>
                <th>Products</th>
                <th>COD Amount</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
      `;

      data.forEach((order) => {
        const productsStr = order.orderItems
          .map((i: any) => `${i.quantity}x ${escapeHtml(i.productName)}`)
          .join(", ");
        const codAmount = order.paymentMethod === "COD" ? order.total : "PAID";
        printContents += `
          <tr>
            <td>${escapeHtml(order.orderNumber)}</td>
            <td>${escapeHtml(order.customerName)}</td>
            <td>${escapeHtml(order.customerPhone)}</td>
            <td>${escapeHtml(order.address)}, ${escapeHtml(order.area)}</td>
            <td>${escapeHtml(order.city)}</td>
            <td>${productsStr}</td>
            <td>${escapeHtml(codAmount)}</td>
            <td>${escapeHtml(order.paymentStatus)}</td>
          </tr>
        `;
      });

      printContents += `
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
        </html>
      `;

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printContents);
        printWindow.document.close();
      }
    } catch (e) {
      toast.error("Print failed.");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md border border-[#E0DCD5] overflow-hidden">
      <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#E0DCD5]">
        <div className="flex items-center gap-2">
          <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Shipping Sheet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configure Export</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-gray-500 mb-4">Select the columns to include in the CSV export:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {Object.keys(columns).map((col) => (
                    <label key={col} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={columns[col as keyof typeof columns]}
                        onChange={(e) => setColumns({ ...columns, [col]: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      {col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </label>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => handleExport("selected")} disabled={selectedIds.length === 0 || exportLoading}>
                    Export Selected ({selectedIds.length})
                  </Button>
                  <Button variant="outline" onClick={() => handleExport("filtered")} disabled={exportLoading}>
                    Export All Filtered
                  </Button>
                  <Button variant="secondary" onClick={() => handlePrint("filtered")} disabled={exportLoading} className="ml-auto flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Print PDF Sheet
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 bg-gray-50">
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === initialOrders.length && initialOrders.length > 0}
                  onChange={toggleAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="p-3 font-medium">Order #</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Location</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Payment</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {initialOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(order.id)}
                    onChange={() => toggleOne(order.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-3 font-medium">#{order.orderNumber}</td>
                <td className="p-3">
                  {order.customerName} <br />
                  <span className="text-xs text-gray-500">{order.customerPhone}</span>
                </td>
                <td className="p-3 text-xs text-gray-600">
                  {order.city}
                </td>
                <td className="p-3">Rs. {order.total?.toLocaleString()}</td>
                <td className="p-3">
                  <div>{order.paymentMethod}</div>
                  <div className="text-[10px] uppercase text-gray-500">{order.paymentStatus}</div>
                </td>
                <td className="p-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-gray-500">{format(new Date(order.createdAt), "MMM d, yyyy")}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="text-[#C9A96E] hover:underline font-medium">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {initialOrders.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  No orders match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
