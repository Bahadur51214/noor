import { reviewService } from "@/services/review.service";
import { requireAuth } from "@/lib/auth";
import { ReviewClient } from "@/components/admin/reviews/review-client";

export default async function ReviewsPage() {
  await requireAuth();
  
  // Get all reviews (including pending, approved, rejected)
  const reviews = await reviewService.getAll();

  return (
    <div className="p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-2xl font-bold font-serif text-[#0D0D0D]">Product Reviews</h1>
        <p className="text-sm text-gray-500">Manage customer feedback</p>
      </div>

      <ReviewClient initialReviews={reviews} />
    </div>
  );
}
