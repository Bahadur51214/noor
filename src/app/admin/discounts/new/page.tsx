import { DiscountForm } from "@/components/admin/discounts/discount-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";

export default async function NewDiscountPage() {
  await requireAuth();

  return (
    <div className="p-6">
      <Link href="/admin/discounts" className="flex items-center text-sm text-gray-500 hover:text-black mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Discounts
      </Link>
      <h1 className="text-2xl font-bold mb-6 font-serif text-[#0D0D0D]">Create Discount Code</h1>
      <DiscountForm />
    </div>
  );
}
