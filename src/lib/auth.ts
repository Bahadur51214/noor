import bcryptjs from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHmac, timingSafeEqual } from 'crypto';

const SESSION_COOKIE_NAME = 'noor-admin-session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET environment variable is required in production');
    }
    // Dev fallback — warns in dev, never used in production
    console.warn('WARNING: AUTH_SECRET not set. Using insecure dev secret. Set AUTH_SECRET in production.');
    return 'dev-only-insecure-secret-change-me';
  }
  return secret;
}

const AUTH_SECRET = getAuthSecret();

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

function sign(payload: string): string {
  return createHmac('sha256', AUTH_SECRET).update(payload).digest('base64');
}

export async function createSession(adminId: string, role: string): Promise<void> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payloadData = { adminId, role, expiresAt };
  const payloadBase64 = Buffer.from(JSON.stringify(payloadData)).toString('base64');
  const signature = sign(payloadBase64);
  const token = `${payloadBase64}.${signature}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function getSession(): Promise<{
  adminId: string;
  role: string;
  expiresAt: number;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const [payloadBase64, signature] = token.split('.');
  if (!payloadBase64 || !signature) return null;

  const expectedSignature = sign(payloadBase64);

  try {
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}

export async function requireSuperAdmin() {
  const session = await requireAuth();
  if (session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized: Super Admin access required');
  }
  return session;
}
