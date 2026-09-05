import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | NOOR",
  description:
    "Complete your purchase at NOOR. Pay by cash on delivery, Easypaisa, JazzCash, or bank transfer.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}