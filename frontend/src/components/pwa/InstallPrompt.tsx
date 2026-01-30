/**
 * InstallPrompt Component
 * =======================
 * Prompts users to install the PWA.
 * Shows a dismissable banner with install button.
 */

import { Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInstallPrompt } from '@/lib/pwa/use-install-prompt';
import { Button } from '@/components/ui/button';

interface InstallPromptProps {
  className?: string;
}

export function InstallPrompt({ className }: InstallPromptProps) {
  const { canInstall, promptInstall, dismissPrompt } = useInstallPrompt();

  if (!canInstall) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50',
        'bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
        'p-4 animate-in slide-in-from-bottom-4 duration-300',
        className
      )}
    >
      <button
        onClick={dismissPrompt}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label="Đóng"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-4">
        {/* App Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
          <img
            src="/icons/icon-72x72.png"
            alt="Soleil Farm"
            className="w-8 h-8"
            onError={(e) => {
              // Fallback to emoji if icon fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '🌱';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            Cài đặt Soleil Farm
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Truy cập nhanh hơn và sử dụng offline!
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <Button
              size="sm"
              onClick={promptInstall}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Download className="h-4 w-4 mr-1" />
              Cài đặt
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={dismissPrompt}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Để sau
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Install Button
 * For use in navigation or settings
 */
interface InstallButtonProps {
  className?: string;
}

export function InstallButton({ className }: InstallButtonProps) {
  const { canInstall, promptInstall, isInstalled } = useInstallPrompt();

  if (!canInstall && !isInstalled) {
    return null;
  }

  if (isInstalled) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className={cn('text-emerald-600', className)}
      >
        <Download className="h-4 w-4 mr-1" />
        Đã cài đặt
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={promptInstall}
      className={cn('border-emerald-600 text-emerald-600 hover:bg-emerald-50', className)}
    >
      <Download className="h-4 w-4 mr-1" />
      Cài đặt app
    </Button>
  );
}
