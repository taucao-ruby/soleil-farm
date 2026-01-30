/**
 * Bottom Tab Bar Component
 * =========================
 * Mobile navigation bar with 5 main tabs
 * Appears only on mobile devices (< 768px)
 */

import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Sprout,
  ClipboardList,
  User,
  Plus,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

// ============================================================================
// TAB CONFIG
// ============================================================================

interface TabItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPaths?: string[]; // Additional paths that should highlight this tab
}

const tabs: TabItem[] = [
  {
    label: 'Trang chủ',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Đất',
    path: '/dat-canh-tac',
    icon: Map,
    matchPaths: ['/dat-canh-tac'],
  },
  {
    label: 'Chu kỳ',
    path: '/chu-ky-canh-tac',
    icon: Sprout,
    matchPaths: ['/chu-ky-canh-tac'],
  },
  {
    label: 'Nhật ký',
    path: '/nhat-ky',
    icon: ClipboardList,
    matchPaths: ['/nhat-ky'],
  },
  {
    label: 'Tôi',
    path: '/tai-khoan',
    icon: User,
    matchPaths: ['/tai-khoan', '/cai-dat'],
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

interface BottomTabBarProps {
  onAddClick?: () => void;
  className?: string;
}

export function BottomTabBar({ onAddClick: _onAddClick, className }: BottomTabBarProps) {
  const location = useLocation();

  // Check if current path matches tab
  const isTabActive = (tab: TabItem) => {
    if (location.pathname === tab.path) return true;
    if (tab.matchPaths?.some((p) => location.pathname.startsWith(p))) return true;
    return false;
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white border-t border-gray-200',
        'pb-safe', // Safe area for iPhone notch
        'md:hidden', // Hide on tablet and up
        className
      )}
      role="navigation"
      aria-label="Menu điều hướng"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab);
          const Icon = tab.icon;

          // Center FAB button (optional - between tab 2 and 3)
          // Uncomment if you want a center action button
          // if (index === 2) {
          //   return (
          //     <React.Fragment key="fab">
          //       <CenterFAB onClick={onAddClick} />
          //       <TabButton tab={tab} isActive={isActive} Icon={Icon} />
          //     </React.Fragment>
          //   );
          // }

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={cn(
                'flex flex-col items-center justify-center',
                'min-w-[64px] min-h-[48px] px-3 py-1',
                'rounded-lg transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-farm-green-500',
                isActive
                  ? 'text-farm-green-600'
                  : 'text-gray-500 active:text-gray-700'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-6 h-6 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-farm-green-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] mt-1 font-medium',
                  isActive ? 'text-farm-green-600' : 'text-gray-500'
                )}
              >
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

// ============================================================================
// CENTER FAB (Optional - exported for future use)
// ============================================================================

interface CenterFABProps {
  onClick?: () => void;
}

export function CenterFAB({ onClick }: CenterFABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center',
        'w-14 h-14 -mt-6 rounded-full',
        'bg-farm-green-600 text-white shadow-lg',
        'active:bg-farm-green-700 active:scale-95',
        'transition-all duration-150',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-farm-green-200'
      )}
      aria-label="Thêm mới"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}

export default BottomTabBar;
