import { AdminLayoutWrapper } from "@/components/admin/layout/admin-layout-wrapper";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
