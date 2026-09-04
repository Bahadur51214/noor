"use client";

import { useState } from "react";
import { updateGeneralSettings as updateStoreSettings } from "@/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { StoreSettings } from "@/types/settings";

export function GeneralSettingsForm({
  settings,
}: {
  settings: Partial<StoreSettings>;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    storeName: settings.storeName || "NOOR",
    email: settings.email || "",
    phone: settings.phone || "",
    whatsapp: settings.whatsapp || "",
    currency: settings.currency || "PKR",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateStoreSettings(form);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("General settings saved");
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
          <Label>Store Name</Label>
          <Input
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
          />
        </div>
        <div>
          <Label>Contact Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="contact@noorwatches.com"
          />
        </div>
        <div>
          <Label>Contact Phone</Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="03XX-XXXXXXX"
          />
        </div>
        <div>
          <Label>WhatsApp Number</Label>
          <Input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="03XX-XXXXXXX"
          />
          <p className="mt-1 text-xs text-[#6B655C]">
            Used for WhatsApp chat widget
          </p>
        </div>
        <div>
          <Label>Currency Code</Label>
          <Input
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            placeholder="PKR"
            disabled
          />
          <p className="mt-1 text-xs text-[#6B655C]">
            Currently locked to PKR
          </p>
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="bg-[#0D0D0D] text-[#F7F4EF] hover:bg-[#262420]"
      >
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
