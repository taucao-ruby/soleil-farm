import { useState, useCallback } from 'react';
import { Plus, Trash2, Droplets, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { WaterSource } from '@/schemas';

// Mock available water sources - in production, fetch from API
const AVAILABLE_WATER_SOURCES: WaterSource[] = [
  { id: 1, name: 'Kênh chính Đông', type: 'canal' },
  { id: 2, name: 'Giếng khoan A1', type: 'well' },
  { id: 3, name: 'Ao chứa phía Nam', type: 'pond' },
  { id: 4, name: 'Suối Bắc', type: 'stream' },
  { id: 5, name: 'Hệ thống tưới nhỏ giọt', type: 'irrigation' },
];

const WATER_SOURCE_TYPE_LABELS: Record<string, string> = {
  canal: 'Kênh',
  well: 'Giếng',
  pond: 'Ao',
  stream: 'Suối',
  irrigation: 'Hệ thống tưới',
  river: 'Sông',
};

interface WaterSourcesSectionProps {
  waterSources: WaterSource[];
  onAttach: (waterSourceIds: number[]) => void;
  onDetach: (waterSourceId: number) => void;
  isAttaching?: boolean;
  isDetaching?: boolean;
  detachingId?: number | null;
}

/**
 * WaterSourcesSection Component
 * =============================
 * Manage water sources linked to a land parcel
 */
export function WaterSourcesSection({
  waterSources,
  onAttach,
  onDetach,
  isAttaching = false,
  isDetaching = false,
  detachingId = null,
}: WaterSourcesSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedWaterSourceId, setSelectedWaterSourceId] = useState<number | null>(null);

  const availableToAdd = AVAILABLE_WATER_SOURCES.filter(
    (ws) => !waterSources.some((linked) => linked.id === ws.id)
  );

  const handleAddWaterSource = useCallback(() => {
    if (selectedWaterSourceId) {
      onAttach([selectedWaterSourceId]);
      setIsAddDialogOpen(false);
      setSelectedWaterSourceId(null);
    }
  }, [selectedWaterSourceId, onAttach]);

  const handleRemoveWaterSource = useCallback(
    (id: number) => {
      onDetach(id);
    },
    [onDetach]
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Nguồn nước
            </CardTitle>
            <CardDescription>
              Các nguồn nước liên kết với lô đất này
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            disabled={availableToAdd.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm nguồn nước
          </Button>
        </CardHeader>

        <CardContent>
          {waterSources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Droplets className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                Chưa có nguồn nước nào được liên kết
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsAddDialogOpen(true)}
                disabled={availableToAdd.length === 0}
              >
                Thêm nguồn nước đầu tiên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên nguồn nước</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {waterSources.map((ws) => (
                  <TableRow key={ws.id}>
                    <TableCell className="font-medium">{ws.name}</TableCell>
                    <TableCell>
                      {WATER_SOURCE_TYPE_LABELS[ws.type] || ws.type}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveWaterSource(ws.id)}
                        disabled={isDetaching && detachingId === ws.id}
                        aria-label={`Gỡ nguồn nước ${ws.name}`}
                      >
                        {isDetaching && detachingId === ws.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Water Source Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm nguồn nước</DialogTitle>
            <DialogDescription>
              Chọn nguồn nước để liên kết với lô đất này
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select
              value={selectedWaterSourceId ? String(selectedWaterSourceId) : ''}
              onValueChange={(value) => setSelectedWaterSourceId(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nguồn nước" />
              </SelectTrigger>
              <SelectContent>
                {availableToAdd.map((ws) => (
                  <SelectItem key={ws.id} value={String(ws.id)}>
                    {ws.name} ({WATER_SOURCE_TYPE_LABELS[ws.type] || ws.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleAddWaterSource}
              disabled={!selectedWaterSourceId || isAttaching}
            >
              {isAttaching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
