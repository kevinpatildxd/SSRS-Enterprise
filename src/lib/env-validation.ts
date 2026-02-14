/**
 * Environment Validation Script
 * 
 * This script validates that all required environment variables are set
 * before the application starts. Run this during build or startup.
 */

const requiredEnvVars = [
  'TURSO_DATABASE_URL',
  'TURSO_AUTH_TOKEN',
  'ADMIN_PASSWORD',
  'BLOB_READ_WRITE_TOKEN',
];

const optionalEnvVars = [
  'NEXT_PUBLIC_APP_NAME',
];

export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  // Check optional variables (warn but don't fail)
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Warning: Optional environment variable not set: ${envVar}`);
    }
  }

  // Additional validations
  if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length < 4) {
    errors.push('ADMIN_PASSWORD must be at least 4 characters long');
  }

  if (process.env.TURSO_DATABASE_URL && !process.env.TURSO_DATABASE_URL.startsWith('libsql://')) {
    errors.push('TURSO_DATABASE_URL must start with libsql://');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Run validation if this file is executed directly
if (require.main === module) {
  const result = validateEnvironment();
  
  if (!result.valid) {
    console.error('Environment validation failed:');
    result.errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  } else {
    console.log('✓ Environment validation passed');
    console.log(`  - ${requiredEnvVars.length} required variables set`);
    console.log(`  - ${optionalEnvVars.length} optional variables checked`);
  }
}
