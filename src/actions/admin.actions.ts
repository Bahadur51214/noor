"use server";

import { db } from "@/lib/db";
import {
  verifyPassword,
  createSession,
  destroySession,
  requireAuth,
} from "@/lib/auth";
import { loginSchema } from "@/schemas/auth.schema";
import { redirect } from "next/navigation";
import { auditService } from "@/services/audit.service";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

const LOGIN_RATE_LIMIT = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function loginAdmin(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  const { email, password } = parsed.data;

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  const rate = rateLimit(`login:${ip}:${email}`, LOGIN_RATE_LIMIT, LOGIN_WINDOW_MS);
  if (!rate.success) {
    return { error: "Too many login attempts. Please try again later." };
  }

  const admin = await db.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!admin || !admin.active) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await db.adminUser.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  });

  await createSession(admin.id, admin.role);

  await auditService.log({
    adminId: admin.id,
    action: "ADMIN_LOGIN",
    entityType: "AdminUser",
    entityId: admin.id,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const session = await requireAuth();

  await auditService.log({
    adminId: session.adminId,
    action: "ADMIN_LOGOUT",
    entityType: "AdminUser",
    entityId: session.adminId,
  });

  await destroySession();
  redirect("/admin/login");
}
