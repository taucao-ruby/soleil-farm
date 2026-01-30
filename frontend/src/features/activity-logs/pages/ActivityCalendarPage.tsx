/**
 * Activity Calendar Page
 * =======================
 * Full-page calendar view for activities
 */

import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, LayoutList, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { ActivityLog } from '../types';
import { CalendarView, QuickLogModal } from '../components';

// ============================================================================
// PAGE COMPONENT
// ============================================================================

/**
 * Activity Calendar Page
 *
 * Features:
 * - Month/Week/Day views
 * - Click to view activity details
 * - Click to add new activity on date
 */
export function ActivityCalendarPage() {
  const navigate = useNavigate();

  // State
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [_selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Handlers
  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleActivityClick = useCallback(
    (activity: ActivityLog) => {
      navigate(`/nhat-ky/${activity.id}`);
    },
    [navigate]
  );

  const handleAddActivity = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsQuickLogOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            {/* Back & Title */}
            <div className="flex items-center gap-4">
              <Link to="/nhat-ky">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Lịch hoạt động
                </h1>
                <p className="text-sm text-gray-500">
                  Xem hoạt động theo ngày, tuần, tháng
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link to="/nhat-ky">
                <Button variant="outline" size="sm">
                  <LayoutList className="w-4 h-4 mr-2" />
                  Danh sách
                </Button>
              </Link>
              <Button
                onClick={() => setIsQuickLogOpen(true)}
                className="bg-farm-green-600 hover:bg-farm-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CalendarView
          onDateClick={handleDateClick}
          onActivityClick={handleActivityClick}
          onAddActivity={handleAddActivity}
        />
      </div>

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => {
          setIsQuickLogOpen(false);
          setSelectedDate(null);
        }}
        onSuccess={() => {
          setIsQuickLogOpen(false);
          setSelectedDate(null);
        }}
      />
    </div>
  );
}

export default ActivityCalendarPage;
