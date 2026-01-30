/**
 * Cycle Action Buttons
 * =====================
 * Context-aware action buttons based on cycle status
 */

import { useState } from 'react';
import {
  Play,
  CheckCircle2,
  XCircle,
  Ban,
  Copy,
  Edit,
  Trash2,
  FileText,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { CropCycle } from '@/schemas';

import {
  useCropCycleStateMachine,
  getAvailableTransitions,
  isCycleEditable,
  isCycleDeletable,
  isTerminalStatus,
  type StateTransition,
} from '../hooks';
import { useDeleteCropCycle } from '@/hooks/api';

interface CycleActionButtonsProps {
  cycle: CropCycle;
  variant?: 'inline' | 'dropdown';
  onEdit?: () => void;
  onViewReport?: () => void;
}

interface ConfirmDialogState {
  open: boolean;
  action: string;
  title: string;
  description: string;
  requireReason: boolean;
}

export function CycleActionButtons({
  cycle,
  variant = 'inline',
  onEdit,
  onViewReport,
}: CycleActionButtonsProps) {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    action: '',
    title: '',
    description: '',
    requireReason: false,
  });
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const stateMachine = useCropCycleStateMachine(cycle.id);
  const deleteMutation = useDeleteCropCycle();

  const availableTransitions = getAvailableTransitions(cycle.status);
  const canEdit = isCycleEditable(cycle.status);
  const canDelete = isCycleDeletable(cycle.status);
  const isTerminal = isTerminalStatus(cycle.status);

  const openConfirmDialog = (
    action: string,
    title: string,
    description: string,
    requireReason = false
  ) => {
    setConfirmDialog({ open: true, action, title, description, requireReason });
    setReason('');
    setNotes('');
  };

  const closeDialog = () => {
    setConfirmDialog({
      open: false,
      action: '',
      title: '',
      description: '',
      requireReason: false,
    });
    setReason('');
    setNotes('');
  };

  const handleAction = async () => {
    switch (confirmDialog.action) {
      case 'activate':
        await stateMachine.activate.mutateAsync({
          notes: notes || undefined,
        });
        break;
      case 'complete':
        await stateMachine.complete.mutateAsync({
          actual_end_date: new Date().toISOString().split('T')[0],
          notes: notes || undefined,
        });
        break;
      case 'fail':
        await stateMachine.fail.mutateAsync({
          reason,
          notes: notes || undefined,
        });
        break;
      case 'abandon':
        await stateMachine.abandon.mutateAsync({
          reason,
          notes: notes || undefined,
        });
        break;
      case 'delete':
        await deleteMutation.mutateAsync(cycle.id);
        break;
      case 'duplicate':
        await stateMachine.duplicate.mutateAsync({});
        break;
    }
    closeDialog();
  };

  const getTransitionButton = (transition: StateTransition) => {
    const onClick = () => {
      switch (transition.action) {
        case 'activate':
          openConfirmDialog(
            'activate',
            'Bắt đầu chu kỳ',
            'Bạn có chắc muốn bắt đầu chu kỳ này? Hành động này sẽ chuyển trạng thái sang "Đang thực hiện".',
            false
          );
          break;
        case 'complete':
          openConfirmDialog(
            'complete',
            'Hoàn thành chu kỳ',
            'Xác nhận hoàn thành chu kỳ canh tác này?',
            false
          );
          break;
        case 'fail':
          openConfirmDialog(
            'fail',
            'Đánh dấu thất bại',
            'Vui lòng nhập lý do thất bại. Hành động này không thể hoàn tác.',
            true
          );
          break;
        case 'abandon':
          openConfirmDialog(
            'abandon',
            'Hủy bỏ chu kỳ',
            'Vui lòng nhập lý do hủy bỏ. Hành động này không thể hoàn tác.',
            true
          );
          break;
      }
    };

    const variantMap: Record<string, 'default' | 'destructive' | 'outline' | 'secondary'> = {
      success: 'default',
      destructive: 'destructive',
      warning: 'outline',
      default: 'secondary',
    };

    const iconMap: Record<string, React.ReactNode> = {
      activate: <Play className="h-4 w-4 mr-2" />,
      complete: <CheckCircle2 className="h-4 w-4 mr-2" />,
      fail: <XCircle className="h-4 w-4 mr-2" />,
      abandon: <Ban className="h-4 w-4 mr-2" />,
    };

    return (
      <Button
        key={transition.action}
        variant={variantMap[transition.variant]}
        onClick={onClick}
        disabled={stateMachine.isTransitioning}
      >
        {iconMap[transition.action]}
        {transition.label}
      </Button>
    );
  };

  if (variant === 'dropdown') {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Status transitions */}
            {availableTransitions.map((transition) => (
              <DropdownMenuItem
                key={transition.action}
                onClick={() => {
                  switch (transition.action) {
                    case 'activate':
                      openConfirmDialog(
                        'activate',
                        'Bắt đầu chu kỳ',
                        'Bạn có chắc muốn bắt đầu chu kỳ này?',
                        false
                      );
                      break;
                    case 'complete':
                      openConfirmDialog(
                        'complete',
                        'Hoàn thành chu kỳ',
                        'Xác nhận hoàn thành chu kỳ canh tác này?',
                        false
                      );
                      break;
                    case 'fail':
                      openConfirmDialog(
                        'fail',
                        'Đánh dấu thất bại',
                        'Vui lòng nhập lý do thất bại.',
                        true
                      );
                      break;
                    case 'abandon':
                      openConfirmDialog(
                        'abandon',
                        'Hủy bỏ chu kỳ',
                        'Vui lòng nhập lý do hủy bỏ.',
                        true
                      );
                      break;
                  }
                }}
                className={cn(
                  transition.variant === 'destructive' && 'text-destructive'
                )}
              >
                {transition.label}
              </DropdownMenuItem>
            ))}

            {availableTransitions.length > 0 && <DropdownMenuSeparator />}

            {/* Common actions */}
            {canEdit && onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() =>
                openConfirmDialog(
                  'duplicate',
                  'Nhân bản chu kỳ',
                  'Tạo một chu kỳ mới với cấu hình tương tự?',
                  false
                )
              }
            >
              <Copy className="h-4 w-4 mr-2" />
              Nhân bản
            </DropdownMenuItem>

            {isTerminal && onViewReport && (
              <DropdownMenuItem onClick={onViewReport}>
                <FileText className="h-4 w-4 mr-2" />
                Xem báo cáo
              </DropdownMenuItem>
            )}

            {canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    openConfirmDialog(
                      'delete',
                      'Xóa chu kỳ',
                      'Bạn có chắc muốn xóa chu kỳ này? Hành động này không thể hoàn tác.',
                      false
                    )
                  }
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Confirm dialog */}
        <ConfirmActionDialog
          confirmDialog={confirmDialog}
          reason={reason}
          notes={notes}
          setReason={setReason}
          setNotes={setNotes}
          closeDialog={closeDialog}
          handleAction={handleAction}
          isLoading={stateMachine.isTransitioning || deleteMutation.isPending}
        />
      </>
    );
  }

  // Inline variant
  return (
    <>
      <div className="flex items-center gap-2">
        {/* Status transitions */}
        {availableTransitions.map((transition) => getTransitionButton(transition))}

        {/* Common actions */}
        {canEdit && onEdit && (
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        )}

        {isTerminal && onViewReport && (
          <Button variant="secondary" onClick={onViewReport}>
            <FileText className="h-4 w-4 mr-2" />
            Xem báo cáo
          </Button>
        )}

        {/* More actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                openConfirmDialog(
                  'duplicate',
                  'Nhân bản chu kỳ',
                  'Tạo một chu kỳ mới với cấu hình tương tự?',
                  false
                )
              }
            >
              <Copy className="h-4 w-4 mr-2" />
              Nhân bản
            </DropdownMenuItem>

            {canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    openConfirmDialog(
                      'delete',
                      'Xóa chu kỳ',
                      'Bạn có chắc muốn xóa chu kỳ này?',
                      false
                    )
                  }
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Confirm dialog */}
      <ConfirmActionDialog
        confirmDialog={confirmDialog}
        reason={reason}
        notes={notes}
        setReason={setReason}
        setNotes={setNotes}
        closeDialog={closeDialog}
        handleAction={handleAction}
        isLoading={stateMachine.isTransitioning || deleteMutation.isPending}
      />
    </>
  );
}

// Extracted dialog component
function ConfirmActionDialog({
  confirmDialog,
  reason,
  notes,
  setReason,
  setNotes,
  closeDialog,
  handleAction,
  isLoading,
}: {
  confirmDialog: ConfirmDialogState;
  reason: string;
  notes: string;
  setReason: (v: string) => void;
  setNotes: (v: string) => void;
  closeDialog: () => void;
  handleAction: () => void;
  isLoading: boolean;
}) {
  const isDestructive = ['fail', 'abandon', 'delete'].includes(confirmDialog.action);

  return (
    <Dialog open={confirmDialog.open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogDescription>{confirmDialog.description}</DialogDescription>
        </DialogHeader>

        {confirmDialog.requireReason && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Lý do *</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú thêm</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú chi tiết (tùy chọn)..."
                rows={3}
              />
            </div>
          </div>
        )}

        {!confirmDialog.requireReason && confirmDialog.action !== 'delete' && (
          <div className="space-y-2 py-4">
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thêm ghi chú..."
              rows={2}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={closeDialog} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant={isDestructive ? 'destructive' : 'default'}
            onClick={handleAction}
            disabled={isLoading || (confirmDialog.requireReason && !reason.trim())}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
