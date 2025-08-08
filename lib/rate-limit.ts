import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { prisma } from "@/lib/db";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create rate limiters
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 m"), // 5 requests per 5 minutes
  analytics: true,
});

export const uploadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 uploads per hour
  analytics: true,
});

export const checkoutRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 h"), // 20 checkouts per hour
  analytics: true,
});

export const executionRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"), // 100 executions per hour
  analytics: true,
});

export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, "1 h"), // 1000 API calls per hour
  analytics: true,
});

export async function checkRateLimit(
  identifier: string,
  rateLimiter: Ratelimit
) {
  const { success, limit, reset, remaining } =
    await rateLimiter.limit(identifier);

  return {
    success,
    limit,
    reset,
    remaining,
  };
}

export async function checkOrganizationRateLimit(
  organizationId: string,
  endpoint: string
) {
  // Get organization-specific rate limits from database
  const rateLimit = await prisma.rateLimit.findFirst({
    where: {
      organizationId,
      endpoint,
    },
  });

  if (!rateLimit) {
    // Use default rate limit
    return checkRateLimit(`org:${organizationId}:${endpoint}`, apiRateLimit);
  }

  const customRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(rateLimit.limit, `${rateLimit.window} s`),
    analytics: true,
  });

  return checkRateLimit(`org:${organizationId}:${endpoint}`, customRateLimit);
}
