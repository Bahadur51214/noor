import { getSession } from "@/lib/auth";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  // Session is handled by Layout wrapper now for client components
  // Or we just don't display the role strictly here if it complicates it.
  // Wait, getSession is async and this is a client component potentially?
  // No, AdminHeader doesn't have "use client" but if it's imported in AdminLayoutWrapper (client), it becomes client.
  // Let me just make this a generic component or accept session prop.
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E0DCD5] bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-sm font-medium text-[#6B655C] hidden sm:block">Admin Panel</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-md p-2 text-[#6B655C] transition-colors hover:bg-[#F0EDE8]">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D0D0D] text-xs font-medium text-[#F7F4EF]">
            A
          </div>
          <span className="text-sm font-medium text-[#3D3A35] hidden sm:inline-block">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
