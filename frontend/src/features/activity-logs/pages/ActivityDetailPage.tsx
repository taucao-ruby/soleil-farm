/**
 * Activity Detail Page
 * =====================
 * View and manage a single activity log entry
 */

import { useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  User,
  MapPin,
  FileText,
  MessageSquare,
  MoreHorizontal,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useDisclosure } from '@/hooks';

import { useActivityLog, useDeleteActivityLog, useActivityLogs } from '@/hooks/api/use-activity-logs';
import { ActivityTypeIcon, ActivityTypeBadge, ActivityLogItemCompact } from '../components';
import { formatActivityDate, formatTimeAgo } from '../utils';

// ============================================================================
// PAGE COMPONENT
// ============================================================================

/**
 * Activity Detail Page
 *
 * Features:
 * - Full activity information display
 * - Edit/Delete actions with confirmation
 * - Related activities from same crop cycle
 * - Audit trail (created/updated timestamps)
 */
export function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activityId = parseInt(id || '0', 10);

  // Delete confirmation dialog
  const deleteDialog = useDisclosure();

  // Queries
  const { data: activity, isLoading, error } = useActivityLog(activityId);

  // Related activities (same crop cycle)
  const { data: relatedData } = useActivityLogs(
    activity
      ? { crop_cycle_id: activity.crop_cycle_id, per_page: 5 }
      : undefined,
    { enabled: !!activity }
  );
  const relatedActivities = relatedData?.data.filter((a) => a.id !== activityId) || [];

  // Delete mutation
  const deleteMutation = useDeleteActivityLog();

  // Handlers
  const handleEdit = useCallback(() => {
    navigate(`/nhat-ky/${activityId}/chinh-sua`);
  }, [navigate, activityId]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync(activityId);
      toast.success('Đã xóa hoạt động');
      navigate('/nhat-ky');
    } catch (error) {
      toast.error('Không thể xóa hoạt động');
    }
  }, [deleteMutation, activityId, navigate]);

  const handleRelatedClick = useCallback(
    (relatedActivity: { id: number }) => {
      navigate(`/nhat-ky/${relatedActivity.id}`);
    },
    [navigate]
  );

  // Loading state
  if (isLoading) {
    return <ActivityDetailSkeleton />;
  }

  // Error state
  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Không tìm thấy hoạt động
          </h1>
          <p className="text-gray-500 mt-2">
            Hoạt động này không tồn tại hoặc đã bị xóa
          </p>
          <Link to="/nhat-ky">
            <Button className="mt-4">Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  const activityType = activity.activity_type;
  const cropCycle = activity.crop_cycle;
  const user = activity.user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            {/* Back & Title */}
            <div className="flex items-center gap-4">
              <Link to="/nhat-ky">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <ActivityTypeIcon
                  code={activityType?.code}
                  size="lg"
                  showBackground
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {activityType?.name || 'Chi tiết hoạt động'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {formatTimeAgo(activity.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={deleteDialog.onOpen}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Chi tiết hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Activity Type */}
                <div className="flex items-start gap-3">
                  <div className="w-24 text-sm text-gray-500">Loại</div>
                  <ActivityTypeBadge
                    code={activityType?.code}
                    name={activityType?.name}
                  />
                </div>

                {/* Date */}
                <div className="flex items-start gap-3">
                  <div className="w-24 text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Ngày
                  </div>
                  <div className="text-sm text-gray-900">
                    {formatActivityDate(activity.activity_date)}
                  </div>
                </div>

                {/* Description */}
                {activity.description && (
                  <div className="flex items-start gap-3">
                    <div className="w-24 text-sm text-gray-500">Mô tả</div>
                    <div className="text-sm text-gray-900">
                      {activity.description}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {activity.notes && (
                  <div className="flex items-start gap-3">
                    <div className="w-24 text-sm text-gray-500">Ghi chú</div>
                    <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 flex-1">
                      {activity.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Audit Trail */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Lịch sử
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-500">Tạo lúc</span>
                    <span className="text-gray-900">
                      {formatActivityDate(activity.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-500">Cập nhật lúc</span>
                    <span className="text-gray-900">
                      {formatActivityDate(activity.updated_at)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Card */}
            {user && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    Người thực hiện
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-farm-green-100 text-farm-green-700">
                        {user.name?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Crop Cycle Card */}
            {cropCycle && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Chu kỳ canh tác
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    to={`/chu-ky-canh-tac/${cropCycle.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">
                      {cropCycle.name}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Related Activities */}
            {relatedActivities.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    Hoạt động liên quan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-1">
                    {relatedActivities.map((related) => (
                      <ActivityLogItemCompact
                        key={related.id}
                        activity={related}
                        onClick={() => handleRelatedClick(related)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={deleteDialog.onToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa hoạt động?</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa hoạt động này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={deleteDialog.onClose}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================================
// SKELETON LOADER
// ============================================================================

function ActivityDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityDetailPage;
