import { Home, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

/**
 * 404 Not Found Page
 * ==================
 * Trang hiển thị khi URL không tồn tại
 */
export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <AlertCircle className="h-10 w-10 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-xl font-semibold">Không tìm thấy trang</h2>
        <p className="text-muted-foreground max-w-md">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
      </div>

      <Button asChild>
        <Link to="/">
          <Home className="mr-2 h-4 w-4" />
          Về trang chủ
        </Link>
      </Button>
    </div>
  );
}
