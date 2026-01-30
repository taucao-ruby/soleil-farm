import { Trash2, Download, RefreshCw, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { LandParcelStatus } from '@/schemas';
import { STATUS_LABELS } from '@/schemas';

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onChangeStatus: (status: LandParcelStatus) => void;
  onExport: () => void;
  isDeleting?: boolean;
  isChangingStatus?: boolean;
  isExporting?: boolean;
}

/**
 * BulkActions Component
 * =====================
 * Bulk action controls for selected land parcels
 */
export function BulkActions({
  selectedCount,
  onDelete,
  onChangeStatus,
  onExport,
  isDeleting = false,
  isChangingStatus = false,
  isExporting = false,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-4 rounded-lg bg-muted px-4 py-3">
      <span className="text-sm font-medium">
        Đã chọn <strong>{selectedCount}</strong> lô đất
      </span>

      <div className="flex items-center gap-2">
        {/* Delete */}
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? 'Đang xóa...' : 'Xóa'}
        </Button>

        {/* Export */}
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Đang xuất...' : 'Xuất file'}
        </Button>

        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="mr-2 h-4 w-4" />
              Thêm
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={isChangingStatus}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Đổi trạng thái
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => onChangeStatus(value as LandParcelStatus)}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
