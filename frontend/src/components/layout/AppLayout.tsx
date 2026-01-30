/**
 * App Layout Component
 * =====================
 * Main application layout with responsive sidebar/bottom tab navigation.
 * 
 * Mobile: Bottom tab bar
 * Desktop: Fixed sidebar
 */

import { useState, useCallback, useEffect } from 'react';

import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

import { useIsMobile } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

import { BottomTabBar } from './BottomTabBar';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

// ============================================================================
// LOCAL STORAGE KEY
// ============================================================================

const SIDEBAR_COLLAPSED_KEY = 'sf_sidebar_collapsed';

// ============================================================================
// COMPONENT
// ============================================================================

export function AppLayout() {
  const isMobile = useIsMobile();
  
  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return stored === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Close mobile sidebar on route change or resize to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  // Toggle handlers
  const handleToggleCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleOpenMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-farm-soil-50">
      {/* Sidebar - Desktop only */}
      {!isMobile && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onToggleCollapse={handleToggleCollapse}
          onCloseMobile={handleCloseMobileSidebar}
        />
      )}

      {/* Mobile Sidebar Overlay (for hamburger menu) */}
      {isMobile && (
        <Sidebar
          isCollapsed={false}
          isMobileOpen={isMobileSidebarOpen}
          onToggleCollapse={handleToggleCollapse}
          onCloseMobile={handleCloseMobileSidebar}
        />
      )}

      {/* Main content wrapper */}
      <div
        className={cn(
          'min-h-screen transition-all duration-300 ease-in-out',
          // Desktop: Adjust margin based on sidebar state
          !isMobile && (isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'),
          // Mobile: Add bottom padding for tab bar
          isMobile && 'pb-20'
        )}
      >
        {/* Header */}
        <Header
          onMenuClick={handleOpenMobileSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Bottom Tab Bar - Mobile only */}
      {isMobile && <BottomTabBar />}
    </div>
  );
}

export default AppLayout;
