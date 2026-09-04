"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePaymentSettings } from "@/actions/settings.actions";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  bankDetails: z.string().min(1, "Bank details required"),
  easypaisa: z.string().min(1, "Easypaisa required"),
  jazzcash: z.string().min(1, "JazzCash required"),
});

export function PaymentSettingsForm({ initialData }: { initialData: any }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      bankDetails: "",
      easypaisa: "",
      jazzcash: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updatePaymentSettings(values);
      toast.success("Payment settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="bankDetails" render={({ field }) => (
          <FormItem><FormLabel>Bank Transfer Details</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="easypaisa" render={({ field }) => (
          <FormItem><FormLabel>Easypaisa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="jazzcash" render={({ field }) => (
          <FormItem><FormLabel>JazzCash</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
