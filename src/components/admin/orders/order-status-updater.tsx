"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/order.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PAYMENT_VERIFICATION", label: "Payment Verification" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "RETURNED", label: "Returned" },
  { value: "REFUNDED", label: "Refunded" },
];

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    if (status === currentStatus) return;
    setLoading(true);
    try {
      const result = await updateOrderStatus(orderId, status, note);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Order status updated");
        setNote("");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
      <h2 className="mb-4 font-serif text-lg font-semibold">Update Status</h2>
      <div className="space-y-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-md border border-[#E0DCD5] bg-white px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note..."
          className="w-full rounded-md border border-[#E0DCD5] px-3 py-2 text-sm focus:border-[#C9A96E] focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
          rows={2}
        />
        <Button
          onClick={handleUpdate}
          disabled={loading || status === currentStatus}
          className="bg-[#0D0D0D] text-[#F7F4EF] hover:bg-[#262420]"
        >
          {loading ? "Updating..." : "Update Status"}
        </Button>
      </div>
    </div>
  );
}
