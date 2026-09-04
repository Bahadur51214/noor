"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createDiscountAction, updateDiscountAction } from "@/actions/discount.actions";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const formSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  amount: z.coerce.number().positive("Amount must be positive"),
  minOrder: z.coerce.number().min(0).default(0),
  maxDiscount: z.coerce.number().min(0).optional().or(z.literal("")),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
  usageLimit: z.coerce.number().min(1).optional().or(z.literal("")),
  active: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

export function DiscountForm({ discount }: { discount?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!discount;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: discount
      ? {
          code: discount.code,
          type: discount.type,
          amount: discount.amount,
          minOrder: discount.minOrder,
          maxDiscount: discount.maxDiscount || "",
          startDate: format(new Date(discount.startDate), "yyyy-MM-dd'T'HH:mm"),
          endDate: format(new Date(discount.endDate), "yyyy-MM-dd'T'HH:mm"),
          usageLimit: discount.usageLimit || "",
          active: discount.active,
        }
      : {
          code: "",
          type: "PERCENTAGE",
          amount: 0,
          minOrder: 0,
          maxDiscount: "",
          startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
          usageLimit: "",
          active: true,
        },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const cleanData = {
        ...data,
        maxDiscount: data.maxDiscount === "" ? null : data.maxDiscount,
        usageLimit: data.usageLimit === "" ? null : data.usageLimit,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      const result = isEditing
        ? await updateDiscountAction(discount.id, cleanData)
        : await createDiscountAction(cleanData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(isEditing ? "Discount updated" : "Discount created");
        router.push("/admin/discounts");
        router.refresh();
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <div className="rounded-lg border border-[#E0DCD5] bg-white p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Discount Code</Label>
            <Input
              {...register("code")}
              placeholder="SUMMER20"
              className="uppercase"
            />
            {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>}
          </div>

          <div>
            <Label>Discount Type</Label>
            <select
              {...register("type")}
              className="w-full rounded-md border border-[#E0DCD5] px-3 py-2 text-sm bg-white focus:border-[#C9A96E] focus:outline-none"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (Rs.)</option>
            </select>
            {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
          </div>

          <div>
            <Label>Amount {watch("type") === "PERCENTAGE" ? "(%)" : "(Rs.)"}</Label>
            <Input type="number" step="0.01" {...register("amount")} />
            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <div>
            <Label>Minimum Order Value (Rs.)</Label>
            <Input type="number" {...register("minOrder")} />
            {errors.minOrder && <p className="mt-1 text-xs text-red-500">{errors.minOrder.message}</p>}
          </div>

          {watch("type") === "PERCENTAGE" && (
            <div>
              <Label>Maximum Discount Amount (Rs.) - Optional</Label>
              <Input type="number" {...register("maxDiscount")} />
              {errors.maxDiscount && <p className="mt-1 text-xs text-red-500">{errors.maxDiscount.message}</p>}
            </div>
          )}

          <div>
            <Label>Usage Limit (Total uses) - Optional</Label>
            <Input type="number" {...register("usageLimit")} />
            {errors.usageLimit && <p className="mt-1 text-xs text-red-500">{errors.usageLimit.message}</p>}
          </div>

          <div>
            <Label>Start Date & Time</Label>
            <Input type="datetime-local" {...register("startDate")} />
            {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
          </div>

          <div>
            <Label>End Date & Time</Label>
            <Input type="datetime-local" {...register("endDate")} />
            {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate.message}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="active"
            {...register("active")}
            className="rounded border-gray-300"
          />
          <Label htmlFor="active" className="cursor-pointer">Active (Enable this discount code)</Label>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <Button type="submit" className="w-full bg-[#0D0D0D] text-white h-12" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? "Update Discount Code" : "Create Discount Code"}
          </Button>
        </div>
      </div>
    </form>
  );
}
