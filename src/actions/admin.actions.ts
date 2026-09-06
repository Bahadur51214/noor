"use server";

import { db } from "@/lib/db";
import {
  verifyPassword,
  createSession,
  destroySession,
  requireAuth,
  hashPassword,
} from "@/lib/auth";
import { loginSchema, updateAdminCredentialsSchema } from "@/schemas/auth.schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auditService } from "@/services/audit.service";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

const LOGIN_RATE_LIMIT = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const CREDENTIALS_RATE_LIMIT = 5;
const CREDENTIALS_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

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

export async function updateAdminCredentials(data: unknown) {
  const session = await requireAuth();

  const parsed = updateAdminCredentialsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Validation failed", details: parsed.error.flatten() };
  }

  const { email, currentPassword, newPassword } = parsed.data;

  const rate = rateLimit(
    `admin-credentials:${session.adminId}`,
    CREDENTIALS_RATE_LIMIT,
    CREDENTIALS_WINDOW_MS
  );
  if (!rate.success) {
    return { error: "Too many attempts. Please try again later." };
  }

  const admin = await db.adminUser.findUnique({
    where: { id: session.adminId },
  });

  if (!admin || !admin.active) {
    return { error: "Invalid session." };
  }

  const valid = await verifyPassword(currentPassword, admin.passwordHash);
  if (!valid) {
    return { error: "Current password is incorrect." };
  }

  const normalizedEmail = email.toLowerCase();

  if (normalizedEmail !== admin.email) {
    const existing = await db.adminUser.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing && existing.id !== admin.id) {
      return { error: "That email is already in use by another admin." };
    }
  }

  const dataToUpdate: { email: string; passwordHash?: string } = {
    email: normalizedEmail,
  };
  if (newPassword) {
    dataToUpdate.passwordHash = await hashPassword(newPassword);
  }

  try {
    await db.adminUser.update({
      where: { id: admin.id },
      data: dataToUpdate,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update credentials";
    return { error: message };
  }

  await auditService.log({
    adminId: admin.id,
    action: "ADMIN_CREDENTIALS_UPDATED",
    entityType: "AdminUser",
    entityId: admin.id,
    metadata: {
      emailChanged: normalizedEmail !== admin.email,
      passwordChanged: !!newPassword,
    },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
