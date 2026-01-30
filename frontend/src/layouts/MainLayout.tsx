import { useState, useCallback } from 'react';

import { Outlet } from 'react-router-dom';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

/**
 * Main Layout
 * ===========
 * Layout chính cho toàn bộ ứng dụng với:
 * - Header: Logo, user menu, notifications
 * - Sidebar: Navigation menu (collapsible trên mobile)
 * - Main content area với outlet cho nested routes
 * 
 * Responsive behavior:
 * - Mobile: Sidebar hidden, hamburger menu in header
 * - Tablet+: Sidebar visible, collapsible
 */
export function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev: boolean) => !prev);
  }, []);

  const handleOpenMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed at top */}
      <Header 
        onMenuClick={handleOpenMobileSidebar} 
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <div className="flex">
        {/* Sidebar - Fixed on desktop, drawer on mobile */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onToggleCollapse={handleToggleSidebar}
          onCloseMobile={handleCloseMobileSidebar}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-64">
          {/* Add top padding to account for fixed header */}
          <div className="mt-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
