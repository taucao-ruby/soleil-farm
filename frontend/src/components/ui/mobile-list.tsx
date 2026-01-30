/**
 * Mobile-Optimized List Components
 * ==================================
 * Virtual scrolling, infinite scroll, and optimized list rendering
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { usePullToRefresh, haptic } from '@/hooks/useTouchInteractions';
import { PullToRefreshIndicator } from '@/components/ui/responsive';
import { Loader2, ChevronRight, AlertCircle } from 'lucide-react';

// ============================================================================
// MOBILE LIST
// ============================================================================

interface MobileListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  onRefresh?: () => Promise<void>;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  isRefreshing?: boolean;
  emptyState?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  separators?: boolean;
  className?: string;
}

/**
 * MobileList Component
 * =====================
 * Optimized list with pull-to-refresh and infinite scroll
 */
export function MobileList<T>({
  items,
  renderItem,
  keyExtractor,
  onRefresh,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  isRefreshing = false,
  emptyState,
  header,
  footer,
  separators = true,
  className,
}: MobileListProps<T>) {
  const isMobile = useIsMobile();
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // Pull to refresh
  const pullToRefresh = usePullToRefresh({
    onRefresh: onRefresh || (async () => {}),
  });

  // Infinite scroll with IntersectionObserver
  React.useEffect(() => {
    if (!loadMoreRef.current || !onLoadMore || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading]);

  const showPullToRefresh = isMobile && onRefresh;

  return (
    <div
      className={cn('flex flex-col', className)}
      {...(showPullToRefresh ? pullToRefresh.handlers : {})}
    >
      {/* Pull to refresh indicator */}
      {showPullToRefresh && (
        <PullToRefreshIndicator
          pullDistance={pullToRefresh.pullDistance}
          isRefreshing={pullToRefresh.isRefreshing || isRefreshing}
        />
      )}

      {/* Header */}
      {header}

      {/* List content */}
      {items.length === 0 && !isLoading ? (
        <div className="flex-1 flex items-center justify-center p-8">
          {emptyState || (
            <div className="text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Không có dữ liệu</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={keyExtractor(item, index)}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
                className={cn(separators && index > 0 && 'border-t border-border')}
              >
                {renderItem(item, index)}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="h-1" />

          {/* Loading indicator */}
          {isLoading && hasMore && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* End of list */}
          {!hasMore && items.length > 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">
              Đã hiển thị tất cả
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {footer}
    </div>
  );
}

// ============================================================================
// MOBILE LIST ITEM
// ============================================================================

interface MobileListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  chevron?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
}

/**
 * MobileListItem Component
 * =========================
 * Standard list item with consistent styling
 */
export function MobileListItem({
  title,
  subtitle,
  description,
  leading,
  trailing,
  chevron = false,
  onClick,
  disabled = false,
  destructive = false,
  className,
}: MobileListItemProps) {
  const isMobile = useIsMobile();

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onClick={() => {
        if (onClick && !disabled) {
          haptic('light');
          onClick();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onClick && !disabled) {
          onClick();
        }
      }}
      className={cn(
        'flex items-center gap-3',
        isMobile ? 'px-4 py-3' : 'px-4 py-2.5',
        onClick && !disabled && 'cursor-pointer hover:bg-muted active:bg-muted/80',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Leading */}
      {leading && <div className="shrink-0">{leading}</div>}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            'font-medium truncate',
            isMobile ? 'text-base' : 'text-sm',
            destructive && 'text-destructive'
          )}
        >
          {title}
        </div>
        {subtitle && (
          <div className="text-sm text-muted-foreground truncate">{subtitle}</div>
        )}
        {description && (
          <div className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-2">
            {description}
          </div>
        )}
      </div>

      {/* Trailing */}
      {trailing && <div className="shrink-0">{trailing}</div>}

      {/* Chevron */}
      {chevron && onClick && (
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
      )}
    </div>
  );
}

// ============================================================================
// SECTION LIST
// ============================================================================

interface Section<T> {
  title: string;
  data: T[];
}

interface SectionListProps<T> {
  sections: Section<T>[];
  renderItem: (item: T, index: number, section: Section<T>) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  renderSectionHeader?: (section: Section<T>, index: number) => React.ReactNode;
  stickySectionHeaders?: boolean;
  className?: string;
}

/**
 * SectionList Component
 * ======================
 * Grouped list with section headers (like iOS grouped list)
 */
export function SectionList<T>({
  sections,
  renderItem,
  keyExtractor,
  renderSectionHeader,
  stickySectionHeaders = false,
  className,
}: SectionListProps<T>) {
  return (
    <div className={cn('flex flex-col', className)}>
      {sections.map((section, sectionIndex) => (
        <div key={section.title} className="mb-4">
          {/* Section header */}
          {renderSectionHeader ? (
            <div className={cn(stickySectionHeaders && 'sticky top-0 z-10')}>
              {renderSectionHeader(section, sectionIndex)}
            </div>
          ) : (
            <div
              className={cn(
                'px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide',
                'bg-muted/50',
                stickySectionHeaders && 'sticky top-0 z-10'
              )}
            >
              {section.title}
            </div>
          )}

          {/* Section items */}
          <div className="bg-background border-y border-border divide-y divide-border">
            {section.data.map((item, itemIndex) => (
              <div key={keyExtractor(item, itemIndex)}>
                {renderItem(item, itemIndex, section)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// SEARCH LIST
// ============================================================================

interface SearchListProps<T> {
  items: T[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  searchFilter: (item: T, search: string) => boolean;
  placeholder?: string;
  isLoading?: boolean;
  emptySearchState?: React.ReactNode;
  className?: string;
}

/**
 * SearchList Component
 * =====================
 * List with integrated search input
 */
export function SearchList<T>({
  items,
  searchValue,
  onSearchChange,
  renderItem,
  keyExtractor,
  searchFilter,
  placeholder = 'Tìm kiếm...',
  isLoading = false,
  emptySearchState,
  className,
}: SearchListProps<T>) {
  const filteredItems = React.useMemo(
    () =>
      searchValue.trim()
        ? items.filter((item) => searchFilter(item, searchValue))
        : items,
    [items, searchValue, searchFilter]
  );

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Search input */}
      <div className="sticky top-0 z-20 bg-background p-4 border-b">
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg text-base',
            'bg-muted border-0 outline-none',
            'placeholder:text-muted-foreground',
            'focus:ring-2 focus:ring-primary/20'
          )}
        />
      </div>

      {/* Results */}
      <MobileList
        items={filteredItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        isLoading={isLoading}
        emptyState={
          searchValue.trim()
            ? emptySearchState || (
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Không tìm thấy kết quả cho "{searchValue}"
                  </p>
                </div>
              )
            : undefined
        }
      />
    </div>
  );
}

// ============================================================================
// SKELETON LIST
// ============================================================================

interface SkeletonListProps {
  count?: number;
  itemHeight?: number;
  className?: string;
}

/**
 * SkeletonList Component
 * =======================
 * Loading placeholder for lists
 */
export function SkeletonList({ count = 5, itemHeight = 72, className }: SkeletonListProps) {
  return (
    <div className={cn('flex flex-col divide-y divide-border', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 px-4 animate-pulse"
          style={{ height: itemHeight }}
        >
          <div className="w-10 h-10 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// VIRTUALIZED LIST (for very long lists)
// ============================================================================

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  overscan?: number;
  className?: string;
}

/**
 * VirtualizedList Component
 * ==========================
 * Virtual scrolling for performance with large lists
 */
export function VirtualizedList<T>({
  items,
  itemHeight,
  renderItem,
  keyExtractor,
  overscan = 5,
  className,
}: VirtualizedListProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      setContainerHeight(entries[0].contentRect.height);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn('overflow-auto', className)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, i) => {
          const index = startIndex + i;
          const style: React.CSSProperties = {
            position: 'absolute',
            top: index * itemHeight,
            left: 0,
            right: 0,
            height: itemHeight,
          };
          return (
            <div key={keyExtractor(item, index)} style={style}>
              {renderItem(item, index, style)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MobileList;
