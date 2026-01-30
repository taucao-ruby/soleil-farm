import { useState, useCallback, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Map, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDisclosure } from '@/hooks/useDisclosure';
import {
  useLandParcels,
  useCreateLandParcel,
  useUpdateLandParcel,
  useDeleteLandParcel,
  useBulkDeleteLandParcels,
  useBulkChangeLandParcelStatus,
  useExportLandParcels,
} from '@/hooks/api/use-land-parcels';
import { queryKeys } from '@/lib/query-client';
import type { LandParcel, LandParcelQueryParams, CreateLandParcelInput, LandParcelStatus } from '@/schemas';

import {
  LandParcelFilters,
  LandParcelForm,
  LandParcelTable,
  DeleteConfirmDialog,
  Pagination,
  BulkActions,
} from '../components';

// Default pagination settings
const DEFAULT_PER_PAGE = 20;

/**
 * LandParcelListPage
 * ==================
 * Complete CRUD interface for land parcel management
 * Features:
 * - DataTable with sorting, filtering, pagination
 * - Create/Edit dialogs
 * - Delete confirmation with impact analysis
 * - Bulk actions (delete, status change, export)
 * - Keyboard shortcuts
 * - Optimistic updates
 */
export function LandParcelListPage() {
  const queryClient = useQueryClient();

  // ============================================================================
  // STATE
  // ============================================================================

  // Filters & Pagination
  const [filters, setFilters] = useState<LandParcelQueryParams>({
    page: 1,
    per_page: DEFAULT_PER_PAGE,
    sort_by: 'created_at',
    sort_direction: 'desc',
  });
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Dialogs
  const createDialog = useDisclosure();
  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  // Current editing/deleting parcel
  const [currentParcel, setCurrentParcel] = useState<LandParcel | null>(null);

  // ============================================================================
  // QUERIES
  // ============================================================================

  const { data: parcelsData, isLoading, isFetching, refetch } = useLandParcels({
    ...filters,
    search: debouncedSearch || undefined,
  });

  // ============================================================================
  // MUTATIONS
  // ============================================================================

  const createMutation = useCreateLandParcel();
  const updateMutation = useUpdateLandParcel();
  const deleteMutation = useDeleteLandParcel();
  const bulkDeleteMutation = useBulkDeleteLandParcels();
  const bulkStatusMutation = useBulkChangeLandParcelStatus();
  const exportMutation = useExportLandParcels();

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const parcels = parcelsData?.data || [];
  const meta = parcelsData?.meta;

  const stats = useMemo(() => {
    if (!parcels.length) return { total: 0, totalArea: 0, inUse: 0 };
    return {
      total: meta?.total || parcels.length,
      totalArea: parcels.reduce((sum, p) => sum + p.area_value, 0),
      inUse: parcels.filter((p) => p.status === 'in_use').length,
    };
  }, [parcels, meta]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setFilters((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Clear selection when filters change
  useEffect(() => {
    setSelectedIds([]);
  }, [filters, debouncedSearch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N: New parcel
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        createDialog.onOpen();
      }
      // Ctrl+R: Refresh
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refetch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createDialog, refetch]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSort = useCallback((column: string) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: column,
      sort_direction:
        prev.sort_by === column && prev.sort_direction === 'asc' ? 'desc' : 'asc',
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePerPageChange = useCallback((perPage: number) => {
    setFilters((prev) => ({ ...prev, per_page: perPage, page: 1 }));
  }, []);

  const handleCreate = useCallback(
    (data: CreateLandParcelInput) => {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Tạo lô đất thành công!');
          createDialog.onClose();
          queryClient.invalidateQueries({ queryKey: queryKeys.landParcels.lists() });
        },
        onError: (error: Error) => {
          toast.error(`Lỗi: ${error.message}`);
        },
      });
    },
    [createMutation, createDialog, queryClient]
  );

  const handleEdit = useCallback(
    (parcel: LandParcel) => {
      setCurrentParcel(parcel);
      editDialog.onOpen();
    },
    [editDialog]
  );

  const handleUpdate = useCallback(
    (data: CreateLandParcelInput) => {
      if (!currentParcel) return;

      updateMutation.mutate(
        { id: currentParcel.id, data },
        {
          onSuccess: () => {
            toast.success('Cập nhật lô đất thành công!');
            editDialog.onClose();
            setCurrentParcel(null);
          },
          onError: (error: Error) => {
            toast.error(`Lỗi: ${error.message}`);
          },
        }
      );
    },
    [currentParcel, updateMutation, editDialog]
  );

  const handleDeleteClick = useCallback(
    (parcel: LandParcel) => {
      setCurrentParcel(parcel);
      deleteDialog.onOpen();
    },
    [deleteDialog]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!currentParcel) return;

    deleteMutation.mutate(currentParcel.id, {
      onSuccess: () => {
        toast.success('Xóa lô đất thành công!');
        deleteDialog.onClose();
        setCurrentParcel(null);
        setSelectedIds((prev) => prev.filter((id) => id !== currentParcel.id));
      },
      onError: (error: Error) => {
        toast.error(`Lỗi: ${error.message}`);
      },
    });
  }, [currentParcel, deleteMutation, deleteDialog]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length === 0) return;

    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(`Đã xóa ${selectedIds.length} lô đất!`);
        setSelectedIds([]);
      },
      onError: (error: Error) => {
        toast.error(`Lỗi: ${error.message}`);
      },
    });
  }, [selectedIds, bulkDeleteMutation]);

  const handleBulkChangeStatus = useCallback(
    (status: LandParcelStatus) => {
      if (selectedIds.length === 0) return;

      bulkStatusMutation.mutate(
        { ids: selectedIds, status },
        {
          onSuccess: () => {
            toast.success(`Đã cập nhật trạng thái ${selectedIds.length} lô đất!`);
            setSelectedIds([]);
          },
          onError: (error: Error) => {
            toast.error(`Lỗi: ${error.message}`);
          },
        }
      );
    },
    [selectedIds, bulkStatusMutation]
  );

  const handleExport = useCallback(() => {
    exportMutation.mutate(
      { ids: selectedIds.length > 0 ? selectedIds : undefined, params: filters },
      {
        onSuccess: () => {
          toast.success('Xuất file thành công!');
        },
        onError: (error: Error) => {
          toast.error(`Lỗi: ${error.message}`);
        },
      }
    );
  }, [selectedIds, filters, exportMutation]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Map className="h-8 w-8 text-farm-leaf" />
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Đất canh tác</h1>
            <p className="text-muted-foreground">
              Quản lý các lô đất trong trang trại
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Làm mới"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={createDialog.onOpen}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm lô đất
            <span className="ml-2 text-xs text-muted-foreground">(Ctrl+N)</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng số lô đất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total} lô</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng diện tích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArea.toFixed(1)} ha</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang sử dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inUse} lô</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lô đất</CardTitle>
          <CardDescription>
            Tất cả các lô đất đang được quản lý trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <LandParcelFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={setSearchValue}
            searchValue={searchValue}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedCount={selectedIds.length}
            onDelete={handleBulkDelete}
            onChangeStatus={handleBulkChangeStatus}
            onExport={handleExport}
            isDeleting={bulkDeleteMutation.isPending}
            isChangingStatus={bulkStatusMutation.isPending}
            isExporting={exportMutation.isPending}
          />

          {/* Table */}
          <LandParcelTable
            data={parcels}
            isLoading={isLoading}
            sortBy={filters.sort_by}
            sortDirection={filters.sort_direction}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />

          {/* Pagination */}
          {meta && (
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              totalItems={meta.total}
              perPage={meta.per_page}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <LandParcelForm
        open={createDialog.isOpen}
        onOpenChange={createDialog.onClose}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        mode="create"
      />

      {/* Edit Dialog */}
      <LandParcelForm
        open={editDialog.isOpen}
        onOpenChange={editDialog.onClose}
        onSubmit={handleUpdate}
        defaultValues={currentParcel || undefined}
        isLoading={updateMutation.isPending}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.onClose}
        parcel={currentParcel}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
