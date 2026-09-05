import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Order | NOOR",
  description:
    "Track your NOOR order status using your order number and phone number. Stay updated on delivery progress.",
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}