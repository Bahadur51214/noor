"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl tracking-[0.3em] text-[#F7F4EF]">
            NOOR
          </h1>
          <p className="mt-2 text-sm tracking-wider text-[#C9A96E]">
            ADMIN PORTAL
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-lg border border-[#262420] bg-[#1A1917] p-8">
          <h2 className="mb-6 text-center font-serif text-xl text-[#F7F4EF]">
            Sign In
          </h2>

          {state?.error && (
            <div className="mb-4 rounded-md border border-red-800 bg-red-950/50 p-3 text-center text-sm text-red-400">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#C4BFB5]">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B655C]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@noorwatches.com"
                  required
                  className="border-[#3D3A35] bg-[#262420] pl-10 text-[#F7F4EF] placeholder:text-[#6B655C] focus:border-[#C9A96E] focus:ring-[#C9A96E]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#C4BFB5]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B655C]" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="border-[#3D3A35] bg-[#262420] pl-10 text-[#F7F4EF] placeholder:text-[#6B655C] focus:border-[#C9A96E] focus:ring-[#C9A96E]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#C9A96E] text-[#0D0D0D] hover:bg-[#D4BA8A] disabled:opacity-50"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#6B655C]">
          Protected area. Authorized access only.
        </p>
      </div>
    </div>
  );
}
