"use client";

import { useState } from "react";
import { updateCourier } from "@/actions/order.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Truck } from "lucide-react";

export function CourierUpdater({
  orderId,
  courier,
  trackingNumber,
  trackingUrl,
}: {
  orderId: string;
  courier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
}) {
  const [form, setForm] = useState({
    courier: courier || "",
    trackingNumber: trackingNumber || "",
    trackingUrl: trackingUrl || "",
  });
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    if (!form.courier.trim() || !form.trackingNumber.trim()) {
      toast.error("Courier name and tracking number are required");
      return;
    }
    setLoading(true);
    try {
      const result = await updateCourier(
        orderId,
        form.courier,
        form.trackingNumber,
        form.trackingUrl || undefined
      );
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Courier info updated");
      }
    } catch {
      toast.error("Failed to update courier info");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-[#E0DCD5] bg-white p-6">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold">
        <Truck className="h-5 w-5 text-[#C9A96E]" />
        Courier Information
      </h2>
      <div className="space-y-3">
        <div>
          <Label className="text-sm text-[#6B655C]">Courier Name</Label>
          <Input
            value={form.courier}
            onChange={(e) => setForm({ ...form, courier: e.target.value })}
            placeholder="e.g., TCS, Leopards, DHL"
          />
        </div>
        <div>
          <Label className="text-sm text-[#6B655C]">Tracking Number</Label>
          <Input
            value={form.trackingNumber}
            onChange={(e) =>
              setForm({ ...form, trackingNumber: e.target.value })
            }
            placeholder="Tracking number"
          />
        </div>
        <div>
          <Label className="text-sm text-[#6B655C]">
            Tracking URL (optional)
          </Label>
          <Input
            value={form.trackingUrl}
            onChange={(e) => setForm({ ...form, trackingUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <Button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-[#0D0D0D] text-[#F7F4EF] hover:bg-[#262420]"
        >
          {loading ? "Updating..." : "Save Courier Info"}
        </Button>
      </div>
    </div>
  );
}
