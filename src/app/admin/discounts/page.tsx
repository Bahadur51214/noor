import { discountService } from "@/services/discount.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { requireAuth } from "@/lib/auth";

export default async function DiscountsPage() {
  await requireAuth();
  const discounts = await discountService.getAll();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-serif text-[#0D0D0D]">Discounts</h1>
        <Button asChild className="bg-[#0D0D0D] text-white">
          <Link href="/admin/discounts/new">
            <Plus className="w-4 h-4 mr-2" /> Add Discount
          </Link>
        </Button>
      </div>
      
      <div className="bg-white rounded-md border border-[#E0DCD5] overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#E0DCD5] text-gray-500 bg-gray-50">
              <th className="p-4 font-medium">Code</th>
              <th className="p-4 font-medium">Value</th>
              <th className="p-4 font-medium">Usage</th>
              <th className="p-4 font-medium">Validity</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d: any) => {
              const isActive = d.active && new Date(d.endDate) > new Date();
              
              return (
                <tr key={d.id} className="border-b border-[#E0DCD5] hover:bg-gray-50/50">
                  <td className="p-4 font-bold text-[#0D0D0D]">{d.code}</td>
                  <td className="p-4 text-gray-700">
                    {d.type === 'PERCENTAGE' ? `${d.amount}%` : `Rs. ${d.amount}`}
                    {d.minOrder > 0 && <span className="block text-xs text-gray-400">Min Rs. {d.minOrder}</span>}
                  </td>
                  <td className="p-4 text-gray-700">
                    {d.usedCount} / {d.usageLimit || '∞'}
                  </td>
                  <td className="p-4 text-gray-700">
                    <div className="text-xs">{format(new Date(d.startDate), "MMM d, yyyy")} -</div>
                    <div className="text-xs">{format(new Date(d.endDate), "MMM d, yyyy")}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      isActive ? "text-green-700 bg-green-50 border-green-200" : "text-gray-500 bg-gray-100 border-gray-200"
                    }`}>
                      {isActive ? "Active" : "Inactive/Expired"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/discounts/${d.id}`} className="text-[#C9A96E] hover:underline font-medium">
                      Edit
                    </Link>
                  </td>
                </tr>
              )
            })}
            {discounts.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No discount codes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
