const globalForRateLimit = globalThis as unknown as { rateLimitMap: Map<string, { count: number, resetTime: number }> }

if (!globalForRateLimit.rateLimitMap) {
  globalForRateLimit.rateLimitMap = new Map();
}

const rateLimitMap = globalForRateLimit.rateLimitMap;

function cleanup() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(cleanup, 60 * 1000);
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  let record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + windowMs };
  }

  record.count += 1;
  rateLimitMap.set(key, record);

  return {
    success: record.count <= limit,
    remaining: Math.max(0, limit - record.count),
    resetIn: Math.max(0, record.resetTime - now),
  };
}

export function rateLimitByIp(request: Request, limit: number, windowMs: number) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const key = `ip:${ip}`;
  return rateLimit(key, limit, windowMs);
}
