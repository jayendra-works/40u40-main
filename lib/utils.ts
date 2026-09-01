import { clsx, type ClassValue } from "clsx";

/**
 * Merges class names with Tailwind-friendly conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
