"use client";

import { useState } from "react";
import { updateAdminCredentials } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AccountSettingsForm({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await updateAdminCredentials({
        email: form.email.trim(),
        currentPassword: form.currentPassword,
        newPassword: form.newPassword.trim() || undefined,
        confirmPassword: form.confirmPassword,
      });
      if (result && "error" in result) {
        toast.error(String(result.error));
      } else {
        toast.success("Account credentials updated");
        setForm({
          ...form,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch {
      toast.error("Failed to update credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-[#0D0D0D]">Admin Account</h3>
        <p className="text-sm text-gray-500 mt-1">
          Update the email and password used to sign in to the admin dashboard.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="account-email">Login Email</Label>
          <Input
            id="account-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="current-password">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            className="mt-1"
            autoComplete="current-password"
          />
          <p className="mt-1 text-xs text-[#6B655C]">
            Required to confirm changes.
          </p>
        </div>
        <div>
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="mt-1"
            placeholder="Leave blank to keep current password"
            autoComplete="new-password"
          />
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="mt-1"
            autoComplete="new-password"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-[#0D0D0D] text-white hover:bg-[#262420]"
      >
        {loading ? "Saving..." : "Update Credentials"}
      </Button>
    </form>
  );
}