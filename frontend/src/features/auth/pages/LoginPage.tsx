/**
 * Login Page
 * ===========
 * Secure login page with form validation and accessibility.
 * Designed with banking/fintech security standards.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Sun,
  Leaf,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeInput, isRateLimited, getRateLimitResetTime } from '@/lib/security';
import { cn } from '@/lib/utils';

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email')
    .email('Email không hợp lệ')
    .transform((val) => sanitizeInput(val.toLowerCase().trim())),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  remember: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// COMPONENT
// ============================================================================

export function LoginPage() {
  const { login, isLoading, error, clearError, isAuthenticated, isInitialized } =
    useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  // Focus email input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Clear errors when user starts typing
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(clearError, 5000);
      return () => { clearTimeout(timeout); };
    }
    return undefined;
  }, [error, clearError]);

  // Handle form submission
  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      // Check rate limiting (5 attempts per minute)
      if (isRateLimited('login', 5, 60000)) {
        const resetTime = Math.ceil(getRateLimitResetTime('login') / 1000);
        setRateLimitError(
          `Quá nhiều lần thử. Vui lòng đợi ${resetTime} giây.`
        );
        return;
      }

      setRateLimitError(null);

      try {
        await login(data.email, data.password, data.remember);
      } catch {
        // Error is handled by the store
        setFocus('password');
      }
    },
    [login, setFocus]
  );

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-farm-leaf-50 to-farm-soil-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-farm-leaf-600" />
          <p className="text-farm-soil-600">Đang tải...</p>
        </motion.div>
      </div>
    );
  }

  // Redirect if already authenticated (handled by router, but show loading)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-farm-leaf-50 to-farm-soil-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-farm-leaf-600" />
          <p className="text-farm-soil-600">Đang chuyển hướng...</p>
        </motion.div>
      </div>
    );
  }

  const displayError = rateLimitError || error;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-farm-leaf-50 via-white to-farm-soil-50">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-farm-leaf-600 to-farm-leaf-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sun className="h-7 w-7 text-farm-sun-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Soleil Farm</h1>
                <p className="text-farm-leaf-200 text-sm">Hệ thống quản lý trang trại</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6 mt-12">
              <FeatureItem
                icon={<Leaf className="h-5 w-5" />}
                title="Quản lý đất canh tác"
                description="Theo dõi và quản lý hiệu quả các thửa đất"
              />
              <FeatureItem
                icon={<Sun className="h-5 w-5" />}
                title="Theo dõi mùa vụ"
                description="Lên kế hoạch và giám sát các chu kỳ canh tác"
              />
              <FeatureItem
                icon={<Leaf className="h-5 w-5" />}
                title="Báo cáo thông minh"
                description="Phân tích dữ liệu và tối ưu hóa năng suất"
              />
            </div>
          </motion.div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-farm-sun-400/20 blur-3xl" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-farm-leaf-400/20 blur-3xl" />
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-farm-leaf-600 flex items-center justify-center">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-farm-soil-900">Soleil Farm</span>
          </div>

          <Card className="border-0 shadow-xl shadow-farm-soil-100/50">
            <CardHeader className="space-y-1 pb-6">
              <h2 className="text-2xl font-bold text-center text-farm-soil-900">
                Đăng nhập
              </h2>
              <p className="text-center text-farm-soil-500">
                Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục.
              </p>
            </CardHeader>

            <CardContent>
              {/* Error Alert */}
              <AnimatePresence>
                {displayError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <div
                      className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700"
                      role="alert"
                      aria-live="polite"
                    >
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">{displayError}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-farm-soil-700 font-medium"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-farm-soil-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      autoComplete="email"
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      aria-invalid={!!errors.email}
                      className={cn(
                        'pl-10 h-12 border-farm-soil-200 focus:border-farm-leaf-500 focus:ring-farm-leaf-500',
                        errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      )}
                      {...register('email')}
                      ref={emailInputRef}
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-sm text-red-600 flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-farm-soil-700 font-medium"
                    >
                      Mật khẩu
                    </Label>
                    <Link
                      to="/quen-mat-khau"
                      className="text-sm text-farm-leaf-600 hover:text-farm-leaf-700 hover:underline transition-colors"
                      tabIndex={-1}
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-farm-soil-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-describedby={errors.password ? 'password-error' : undefined}
                      aria-invalid={!!errors.password}
                      className={cn(
                        'pl-10 pr-12 h-12 border-farm-soil-200 focus:border-farm-leaf-500 focus:ring-farm-leaf-500',
                        errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      )}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-farm-soil-400 hover:text-farm-soil-600 transition-colors"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-sm text-red-600 flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="border-farm-soil-300 data-[state=checked]:bg-farm-leaf-600 data-[state=checked]:border-farm-leaf-600"
                    {...register('remember')}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-farm-soil-600 cursor-pointer select-none"
                  >
                    Ghi nhớ đăng nhập
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="w-full h-12 bg-farm-leaf-600 hover:bg-farm-leaf-700 text-white font-medium transition-all duration-200 shadow-lg shadow-farm-leaf-600/25 hover:shadow-farm-leaf-600/40"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </form>

              {/* Footer */}
              <p className="mt-6 text-center text-sm text-farm-soil-500">
                Chưa có tài khoản?{' '}
                <Link
                  to="/dang-ky"
                  className="text-farm-leaf-600 hover:text-farm-leaf-700 font-medium hover:underline transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Security notice */}
          <p className="mt-6 text-center text-xs text-farm-soil-400">
            Kết nối được bảo mật bằng SSL. Phiên làm việc tự động đăng xuất sau 15 phút không hoạt động.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-sm text-farm-leaf-200">{description}</p>
      </div>
    </div>
  );
}

export default LoginPage;
