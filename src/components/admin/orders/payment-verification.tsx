"use client";

import { useState } from "react";
import { verifyPayment, rejectPayment } from "@/actions/order.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

interface PaymentData {
  id: string;
  method: string;
  transactionId?: string | null;
  senderName?: string | null;
  screenshotUrl?: string | null;
  status: string;
}

export function PaymentVerification({
  payment,
  orderId,
}: {
  payment: PaymentData;
  orderId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  async function handleVerify() {
    setLoading(true);
    try {
      const result = await verifyPayment(payment.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Payment verified successfully");
      }
    } catch {
      toast.error("Failed to verify payment");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setLoading(true);
    try {
      const result = await rejectPayment(payment.id, rejectionReason);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Payment rejected");
      }
    } catch {
      toast.error("Failed to reject payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-6">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-amber-800">
        ⚡ Payment Verification Required
      </h2>

      <div className="mb-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[#6B655C]">Method</span>
          <span className="font-medium">{payment.method}</span>
        </div>
        {payment.transactionId && (
          <div className="flex justify-between">
            <span className="text-[#6B655C]">Transaction ID</span>
            <span className="font-mono font-medium">
              {payment.transactionId}
            </span>
          </div>
        )}
        {payment.senderName && (
          <div className="flex justify-between">
            <span className="text-[#6B655C]">Sender Name</span>
            <span className="font-medium">{payment.senderName}</span>
          </div>
        )}
        {payment.screenshotUrl && (
          <div className="mt-3">
            <p className="mb-2 text-[#6B655C]">Screenshot:</p>
            <img
              src={payment.screenshotUrl}
              alt="Payment screenshot"
              className="max-h-64 rounded-md border"
            />
          </div>
        )}
      </div>

      {!showReject ? (
        <div className="flex gap-3">
          <Button
            onClick={handleVerify}
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {loading ? "Verifying..." : "Verify Payment"}
          </Button>
          <Button
            onClick={() => setShowReject(true)}
            disabled={loading}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Reason for rejection..."
            className="w-full rounded-md border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
            rows={2}
          />
          <div className="flex gap-3">
            <Button
              onClick={handleReject}
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? "Rejecting..." : "Confirm Rejection"}
            </Button>
            <Button
              onClick={() => setShowReject(false)}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
