"use client";

import { useState } from "react";
import { updateShippingSettings } from "@/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ShippingSettingsForm({
  settings,
}: {
  settings: Record<string, string | number | boolean | null>;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    codDeliveryFee: String(settings.codDeliveryFee || "250"),
    advanceDeliveryFee: String(settings.advanceDeliveryFee || "0"),
    freeShippingMinOrder: settings.freeShippingMinOrder
      ? String(settings.freeShippingMinOrder)
      : "",
    nationwideDelivery: settings.nationwideDelivery !== false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateShippingSettings(form);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Shipping settings saved");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div className="space-y-4">
        <div>
          <Label>COD Delivery Fee (Rs.)</Label>
          <Input
            type="number"
            value={form.codDeliveryFee}
            onChange={(e) =>
              setForm({ ...form, codDeliveryFee: e.target.value })
            }
          />
          <p className="mt-1 text-xs text-[#6B655C]">
            Standard delivery fee applied to Cash on Delivery orders.
          </p>
        </div>
        <div>
          <Label>Advance Payment Delivery Fee (Rs.)</Label>
          <Input
            type="number"
            value={form.advanceDeliveryFee}
            onChange={(e) =>
              setForm({ ...form, advanceDeliveryFee: e.target.value })
            }
          />
          <p className="mt-1 text-xs text-[#6B655C]">
            Delivery fee for Bank Transfer/Easypaisa/JazzCash. Set to 0 for
            free delivery promotion.
          </p>
        </div>
        <div>
          <Label>Free Shipping Minimum Order (Rs.) - Optional</Label>
          <Input
            type="number"
            value={form.freeShippingMinOrder}
            onChange={(e) =>
              setForm({ ...form, freeShippingMinOrder: e.target.value })
            }
            placeholder="e.g. 5000"
          />
          <p className="mt-1 text-xs text-[#6B655C]">
            Leave empty to disable automatic free shipping by threshold.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="nationwide"
            checked={form.nationwideDelivery}
            onChange={(e) =>
              setForm({ ...form, nationwideDelivery: e.target.checked })
            }
            className="rounded border-[#E0DCD5] text-[#C9A96E] focus:ring-[#C9A96E]"
          />
          <Label htmlFor="nationwide">Offer Nationwide Delivery</Label>
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="bg-[#0D0D0D] text-[#F7F4EF] hover:bg-[#262420]"
      >
        {loading ? "Saving..." : "Save Shipping Settings"}
      </Button>
    </form>
  );
}
