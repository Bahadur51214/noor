"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Star, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { submitReviewAction } from "@/actions/store.actions";

type ReviewItem = {
  id: string;
  customerName: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  orderId?: string | null;
};

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= rating ? "fill-[#C9A96E] text-[#C9A96E]" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

function RatingPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
        >
          <Star
            className={
              i <= active ? "fill-[#C9A96E] text-[#C9A96E]" : "fill-gray-200 text-gray-200"
            }
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500">{active || ""}</span>
    </div>
  );
}

export function ProductReviews({
  productId,
  reviews,
  average,
  reviewCount,
}: {
  productId: string;
  reviews: ReviewItem[];
  average: number;
  reviewCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setRating(0);
    setComment("");
    setOrderNumber("");
    setPhone("");
  };

  const handleSubmit = async () => {
    if (name.trim().length < 2) {
      toast.error("Please enter your name (at least 2 characters)");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitReviewAction(
        productId,
        { customerName: name.trim(), rating, comment: comment.trim() || null },
        orderNumber.trim() || phone.trim()
          ? { orderNumber: orderNumber.trim(), phone: phone.trim() }
          : undefined
      );
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        reset();
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 border-t border-gray-100 pt-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-serif text-[#0D0D0D] mb-3">Customer Reviews</h2>
          {reviewCount > 0 ? (
            <div className="flex items-center gap-3">
              <Stars rating={Math.round(average)} size={20} />
              <span className="text-[#C9A96E] font-medium text-lg">{average.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({reviewCount} review{reviewCount === 1 ? "" : "s"})</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Be the first to review this product.</p>
          )}
        </div>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="rounded-none border-[#0D0D0D] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white"
        >
          Write a Review
        </Button>
      </div>

      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-[#F7F4EF]/50 border border-[#C9A96E]/20 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#0D0D0D]">{review.customerName}</span>
                  {review.orderId && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5">
                      <BadgeCheck className="w-3 h-3" />
                      Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {format(new Date(review.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <Stars rating={review.rating} />
              {review.comment && <p className="mt-3 text-sm text-gray-700 leading-relaxed">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your thoughts. Add your order number and phone to mark your review as a verified purchase.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Your Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ayesha Khan"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-sm font-medium block mb-1.5">Rating</Label>
              <RatingPicker value={rating} onChange={setRating} />
            </div>
            <div>
              <Label className="text-sm font-medium">Your Review</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike?"
                rows={4}
                maxLength={500}
                className="mt-1.5"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
            </div>

            <div className="rounded-md bg-[#F7F4EF] p-4 space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Optional — for a Verified Purchase badge
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Order Number</Label>
                  <Input
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. NOOR-123456"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Phone Number</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Used at checkout"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#0D0D0D] text-[#F7F4EF] hover:bg-[#262420]"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}