/**
 * Basic input sanitization utilities
 */

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .slice(0, 254); // RFC 5321 limit
}

export function sanitizeName(name: string): string {
  return sanitizeInput(name)
    .replace(/[^a-zA-Z0-9\s\-_.]/g, '') // Allow only alphanumeric, spaces, and basic punctuation
    .slice(0, 100);
}
