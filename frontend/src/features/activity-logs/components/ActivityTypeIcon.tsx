/**
 * Activity Type Icon Component
 * =============================
 * Display icon for activity type with color coding
 */

import {
  Sprout,
  Droplets,
  Leaf,
  Bug,
  Scissors,
  TreeDeciduous,
  Wheat,
  Mountain,
  MoveRight,
  Eye,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { getActivityTypeConfig } from '../types';

// ============================================================================
// ICON MAP
// ============================================================================

const ICON_MAP: Record<string, LucideIcon> = {
  Sprout,
  Droplets,
  Leaf,
  Bug,
  Scissors,
  TreeDeciduous,
  Wheat,
  Mountain,
  MoveRight,
  Eye,
  MoreHorizontal,
};

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface ActivityTypeIconProps {
  /** Activity type code */
  code?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show background */
  showBackground?: boolean;
  /** Show emoji instead of icon */
  useEmoji?: boolean;
  /** Custom class name */
  className?: string;
}

// ============================================================================
// SIZE CONFIG
// ============================================================================

const SIZE_CONFIG = {
  sm: {
    wrapper: 'w-6 h-6',
    icon: 'w-3.5 h-3.5',
    emoji: 'text-sm',
  },
  md: {
    wrapper: 'w-8 h-8',
    icon: 'w-4 h-4',
    emoji: 'text-base',
  },
  lg: {
    wrapper: 'w-10 h-10',
    icon: 'w-5 h-5',
    emoji: 'text-lg',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Activity Type Icon
 *
 * @example
 * <ActivityTypeIcon code="IRRIGATION" size="md" showBackground />
 * <ActivityTypeIcon code="PLANTING" useEmoji />
 */
export function ActivityTypeIcon({
  code,
  size = 'md',
  showBackground = true,
  useEmoji = false,
  className,
}: ActivityTypeIconProps) {
  const config = getActivityTypeConfig(code);
  const sizeConfig = SIZE_CONFIG[size];

  // Emoji variant
  if (useEmoji) {
    return (
      <span
        className={cn(sizeConfig.emoji, className)}
        role="img"
        aria-label={config.label}
      >
        {config.emoji}
      </span>
    );
  }

  // Icon variant
  const IconComponent = ICON_MAP[config.icon] || MoreHorizontal;

  if (!showBackground) {
    return (
      <IconComponent
        className={cn(sizeConfig.icon, config.color, className)}
        aria-label={config.label}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full',
        sizeConfig.wrapper,
        config.bgColor,
        config.borderColor,
        'border',
        className
      )}
    >
      <IconComponent className={cn(sizeConfig.icon, config.color)} />
    </div>
  );
}

// ============================================================================
// ACTIVITY TYPE BADGE
// ============================================================================

interface ActivityTypeBadgeProps {
  code?: string;
  name?: string;
  className?: string;
}

/**
 * Activity Type Badge with label
 *
 * @example
 * <ActivityTypeBadge code="IRRIGATION" name="Tưới nước" />
 */
export function ActivityTypeBadge({
  code,
  name,
  className,
}: ActivityTypeBadgeProps) {
  const config = getActivityTypeConfig(code);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
        config.bgColor,
        config.color,
        config.borderColor,
        'border',
        className
      )}
    >
      <ActivityTypeIcon code={code} size="sm" showBackground={false} />
      <span>{name || config.label}</span>
    </span>
  );
}

export default ActivityTypeIcon;
