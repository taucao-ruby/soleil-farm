import { Calendar, Plus } from 'lucide-react';

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
 * Seasons Page
 * ============
 * Trang quản lý mùa vụ:
 * - Danh sách các mùa vụ
 * - Thời gian bắt đầu/kết thúc
 * - Trạng thái hoạt động
 */
export function SeasonsPage() {
  // Mock data - sẽ được thay thế bằng API calls
  const seasons = [
    {
      id: 1,
      name: 'Đông Xuân',
      year: '2025-2026',
      startDate: '2025-11-01',
      endDate: '2026-03-31',
      status: 'active',
      statusLabel: 'Đang diễn ra',
      activeCycles: 8,
    },
    {
      id: 2,
      name: 'Thu Đông',
      year: '2025',
      startDate: '2025-08-01',
      endDate: '2025-11-30',
      status: 'completed',
      statusLabel: 'Đã kết thúc',
      activeCycles: 0,
    },
    {
      id: 3,
      name: 'Hè Thu',
      year: '2025',
      startDate: '2025-05-01',
      endDate: '2025-08-31',
      status: 'completed',
      statusLabel: 'Đã kết thúc',
      activeCycles: 0,
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'upcoming':
        return 'info';
      case 'completed':
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
          <Calendar className="h-8 w-8 text-farm-sun" />
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Mùa vụ</h1>
            <p className="text-muted-foreground">
              Quản lý các mùa vụ trong năm
            </p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm mùa vụ
        </Button>
      </div>

      {/* Current Season Highlight */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Mùa vụ hiện tại</CardTitle>
              <CardDescription>Đông Xuân 2025-2026</CardDescription>
            </div>
            <Badge variant="success">Đang diễn ra</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Thời gian</p>
              <p className="font-medium">01/11/2025 - 31/03/2026</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chu kỳ đang chạy</p>
              <p className="font-medium">8 chu kỳ</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thời gian còn lại</p>
              <p className="font-medium">45 ngày</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seasons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử mùa vụ</CardTitle>
          <CardDescription>Tất cả các mùa vụ đã và đang thực hiện</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mùa vụ</TableHead>
                <TableHead>Năm</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Số chu kỳ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seasons.map((season) => (
                <TableRow key={season.id}>
                  <TableCell className="font-medium">{season.name}</TableCell>
                  <TableCell>{season.year}</TableCell>
                  <TableCell>{season.startDate}</TableCell>
                  <TableCell>{season.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(season.status)}>
                      {season.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {season.activeCycles}
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
