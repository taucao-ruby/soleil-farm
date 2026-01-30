import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * ===============================================
 * Combines clsx for conditional classes with tailwind-merge
 * to properly handle Tailwind class conflicts.
 * 
 * @example
 * cn('px-2 py-1', condition && 'bg-primary', 'px-4')
 * // Returns: 'py-1 bg-primary px-4' (px-4 wins over px-2)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number as Vietnamese currency (VND)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format date in Vietnamese locale
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Format area in hectares (ha) or square meters (m²)
 */
export function formatArea(
  value: number,
  unit: 'ha' | 'm2' = 'ha'
): string {
  if (unit === 'ha') {
    return `${value.toLocaleString('vi-VN')} ha`;
  }
  return `${value.toLocaleString('vi-VN')} m²`;
}
