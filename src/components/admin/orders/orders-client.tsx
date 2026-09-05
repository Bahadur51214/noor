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

const COLUMN_LABELS: Record<string, string> = {
  orderNumber: "Order Number",
  orderDate: "Order Date",
  customerName: "Customer Name",
  phone: "Phone",
  email: "Email",
  city: "City",
  area: "Area",
  address: "Address",
  landmark: "Landmark",
  productName: "Product Name",
  sku: "SKU",
  quantity: "Quantity",
  orderTotal: "Order Total",
  deliveryCharges: "Delivery Charges",
  discount: "Discount",
  paymentMethod: "Payment Method",
  paymentStatus: "Payment Status",
  orderStatus: "Order Status",
  courier: "Courier",
  trackingNumber: "Tracking Number",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  JAZZCASH: "JazzCash",
  EASIPAISA: "EasyPaisa",
  BANK_TRANSFER: "Bank Transfer",
  COD: "Cash on Delivery",
};

function escapeHtml(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildSheetHtml(order: any): string {
  const itemsHtml = order.orderItems
    .map((item: any) => {
      return `<tr>
        <td>${escapeHtml(item.productName || "")}</td>
        <td>${escapeHtml(item.sku || "")}</td>
        <td class="num">${escapeHtml(item.quantity)}</td>
        <td class="num">${escapeHtml((item.price ?? "").toLocaleString())}</td>
        <td class="num">${escapeHtml((item.total ?? "").toLocaleString())}</td>
      </tr>`;
    })
    .join("");

  const address = [order.address, order.area, order.city, order.landmark]
    .filter(Boolean)
    .join(", ");

  const courier = order.courier || "";
  const tracking = order.trackingNumber || "";
  const paymentMethod =
    PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod || "";

  return `
    <div class="sheet-header">
      <div>
        <h1>NOOR Watches</h1>
        <p>Shipping Sheet</p>
      </div>
      <div class="meta">
        <p><strong>Order:</strong> ${escapeHtml(order.orderNumber)}</p>
        <p><strong>Date:</strong> ${format(new Date(order.createdAt), "MMMM d, yyyy")}</p>
      </div>
    </div>

    <h3>Deliver To</h3>
    <table class="plain">
      <tr>
        <td class="lbl">Customer</td>
        <td>${escapeHtml(order.customerName || "")}</td>
      </tr>
      <tr>
        <td class="lbl">Phone</td>
        <td>${escapeHtml(order.customerPhone || "")}</td>
      </tr>
      <tr>
        <td class="lbl">Email</td>
        <td>${escapeHtml(order.customerEmail || "")}</td>
      </tr>
      <tr>
        <td class="lbl">Address</td>
        <td>${escapeHtml(address)}</td>
      </tr>
    </table>

    <h3>Items</h3>
    <table class="items">
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th class="num">Qty</th>
          <th class="num">Price</th>
          <th class="num">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="totals">
      <p>Subtotal: Rs. ${Number(order.subtotal).toLocaleString()}</p>
      <p>Delivery Charges: Rs. ${Number(order.deliveryFee).toLocaleString()}</p>
      ${
        Number(order.discountAmount) > 0
          ? `<p>Discount: - Rs. ${Number(order.discountAmount).toLocaleString()}</p>`
          : ""
      }
      <p class="grand">Order Total: Rs. ${Number(order.total).toLocaleString()}</p>
    </div>

    <div class="footer">
      <span>Payment: ${escapeHtml(paymentMethod)}</span>
      ${
        order.paymentMethod === "COD"
          ? `<span class="collect">Collect Amount: Rs. ${Number(order.total).toLocaleString()}</span>`
          : `<span>Prepaid (Advance)</span>`
      }
      ${
        courier
          ? `<span>Courier: ${escapeHtml(courier)}${
              tracking ? ` · ${escapeHtml(tracking)}` : ""
            }</span>`
          : ""
      }
    </div>`;
}

function buildShippingSheetHtml(orders: any[]): string {
  const pages: string[] = [];
  for (let i = 0; i < orders.length; i += 2) {
    const pair = orders.slice(i, i + 2);
    const sheets = pair.map((order) => {
      return `<div class="sheet">${buildSheetHtml(order)}</div>`;
    }).join("");
    pages.push(`<div class="page">${sheets}</div>`);
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Shipping Sheet</title>
  <style>
    @page { margin: 8mm; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #222; margin: 0; }
    .page { page-break-after: always; margin-bottom: 20px; }
    .page:last-child { page-break-after: auto; }
    .sheet { width: 100%; box-sizing: border-box; border: 1px solid #bbb; border-radius: 6px; padding: 12px; margin-bottom: 12px; page-break-inside: avoid; }
    .sheet:last-child { margin-bottom: 0; }
    .sheet-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0D0D0D; padding-bottom: 8px; margin-bottom: 10px; }
    .sheet-header h1 { margin: 0; font-size: 18px; letter-spacing: 1px; }
    .sheet-header p { margin: 0; color: #555; }
    .meta { text-align: right; }
    .meta p { margin: 2px 0; font-size: 11px; }
    h3 { margin: 12px 0 6px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #0D0D0D; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #bbb; padding: 5px; text-align: left; font-size: 11px; }
    th { background: #f0f0f0; }
    td.num, th.num { text-align: right; }
    table.plain td { border: none; padding: 3px 4px; }
    table.plain td.lbl { width: 90px; color: #555; }
    .totals { text-align: right; margin: 8px 0; }
    .totals p { margin: 2px 0; font-size: 11px; }
    .totals .grand { font-weight: bold; font-size: 13px; border-top: 1px solid #999; padding-top: 4px; }
    .footer { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; border-top: 1px solid #ccc; padding-top: 8px; font-size: 11px; color: #444; }
    .footer .collect { font-weight: bold; color: #0D0D0D; border: 1px solid #0D0D0D; padding: 3px 8px; border-radius: 4px; }
  </style>
</head>
<body>
  ${pages.join("")}
</body>
</html>`;
}

export function OrdersClient({
  initialOrders,
  filters,
}: {
  initialOrders: any[];
  filters: any;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

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

  const selectAllColumns = (value: boolean) => {
    const next: Record<string, boolean> = {};
    Object.keys(columns).forEach((key) => {
      next[key] = value;
    });
    setColumns(next as typeof columns);
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

      const headers = Object.entries(columns)
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => COLUMN_LABELS[key]);

      const rows: string[][] = [];

      data.forEach((order) => {
        order.orderItems.forEach((item: any) => {
          const row: string[] = [];

          if (columns.orderNumber) row.push(order.orderNumber);
          if (columns.orderDate)
            row.push(format(new Date(order.createdAt), "yyyy-MM-dd HH:mm"));
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

          rows.push(row.map((val) => `"${String(val).replace(/"/g, '""')}"`));
        });
      });

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
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

  const handleDownload = async (type: "selected" | "filtered") => {
    await downloadShipment({
      orderIds: type === "selected" ? selectedIds : undefined,
      filters: type === "filtered" ? filters : undefined,
    });
  };

  const handleDownloadOne = async (orderId: string) => {
    await downloadShipment({ orderIds: [orderId] });
  };

  const downloadShipment = async ({
    orderIds,
    filters,
  }: {
    orderIds?: string[];
    filters?: any;
  }) => {
    try {
      setExportLoading(true);
      const data = await exportOrdersAction({ orderIds, filters });

      if (!data || data.length === 0) {
        toast.error("No orders found to download.");
        return;
      }

      const html2pdf = (await import("html2pdf.js")).default;

      const container = document.createElement("div");
      container.innerHTML = buildShippingSheetHtml(data);
      container.style.position = "absolute";
      container.style.left = "-10000px";
      container.style.top = "0";
      container.style.width = "200mm";
      document.body.appendChild(container);

      await html2pdf()
        .set({
          margin: [5, 5, 5, 5],
          filename: `shipping_sheet_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#FFFFFF",
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(container)
        .save();

      document.body.removeChild(container);
      toast.success(
        data.length > 1
          ? `${data.length} shipping sheets downloaded as PDF`
          : "Shipping sheet downloaded as PDF"
      );
    } catch (e) {
      toast.error("Failed to generate PDF.");
      document.querySelector("div[style*='-10000px']")?.remove();
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md border border-[#E0DCD5] overflow-hidden">
      <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#E0DCD5]">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleDownload("filtered")}
            disabled={exportLoading}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {exportLoading ? "Preparing..." : "Download Shipping Sheet"}
          </Button>
          <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configure Export</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-gray-500 mb-2">
                  Select the columns to include in the CSV export:
                </p>
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <button
                    type="button"
                    onClick={() => selectAllColumns(true)}
                    className="text-[#C9A96E] hover:underline"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => selectAllColumns(false)}
                    className="text-gray-500 hover:underline"
                  >
                    None
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {Object.keys(columns).map((col) => (
                    <label key={col} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={columns[col as keyof typeof columns]}
                        onChange={(e) =>
                          setColumns({ ...columns, [col]: e.target.checked })
                        }
                        className="rounded border-gray-300"
                      />
                      {COLUMN_LABELS[col]}
                    </label>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleExport("selected")}
                    disabled={selectedIds.length === 0 || exportLoading}
                  >
                    Export Selected ({selectedIds.length})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport("filtered")}
                    disabled={exportLoading}
                  >
                    Export All Filtered
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDownload("selected")}
                    disabled={selectedIds.length === 0 || exportLoading}
                    className="ml-auto flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Selected ({selectedIds.length})
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
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleDownloadOne(order.id)}
                      disabled={exportLoading}
                      title="Download shipping sheet"
                      className="text-gray-400 hover:text-[#C9A96E] disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <Link href={`/admin/orders/${order.id}`} className="text-[#C9A96E] hover:underline font-medium">
                      View
                    </Link>
                  </div>
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