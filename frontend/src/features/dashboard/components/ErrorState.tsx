import { RefreshCw, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// ============================================================================
// TYPES
// ============================================================================

interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error message */
  message?: string;
  /** Retry handler */
  onRetry?: () => void;
  /** Full page error or card error */
  variant?: 'page' | 'card';
  /** Additional className */
  className?: string;
}

// ============================================================================
// ERROR STATE COMPONENT
// ============================================================================

/**
 * ErrorState
 * ==========
 * Displays an error message with optional retry button.
 *
 * @example
 * <ErrorState
 *   title="Không thể tải dữ liệu"
 *   message="Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại."
 *   onRetry={() => refetch()}
 * />
 */
export function ErrorState({
  title = 'Đã xảy ra lỗi',
  message = 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
  onRetry,
  variant = 'card',
  className,
}: ErrorStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-destructive/10 p-3 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onRetry}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Thử lại
        </Button>
      )}
    </div>
  );

  if (variant === 'page') {
    return (
      <div className={className}>
        {content}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        {content}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DASHBOARD ERROR STATE
// ============================================================================

interface DashboardErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

/**
 * Full dashboard error state
 */
export function DashboardErrorState({ error, onRetry }: DashboardErrorStateProps) {
  return (
    <div className="space-y-6">
      {/* Header skeleton replacement */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold md:text-3xl text-muted-foreground">
          Dashboard
        </h1>
      </div>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Lỗi tải dữ liệu
          </CardTitle>
          <CardDescription>
            Không thể tải thông tin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-mono text-muted-foreground">
                {error.message}
              </p>
            </div>
            <div className="flex gap-2">
              {onRetry && (
                <Button onClick={onRetry}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Thử lại
                </Button>
              )}
              <Button variant="outline" onClick={() => window.location.reload()}>
                Tải lại trang
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
