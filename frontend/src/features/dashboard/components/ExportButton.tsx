import { Download, FileSpreadsheet, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ============================================================================
// TYPES
// ============================================================================

interface ExportButtonProps {
  /** Export to CSV handler */
  onExportCsv?: () => void;
  /** Export to PDF handler */
  onExportPdf?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ExportButton
 * ============
 * Dropdown button for exporting dashboard data.
 *
 * @example
 * <ExportButton
 *   onExportCsv={() => exportCsv()}
 *   onExportPdf={() => exportPdf()}
 * />
 */
export function ExportButton({
  onExportCsv,
  onExportPdf,
  isLoading = false,
  disabled = false,
}: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isLoading}
        >
          <Download className="mr-2 h-4 w-4" />
          {isLoading ? 'Đang xuất...' : 'Xuất dữ liệu'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onExportCsv && (
          <DropdownMenuItem onClick={onExportCsv}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Xuất CSV (Excel)
          </DropdownMenuItem>
        )}
        {onExportPdf && (
          <DropdownMenuItem onClick={onExportPdf}>
            <FileText className="mr-2 h-4 w-4" />
            Xuất PDF
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
