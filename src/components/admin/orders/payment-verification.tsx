"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyPayment, rejectPayment } from "@/actions/order.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, ShieldAlert, XCircle } from "lucide-react";

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  async function handleVerify() {
    if (loading) return;
    setLoading(true);
    try {
      const result = await verifyPayment(payment.id, orderId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Payment verified — order confirmed");
        router.refresh();
      }
    } catch {
      toast.error("Failed to verify payment");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (loading) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setLoading(true);
    try {
      const result = await rejectPayment(payment.id, orderId, rejectionReason);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Payment rejected");
        router.refresh();
      }
    } catch {
      toast.error("Failed to reject payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50/70 p-4">
      <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-amber-800">
        <ShieldAlert className="h-4 w-4" />
        Payment Verification
        <span className="ml-auto rounded-full bg-amber-200 px-2 py-0.5 text-[11px] font-medium text-amber-800">
          Pending
        </span>
      </h3>
      <p className="mb-3 text-xs text-[#6B655C]">
        Make sure the payment is received (check WhatsApp) before verifying.
      </p>

      {(payment.transactionId || payment.senderName || payment.screenshotUrl) &&
        (
          <div className="mb-4 space-y-2 text-xs">
            {payment.transactionId && (
              <div className="flex justify-between gap-2">
                <span className="text-[#6B655C]">Transaction ID</span>
                <span className="font-mono font-medium">{payment.transactionId}</span>
              </div>
            )}
            {payment.senderName && (
              <div className="flex justify-between gap-2">
                <span className="text-[#6B655C]">Sender Name</span>
                <span className="font-medium">{payment.senderName}</span>
              </div>
            )}
            {payment.screenshotUrl && (
              <img
                src={payment.screenshotUrl}
                alt="Payment screenshot"
                className="max-h-56 rounded-md border"
              />
            )}
          </div>
        )}

      {!showReject ? (
        <div className="flex gap-2">
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
          <div className="flex gap-2">
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