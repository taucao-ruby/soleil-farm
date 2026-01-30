import { useState, useCallback } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LandParcel } from '@/schemas';
import { useLandParcelDeleteImpact } from '@/hooks/api/use-land-parcels';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parcel: LandParcel | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

/**
 * DeleteConfirmDialog Component
 * =============================
 * Confirmation dialog for deleting land parcels
 * Features:
 * - Shows impact analysis (affected crop cycles)
 * - Requires typing "DELETE" to confirm
 * - Vietnamese messages
 */
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  parcel,
  onConfirm,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const [confirmText, setConfirmText] = useState('');

  const { data: impact, isLoading: isLoadingImpact } = useLandParcelDeleteImpact(
    open && parcel ? parcel.id : null
  );

  const isConfirmValid = confirmText.toUpperCase() === 'DELETE';

  const handleConfirm = useCallback(() => {
    if (isConfirmValid) {
      onConfirm();
      setConfirmText('');
    }
  }, [isConfirmValid, onConfirm]);

  const handleClose = useCallback(() => {
    setConfirmText('');
    onOpenChange(false);
  }, [onOpenChange]);

  if (!parcel) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle>Xóa lô đất</DialogTitle>
              <DialogDescription>
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Parcel Info */}
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium">{parcel.name}</p>
            <p className="text-sm text-muted-foreground">Mã: {parcel.code}</p>
          </div>

          {/* Impact Warning */}
          {isLoadingImpact ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang phân tích tác động...
            </div>
          ) : impact && (impact.crop_cycles_count > 0 || impact.activity_logs_count > 0) ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">
                ⚠️ Cảnh báo: Xóa lô đất này sẽ ảnh hưởng đến:
              </p>
              <ul className="mt-2 list-inside list-disc text-sm text-destructive">
                {impact.crop_cycles_count > 0 && (
                  <li>{impact.crop_cycles_count} chu kỳ canh tác</li>
                )}
                {impact.activity_logs_count > 0 && (
                  <li>{impact.activity_logs_count} bản ghi hoạt động</li>
                )}
              </ul>
            </div>
          ) : null}

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirm-delete">
              Nhập <span className="font-mono font-bold">DELETE</span> để xác nhận:
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Nhập DELETE"
              className="font-mono"
              autoComplete="off"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmValid || isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xóa lô đất
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
