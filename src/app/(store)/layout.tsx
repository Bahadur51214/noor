import React from "react";
import AnnouncementBar from "@/components/store/layout/announcement-bar";
import { Navbar } from "@/components/store/layout/navbar";
import Footer from "@/components/store/layout/footer";
import { CartDrawer } from "@/components/store/cart/cart-drawer";
import { WhatsAppButton } from "@/components/store/layout/whatsapp-button";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
