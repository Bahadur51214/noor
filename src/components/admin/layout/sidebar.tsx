"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  Warehouse,
  Users,
  Percent,
  Star,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutAdmin } from "@/actions/admin.actions";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Discounts", href: "/admin/discounts", icon: Percent },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ 
  isOpen = false, 
  setIsOpen 
}: { 
  isOpen?: boolean; 
  setIsOpen?: (val: boolean) => void 
}) {
  const pathname = usePathname();

  return (
    <aside className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#0D0D0D] text-[#F7F4EF] transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-[#262420]">
        <Link href="/admin">
          <h1 className="font-serif text-xl tracking-[0.3em] text-[#F7F4EF]">
            NOOR
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen?.(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-l-2 border-[#C9A96E] bg-[#C9A96E]/10 text-[#C9A96E]"
                      : "text-[#C4BFB5] hover:bg-[#C9A96E]/5 hover:text-[#F7F4EF]"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-[#262420] p-4">
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#9E978C] transition-colors hover:bg-red-950/30 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
