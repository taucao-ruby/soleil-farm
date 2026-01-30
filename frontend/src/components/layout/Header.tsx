/**
 * Header Component
 * =================
 * Application header with user info, notifications, and logout.
 */

import { useState, useCallback } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useLogout } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

// ============================================================================
// BREADCRUMB CONFIG
// ============================================================================

const breadcrumbLabels: Record<string, string> = {
  '': 'Bảng điều khiển',
  'dat-canh-tac': 'Đất canh tác',
  'mua-vu': 'Mùa vụ',
  'chu-ky-canh-tac': 'Chu kỳ canh tác',
  'nhat-ky': 'Nhật ký hoạt động',
  'cai-dat': 'Cài đặt',
  'ho-tro': 'Hỗ trợ',
  'tao-moi': 'Tạo mới',
  'chinh-sua': 'Chỉnh sửa',
};

// ============================================================================
// TYPES
// ============================================================================

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarCollapsed?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Generate breadcrumb items from path
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  // Get user initials
  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-farm-soil-100',
        'transition-all duration-300'
      )}
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden sm:block">
            <ol className="flex items-center gap-1">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-farm-soil-300" />
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-sm font-medium text-farm-soil-900">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.path}
                      className="text-sm text-farm-soil-500 hover:text-farm-leaf-600 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="h-9 w-60"
                  autoFocus
                  onBlur={() => { setIsSearchOpen(false); }}
                />
              </motion.div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { setIsSearchOpen(true); }}
                aria-label="Tìm kiếm"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </AnimatePresence>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Thông báo"
              >
                <Bell className="h-5 w-5" />
                {/* Notification badge */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="py-4 text-center text-sm text-farm-soil-500">
                Không có thông báo mới
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 gap-2 pl-2 pr-3"
                aria-label="Menu người dùng"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={user?.avatar_url ?? undefined}
                    alt={user?.name || 'User'}
                  />
                  <AvatarFallback className="bg-farm-leaf-100 text-farm-leaf-700 text-xs font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm font-medium text-farm-soil-700">
                  {user?.name || 'Người dùng'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-farm-soil-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/tai-khoan" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Tài khoản
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/cai-dat" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/ho-tro" className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Hỗ trợ
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

interface BreadcrumbItem {
  label: string;
  path: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', path: '/' },
  ];

  let currentPath = '';

  for (const segment of segments) {
    currentPath += `/${segment}`;

    // Skip numeric segments (IDs)
    if (/^\d+$/.test(segment)) {
      continue;
    }

    const label = breadcrumbLabels[segment] || segment;
    breadcrumbs.push({ label, path: currentPath });
  }

  return breadcrumbs;
}

export default Header;
