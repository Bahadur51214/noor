"use client";

import { useState } from "react";
import { approveReviewAction, rejectReviewAction } from "@/actions/review.actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { format } from "date-fns";

export function ReviewClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    setLoadingId(id);
    const result = action === "APPROVE" ? await approveReviewAction(id) : await rejectReviewAction(id);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(action === "APPROVE" ? "Review approved" : "Review rejected");
      setReviews(reviews.map((r) => 
        r.id === id ? { ...r, status: action === "APPROVE" ? "APPROVED" : "REJECTED" } : r
      ));
    }
    setLoadingId(null);
  };

  return (
    <div className="bg-white rounded-md border border-[#E0DCD5] overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#E0DCD5] text-gray-500 bg-gray-50">
            <th className="p-4 font-medium">Customer</th>
            <th className="p-4 font-medium w-1/3">Comment</th>
            <th className="p-4 font-medium">Product</th>
            <th className="p-4 font-medium">Rating</th>
            <th className="p-4 font-medium">Date</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r: any) => (
            <tr key={r.id} className="border-b border-[#E0DCD5] hover:bg-gray-50/50">
              <td className="p-4 font-medium text-[#0D0D0D]">{r.customerName}</td>
              <td className="p-4 text-gray-600">
                <p className="line-clamp-2">{r.comment || <span className="italic text-gray-400">No comment</span>}</p>
              </td>
              <td className="p-4 text-gray-700">{r.product?.name || 'Unknown Product'}</td>
              <td className="p-4">
                <div className="flex text-[#C9A96E]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < r.rating ? "opacity-100" : "opacity-30"}>★</span>
                  ))}
                </div>
              </td>
              <td className="p-4 text-gray-500">{format(new Date(r.createdAt), "MMM d, yyyy")}</td>
              <td className="p-4">
                <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] uppercase font-bold ${
                  r.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  r.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {r.status}
                </span>
              </td>
              <td className="p-4 text-right">
                {r.status === 'PENDING' ? (
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-green-200 hover:bg-green-50 hover:text-green-700 text-green-600 h-8 px-2"
                      onClick={() => handleAction(r.id, "APPROVE")}
                      disabled={loadingId === r.id}
                    >
                      {loadingId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 hover:text-red-700 text-red-600 h-8 px-2"
                      onClick={() => handleAction(r.id, "REJECT")}
                      disabled={loadingId === r.id}
                    >
                      {loadingId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Processed</span>
                )}
              </td>
            </tr>
          ))}
          {reviews.length === 0 && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-500">
                No reviews found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
