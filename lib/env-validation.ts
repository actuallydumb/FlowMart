// Environment variable validation
const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_PUBLISHABLE_KEY",
  "UPLOADTHING_SECRET",
  "UPLOADTHING_APP_ID",
] as const;

const optionalEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "RESEND_API_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
] as const;

export function validateEnvironment() {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check optional environment variables
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  if (warnings.length > 0) {
    console.warn(
      `Missing optional environment variables (some features may not work): ${warnings.join(", ")}`
    );
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

export function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export function getEnvVarOptional(key: string): string | undefined {
  return process.env[key];
}
