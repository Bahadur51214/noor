import { DiscountForm } from "@/components/admin/discounts/discount-form";
import { discountService } from "@/services/discount.service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";

export default async function EditDiscountPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const resolvedParams = await params;
  const discount = await discountService.getById(resolvedParams.id);

  if (!discount) {
    notFound();
  }

  return (
    <div className="p-6">
      <Link href="/admin/discounts" className="flex items-center text-sm text-gray-500 hover:text-black mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Discounts
      </Link>
      <h1 className="text-2xl font-bold mb-6 font-serif text-[#0D0D0D]">Edit Discount Code</h1>
      <DiscountForm discount={discount} />
    </div>
  );
}
