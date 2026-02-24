/**
 * Utility functions for common type-safe operations
 */

/**
 * Checks if a string is not null, undefined, or empty after trimming
 * @param value - The string value to check
 * @returns true if the string is valid (not null/undefined/empty after trim)
 */
export function isValidString(
  value: string | null | undefined,
): value is string {
  return value !== null && value !== undefined && value.trim() !== ''
}

/**
 * Safely gets a string value or returns a fallback
 * @param value - The string value to check
 * @param fallback - The fallback value to return if invalid
 * @returns The original string if valid, otherwise the fallback
 */
export function getStringOrDefault(
  value: string | null | undefined,
  fallback: string = '',
): string {
  return isValidString(value) ? value : fallback
}

/**
 * Checks if a value is not null or undefined
 * @param value - The value to check
 * @returns true if the value is not null or undefined
 */
export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Checks if a boolean is explicitly true (not just truthy)
 * @param value - The boolean value to check
 * @returns true if the value is explicitly true
 */
export function isExplicitlyTrue(value: boolean | null | undefined): boolean {
  return value === true
}
