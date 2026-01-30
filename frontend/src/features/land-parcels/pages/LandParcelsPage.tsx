import { Map, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * Land Parcels Page
 * =================
 * Trang quản lý đất canh tác:
 * - Danh sách các lô đất
 * - Thông tin diện tích, vị trí
 * - Trạng thái sử dụng
 */
export function LandParcelsPage() {
  // Mock data - sẽ được thay thế bằng API calls
  const parcels = [
    {
      id: 1,
      code: 'LOT-A1',
      name: 'Lô A1 - Đồng Bắc',
      area: 5.5,
      unit: 'ha',
      status: 'active',
      statusLabel: 'Đang canh tác',
      currentCrop: 'Lúa ST25',
    },
    {
      id: 2,
      code: 'LOT-A2',
      name: 'Lô A2 - Đồng Bắc',
      area: 4.2,
      unit: 'ha',
      status: 'active',
      statusLabel: 'Đang canh tác',
      currentCrop: 'Lúa ST25',
    },
    {
      id: 3,
      code: 'LOT-B1',
      name: 'Lô B1 - Đồng Nam',
      area: 6.0,
      unit: 'ha',
      status: 'fallow',
      statusLabel: 'Nghỉ đất',
      currentCrop: null,
    },
    {
      id: 4,
      code: 'LOT-B3',
      name: 'Lô B3 - Đồng Nam',
      area: 3.8,
      unit: 'ha',
      status: 'harvesting',
      statusLabel: 'Đang thu hoạch',
      currentCrop: 'Lúa OM18',
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'harvesting':
        return 'warning';
      case 'fallow':
        return 'secondary';
      default:
        return 'outline';
    }
  };

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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm lô đất
        </Button>
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
            <div className="text-2xl font-bold">{parcels.length} lô</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng diện tích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parcels.reduce((sum, p) => sum + p.area, 0).toFixed(1)} ha
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang canh tác
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parcels.filter((p) => p.status === 'active').length} lô
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lô đất</CardTitle>
          <CardDescription>
            Tất cả các lô đất đang được quản lý
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã lô</TableHead>
                <TableHead>Tên lô đất</TableHead>
                <TableHead className="text-right">Diện tích</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cây trồng hiện tại</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parcels.map((parcel) => (
                <TableRow key={parcel.id}>
                  <TableCell className="font-medium">{parcel.code}</TableCell>
                  <TableCell>{parcel.name}</TableCell>
                  <TableCell className="text-right">
                    {parcel.area} {parcel.unit}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(parcel.status)}>
                      {parcel.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {parcel.currentCrop ?? (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
