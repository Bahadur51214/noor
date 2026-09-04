"use client";

import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { items, openCart } = useCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 md:hidden">
          <MobileNav />
        </div>
        
        {/* Logo */}
        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
          <Link href="/" className="font-serif text-2xl tracking-widest font-bold">
            NOOR
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 mx-6">
          <Link href="/" className="text-sm font-medium hover:text-[#C9A96E] transition-colors">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium hover:text-[#C9A96E] transition-colors">
            Shop
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-[#C9A96E] transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-[#C9A96E] transition-colors">
            Contact
          </Link>
          <Link href="/track-order" className="text-sm font-medium hover:text-[#C9A96E] transition-colors">
            Track Order
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none justify-end">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={openCart} className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-[18px] min-w-[18px] px-1 rounded-full bg-[#C9A96E] text-[11px] leading-none font-bold text-white flex items-center justify-center select-none">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
