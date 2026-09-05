import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart | NOOR",
  description:
    "Review the items in your shopping cart at NOOR. Luxury women's watches with fast delivery and cash on delivery across Pakistan.",
  robots: { index: false, follow: false },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}