/**
 * Soleil Farm Design System - Animation Tokens
 * ============================================
 * Các preset animation cho Framer Motion và CSS
 * Thiết kế để tạo trải nghiệm mượt mà, chuyên nghiệp
 */

import type { Transition, Variants } from 'framer-motion';

// ===== DURATION =====
export const duration = {
  instant: 0,
  faster: 0.1,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  slower: 0.4,
  slowest: 0.5,
} as const;

// ===== EASING CURVES =====
export const easing = {
  // Standard easing
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],

  // Custom easing
  spring: [0.43, 0.13, 0.23, 0.96],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.4, 0, 0.2, 1],
  snappy: [0.2, 0, 0, 1],
} as const;

// ===== TRANSITION PRESETS =====
export const transitions: Record<string, Transition> = {
  default: {
    duration: duration.normal,
    ease: easing.smooth,
  },
  fast: {
    duration: duration.fast,
    ease: easing.smooth,
  },
  slow: {
    duration: duration.slow,
    ease: easing.smooth,
  },
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
  springBouncy: {
    type: 'spring',
    stiffness: 500,
    damping: 25,
  },
  springGentle: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  },
} as const;

// ===== FRAMER MOTION VARIANTS =====

/**
 * Fade animations
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: transitions.default,
};

/**
 * Slide animations
 */
export const slideUpVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

export const slideDownVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
};

export const slideLeftVariants: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
};

export const slideRightVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
};

/**
 * Scale animations
 */
export const scaleVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

export const scaleInAnimation = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: transitions.spring,
};

/**
 * Container/Stagger animations
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.spring,
  },
};

/**
 * Modal/Dialog animations
 */
export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalContentVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0, y: 10 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 10,
    transition: { duration: duration.fast },
  },
};

/**
 * Dropdown/Menu animations
 */
export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.fast,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -5,
    transition: { duration: duration.fast },
  },
};

/**
 * Toast/Notification animations
 */
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: duration.fast },
  },
};

/**
 * Sidebar/Drawer animations
 */
export const sidebarVariants: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
  exit: {
    x: '-100%',
    transition: { duration: duration.normal },
  },
};

/**
 * Card hover animations
 */
export const cardHoverVariants: Variants = {
  rest: { scale: 1, boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.1)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 24px -8px rgba(0, 0, 0, 0.2)',
    transition: transitions.fast,
  },
  tap: { scale: 0.98 },
};

/**
 * Button tap animation
 */
export const buttonTapVariants: Variants = {
  rest: { scale: 1 },
  tap: { scale: 0.97 },
};

/**
 * List item animations
 */
export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      ...transitions.spring,
    },
  }),
  exit: { opacity: 0, x: 20 },
};

/**
 * Page transition animations
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easing.smooth,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: duration.normal },
  },
};

/**
 * Skeleton loading animation
 */
export const skeletonVariants: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1,
    },
  },
};

/**
 * Pulse animation (for notifications, badges)
 */
export const pulseVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
    },
  },
};

// ===== ANIMATION PRESETS (Ready to use) =====
export const animations = {
  fadeIn: fadeInAnimation,
  scaleIn: scaleInAnimation,

  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: transitions.default,
  },

  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
    transition: transitions.default,
  },

  slideLeft: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
    transition: transitions.default,
  },

  slideRight: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
    transition: transitions.default,
  },
} as const;

// ===== CSS KEYFRAMES (For non-JS animations) =====
export const cssKeyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeOut: `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  slideDown: `
    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `,
} as const;

export default {
  duration,
  easing,
  transitions,
  animations,
  variants: {
    fade: fadeVariants,
    slideUp: slideUpVariants,
    slideDown: slideDownVariants,
    slideLeft: slideLeftVariants,
    slideRight: slideRightVariants,
    scale: scaleVariants,
    staggerContainer: staggerContainerVariants,
    staggerItem: staggerItemVariants,
    modal: modalContentVariants,
    modalOverlay: modalOverlayVariants,
    dropdown: dropdownVariants,
    toast: toastVariants,
    sidebar: sidebarVariants,
    cardHover: cardHoverVariants,
    buttonTap: buttonTapVariants,
    listItem: listItemVariants,
    page: pageVariants,
    skeleton: skeletonVariants,
    pulse: pulseVariants,
  },
  cssKeyframes,
};
