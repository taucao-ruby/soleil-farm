/**
 * Sidebar Component
 * ==================
 * Main navigation sidebar with responsive behavior.
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Calendar,
  Sprout,
  ClipboardList,
  Settings,
  HelpCircle,
  ChevronLeft,
  Sun,
  X,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================================================
// NAVIGATION CONFIG
// ============================================================================

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  {
    label: 'Bảng điều khiển',
    path: '/',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: 'Đất canh tác',
    path: '/dat-canh-tac',
    icon: <Map className="h-5 w-5" />,
  },
  {
    label: 'Mùa vụ',
    path: '/mua-vu',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    label: 'Chu kỳ canh tác',
    path: '/chu-ky-canh-tac',
    icon: <Sprout className="h-5 w-5" />,
  },
  {
    label: 'Nhật ký hoạt động',
    path: '/nhat-ky',
    icon: <ClipboardList className="h-5 w-5" />,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: 'Cài đặt',
    path: '/cai-dat',
    icon: <Settings className="h-5 w-5" />,
  },
  {
    label: 'Hỗ trợ',
    path: '/ho-tro',
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

// ============================================================================
// TYPES
// ============================================================================

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Sidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-white border-r border-farm-soil-100 transition-all duration-300 ease-in-out flex flex-col',
          // Desktop
          'lg:relative lg:translate-x-0',
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        )}
        role="navigation"
        aria-label="Menu chính"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-farm-soil-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-farm-leaf-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-farm-leaf-600/25">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <span className="font-bold text-farm-soil-900 whitespace-nowrap">
                    Soleil Farm
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onCloseMobile}
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 transition-transform duration-300',
                isCollapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              item={item}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.path}
              onClick={onCloseMobile}
            />
          ))}
        </nav>

        {/* Secondary Navigation */}
        <div className="border-t border-farm-soil-100 py-4 px-3 space-y-1">
          {secondaryNavItems.map((item) => (
            <SidebarNavItem
              key={item.path}
              item={item}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.path}
              onClick={onCloseMobile}
            />
          ))}
        </div>

        {/* Version Info */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-t border-farm-soil-100">
            <p className="text-xs text-farm-soil-400 text-center">
              Phiên bản 1.0.0
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

// ============================================================================
// NAV ITEM COMPONENT
// ============================================================================

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
  onClick?: () => void;
}

function SidebarNavItem({ item, isCollapsed, isActive, onClick }: SidebarNavItemProps) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
        isActive
          ? 'bg-farm-leaf-50 text-farm-leaf-700 font-medium'
          : 'text-farm-soil-600 hover:bg-farm-soil-50 hover:text-farm-soil-900',
        isCollapsed && 'justify-center px-2'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-farm-leaf-600 rounded-r-full"
        />
      )}

      {/* Icon */}
      <span
        className={cn(
          'flex-shrink-0 transition-colors',
          isActive ? 'text-farm-leaf-600' : 'text-farm-soil-400 group-hover:text-farm-soil-600'
        )}
      >
        {item.icon}
      </span>

      {/* Label */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge */}
      {item.badge && !isCollapsed && (
        <span className="ml-auto bg-farm-leaf-100 text-farm-leaf-700 text-xs font-medium px-2 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-farm-soil-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          {item.label}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-farm-soil-900" />
        </div>
      )}
    </NavLink>
  );
}

export default Sidebar;
