/**
 * Activity Log List Page
 * =======================
 * Main page for viewing activity logs with infinite scroll and filters
 * Optimized for mobile with pull-to-refresh and responsive layout
 */

import { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  LayoutList,
  BarChart3,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MobileHeader, PullToRefreshIndicator } from '@/components/ui/responsive';
import { usePullToRefresh } from '@/hooks/useTouchInteractions';
import { useIsMobile } from '@/hooks/useMediaQuery';
import type { ActivityLog, ActivityLogFilters, ExportFormat } from '../types';
import {
  useGroupedActivities,
  useActivityLogsPolling,
  useActivityAnalytics,
  useKeyboardShortcuts,
} from '../hooks';
import {
  ActivityFilters,
  TimelineView,
  ActivityAnalytics,
  QuickLogFAB,
  QuickLogModal,
} from '../components';

// ============================================================================
// PAGE COMPONENT
// ============================================================================

/**
 * Activity Log List Page
 *
 * Features:
 * - Infinite scroll timeline
 * - Real-time polling updates
 * - Advanced filtering
 * - Analytics dashboard
 * - Quick log entry
 * - Keyboard shortcuts
 * - Pull-to-refresh on mobile
 * - Responsive mobile-first design
 */
export function ActivityLogListPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // State
  const [filters, setFilters] = useState<ActivityLogFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'timeline' | 'analytics'>('timeline');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(!isMobile);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const {
    groups,
    totalCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGroupedActivities({
    ...filters,
    search: searchQuery || undefined,
  });

  const { analytics, isLoading: isAnalyticsLoading } = useActivityAnalytics(filters);

  // Enable real-time polling
  useActivityLogsPolling(true, 30000);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewActivity: () => setIsQuickLogOpen(true),
    onSearch: () => searchInputRef.current?.focus(),
    onEscape: () => setIsQuickLogOpen(false),
  });

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleExport = useCallback((format: ExportFormat) => {
    // TODO: Implement export functionality
    console.log('Exporting as:', format);
  }, []);

  const handleActivityClick = useCallback(
    (activity: ActivityLog) => {
      navigate(`/nhat-ky/${activity.id}`);
    },
    [navigate]
  );

  const handleActivityEdit = useCallback(
    (activity: ActivityLog) => {
      navigate(`/nhat-ky/${activity.id}/chinh-sua`);
    },
    [navigate]
  );

  const handleActivityDelete = useCallback((activity: ActivityLog) => {
    // TODO: Implement delete with confirmation
    console.log('Delete activity:', activity.id);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Pull-to-refresh for mobile
  const pullToRefresh = usePullToRefresh({
    onRefresh: async () => {
      await refetch();
    },
  });

  // Mobile layout
  if (isMobile) {
    return (
      <div
        className="min-h-screen bg-gray-50"
        {...pullToRefresh.handlers}
      >
        {/* Pull to refresh indicator */}
        <PullToRefreshIndicator
          pullDistance={pullToRefresh.pullDistance}
          isRefreshing={pullToRefresh.isRefreshing}
        />

        {/* Mobile Header */}
        <MobileHeader
          title="Nhật ký hoạt động"
          subtitle={totalCount > 0 ? `${totalCount} hoạt động` : undefined}
          actions={
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'text-farm-green-600' : ''}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
              <Link to="/nhat-ky/lich">
                <Button variant="ghost" size="icon">
                  <Calendar className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          }
        />

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="px-4 py-3 bg-white border-b">
            <ActivityFilters
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={handleSearch}
              searchQuery={searchQuery}
              onExport={handleExport}
              compact
            />
          </div>
        )}

        {/* Mobile Tabs */}
        <div className="bg-white border-b">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'timeline' | 'analytics')}
          >
            <TabsList className="w-full grid grid-cols-2 h-12 rounded-none bg-transparent border-0">
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-farm-green-600 rounded-none"
              >
                <LayoutList className="w-4 h-4 mr-2" />
                Dòng thời gian
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-farm-green-600 rounded-none"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Thống kê
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="pb-safe">
          {activeTab === 'timeline' ? (
            <TimelineView
              groups={groups}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage ?? false}
              fetchNextPage={fetchNextPage}
              onActivityClick={handleActivityClick}
              onActivityEdit={handleActivityEdit}
              onActivityDelete={handleActivityDelete}
              onRefresh={handleRefresh}
            />
          ) : (
            <div className="p-4">
              <ActivityAnalytics
                analytics={analytics}
                isLoading={isAnalyticsLoading}
              />
            </div>
          )}
        </div>

        {/* FAB for quick log */}
        <QuickLogFAB onSuccess={handleRefresh} />

        {/* Quick Log Modal */}
        <QuickLogModal
          isOpen={isQuickLogOpen}
          onClose={() => setIsQuickLogOpen(false)}
          onSuccess={() => {
            setIsQuickLogOpen(false);
            handleRefresh();
          }}
        />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            {/* Title Row */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Nhật ký hoạt động
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {totalCount > 0
                    ? `${totalCount} hoạt động được ghi nhận`
                    : 'Theo dõi các hoạt động canh tác'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="hidden sm:flex"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Làm mới
                </Button>

                <Link to="/nhat-ky/lich">
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Xem lịch</span>
                  </Button>
                </Link>

                <Button
                  onClick={() => setIsQuickLogOpen(true)}
                  className="bg-farm-green-600 hover:bg-farm-green-700"
                >
                  + Ghi nhận
                </Button>
              </div>
            </div>

            {/* Filters */}
            <ActivityFilters
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={handleSearch}
              searchQuery={searchQuery}
              onExport={handleExport}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'timeline' | 'analytics')}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="timeline" className="gap-2">
              <LayoutList className="w-4 h-4" />
              Dòng thời gian
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Thống kê
            </TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="mt-0">
            <TimelineView
              groups={groups}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage ?? false}
              fetchNextPage={fetchNextPage}
              onActivityClick={handleActivityClick}
              onActivityEdit={handleActivityEdit}
              onActivityDelete={handleActivityDelete}
              onRefresh={handleRefresh}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-0">
            <ActivityAnalytics
              analytics={analytics}
              isLoading={isAnalyticsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <QuickLogFAB onSuccess={handleRefresh} />

      {/* Quick Log Modal (keyboard shortcut) */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        onSuccess={() => {
          setIsQuickLogOpen(false);
          handleRefresh();
        }}
      />

      {/* Keyboard Shortcut Hints */}
      <div className="fixed bottom-6 left-6 hidden lg:block">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border shadow-sm px-3 py-2 text-xs text-gray-500">
          <p>
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">N</kbd>{' '}
            Thêm mới
          </p>
          <p className="mt-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">/</kbd>{' '}
            Tìm kiếm
          </p>
        </div>
      </div>
    </div>
  );
}

export default ActivityLogListPage;
