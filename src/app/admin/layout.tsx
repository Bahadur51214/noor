import { AdminLayoutWrapper } from "@/components/admin/layout/admin-layout-wrapper";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
