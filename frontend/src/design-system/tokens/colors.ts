/**
 * Soleil Farm Design System - Color Tokens
 * =========================================
 * Bảng màu được thiết kế theo concept:
 * - Primary (Green): Sức sống, mùa màng, nông nghiệp bền vững
 * - Earth (Amber/Brown): Đất đai, mùa gặt, ánh nắng mặt trời
 * - Water (Blue): Nguồn nước, tưới tiêu
 * - Status colors: Trạng thái hệ thống
 */

// ===== PRIMARY COLORS (Farm Green) =====
export const primary = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#10b981', // Main brand color - Emerald
  600: '#059669',
  700: '#047857',
  800: '#065f46',
  900: '#064e3b',
  950: '#022c22',
} as const;

// ===== SECONDARY COLORS (Earth Tones) =====
export const earth = {
  50: '#fef3c7',
  100: '#fde68a',
  200: '#fcd34d',
  300: '#fbbf24',
  400: '#f59e0b',
  500: '#d97706', // Amber
  600: '#b45309',
  700: '#92400e',
  800: '#78350f',
  900: '#451a03',
} as const;

// ===== SOIL COLORS (Brown) =====
export const soil = {
  50: '#fdf8f6',
  100: '#f2e8e5',
  200: '#eaddd7',
  300: '#d4a574',
  400: '#c08552',
  500: '#a0522d', // Sienna
  600: '#8b4513',
  700: '#704214',
  800: '#654321',
  900: '#3d2914',
} as const;

// ===== WATER COLORS (Blue) =====
export const water = {
  50: '#e0f2fe',
  100: '#bae6fd',
  200: '#7dd3fc',
  300: '#38bdf8',
  400: '#0ea5e9',
  500: '#0284c7', // Sky
  600: '#0369a1',
  700: '#075985',
  800: '#0c4a6e',
  900: '#082f49',
} as const;

// ===== SUN COLORS (Yellow/Gold) =====
export const sun = {
  50: '#fefce8',
  100: '#fef9c3',
  200: '#fef08a',
  300: '#fde047',
  400: '#facc15',
  500: '#eab308', // Yellow
  600: '#ca8a04',
  700: '#a16207',
  800: '#854d0e',
  900: '#713f12',
} as const;

// ===== NEUTRAL COLORS (Slate) =====
export const neutral = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
} as const;

// ===== STATUS COLORS =====
export const status = {
  // Land Parcel Status
  available: '#10b981',    // Green - Sẵn sàng canh tác
  in_use: '#3b82f6',       // Blue - Đang sử dụng
  resting: '#f59e0b',      // Yellow - Đang nghỉ
  maintenance: '#ef4444',  // Red - Đang bảo trì

  // Crop Cycle Status
  planned: '#6366f1',      // Indigo - Đã lên kế hoạch
  active: '#10b981',       // Green - Đang hoạt động
  harvested: '#22c55e',    // Emerald - Đã thu hoạch
  completed: '#64748b',    // Gray - Hoàn thành
  failed: '#ef4444',       // Red - Thất bại
  cancelled: '#9ca3af',    // Gray - Đã hủy

  // Activity Status
  pending: '#f59e0b',      // Yellow - Chờ xử lý
  in_progress: '#3b82f6',  // Blue - Đang thực hiện
  done: '#10b981',         // Green - Hoàn thành
  skipped: '#9ca3af',      // Gray - Bỏ qua
} as const;

// ===== SEMANTIC COLORS =====
export const semantic = {
  success: {
    light: '#d1fae5',
    DEFAULT: '#10b981',
    dark: '#065f46',
    foreground: '#ffffff',
  },
  warning: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#92400e',
    foreground: '#ffffff',
  },
  error: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#991b1b',
    foreground: '#ffffff',
  },
  info: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#1e40af',
    foreground: '#ffffff',
  },
} as const;

// ===== CHART COLORS =====
export const chart = {
  // Sequential - For continuous data
  green: ['#d1fae5', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857'],
  blue: ['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
  amber: ['#fef3c7', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309'],

  // Categorical - For distinct categories
  categorical: [
    '#10b981', // Green
    '#3b82f6', // Blue
    '#f59e0b', // Amber
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#14b8a6', // Teal
  ],
} as const;

// ===== COLOR UTILITIES =====

/**
 * Get status color by status key
 */
export function getStatusColor(statusKey: keyof typeof status): string {
  return status[statusKey];
}

/**
 * Get status color with opacity
 */
export function getStatusColorWithOpacity(
  statusKey: keyof typeof status,
  opacity: number = 0.1
): string {
  const color = status[statusKey];
  // Convert hex to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// ===== EXPORT ALL COLORS =====
export const colors = {
  primary,
  earth,
  soil,
  water,
  sun,
  neutral,
  status,
  semantic,
  chart,
} as const;

export default colors;
