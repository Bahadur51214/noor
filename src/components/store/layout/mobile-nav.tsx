"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="/shop" className="text-lg font-medium hover:text-[#C9A96E] transition-colors">
            Shop
          </Link>
          <Link href="/about" className="text-lg font-medium hover:text-[#C9A96E] transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-lg font-medium hover:text-[#C9A96E] transition-colors">
            Contact
          </Link>
          <Link href="/track-order" className="text-lg font-medium hover:text-[#C9A96E] transition-colors">
            Track Order
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
