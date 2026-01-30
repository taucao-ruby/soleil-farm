import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute, PublicRoute } from '@/components/auth';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  ActivityLogListPage,
  ActivityCalendarPage,
  ActivityDetailPage,
} from '@/features/activity-logs';
import { LoginPage } from '@/features/auth';
import { CropCyclesPage, CropCycleDetailPage } from '@/features/crop-cycles';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { NotFoundPage } from '@/features/errors/pages/NotFoundPage';
import { LandParcelListPage, LandParcelDetailPage } from '@/features/land-parcels';
import { SeasonsPage } from '@/features/seasons/pages/SeasonsPage';

/**
 * Application Routes
 * ==================
 * Cấu trúc routing cho Soleil Farm với bảo mật authentication
 *
 * Public Routes:
 * - /dang-nhap → Trang đăng nhập
 * - /dang-ky → Trang đăng ký (placeholder)
 * - /quen-mat-khau → Quên mật khẩu (placeholder)
 *
 * Protected Routes (require authentication):
 * - / → Dashboard (tổng quan trang trại)
 * - /dat-canh-tac → Quản lý đất canh tác
 * - /mua-vu → Quản lý mùa vụ
 * - /chu-ky-canh-tac → Quản lý chu kỳ canh tác
 * - /nhat-ky → Nhật ký hoạt động
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes - No authentication required */}
      <Route
        path="dang-nhap"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="dang-ky"
        element={
          <PublicRoute>
            <RegisterPlaceholder />
          </PublicRoute>
        }
      />
      <Route
        path="quen-mat-khau"
        element={
          <PublicRoute>
            <ForgotPasswordPlaceholder />
          </PublicRoute>
        }
      />

      {/* Protected Routes - Authentication required */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard - Tổng quan */}
        <Route index element={<DashboardPage />} />

        {/* Đất canh tác - Land Parcels */}
        <Route path="dat-canh-tac">
          <Route index element={<LandParcelListPage />} />
          <Route path=":id" element={<LandParcelDetailPage />} />
        </Route>

        {/* Mùa vụ */}
        <Route path="mua-vu" element={<SeasonsPage />} />

        {/* Chu kỳ canh tác */}
        <Route path="chu-ky-canh-tac">
          <Route index element={<CropCyclesPage />} />
          <Route path=":id" element={<CropCycleDetailPage />} />
        </Route>

        {/* Nhật ký hoạt động */}
        <Route path="nhat-ky">
          <Route index element={<ActivityLogListPage />} />
          <Route path="lich" element={<ActivityCalendarPage />} />
          <Route path=":id" element={<ActivityDetailPage />} />
        </Route>

        {/* Cài đặt */}
        <Route path="cai-dat" element={<SettingsPlaceholder />} />

        {/* Hỗ trợ */}
        <Route path="ho-tro" element={<SupportPlaceholder />} />

        {/* Tài khoản */}
        <Route path="tai-khoan" element={<AccountPlaceholder />} />

        {/* 404 Page */}
        <Route path="404" element={<NotFoundPage />} />

        {/* Không có quyền */}
        <Route path="khong-co-quyen" element={<UnauthorizedPlaceholder />} />

        {/* Redirect unknown routes to 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

// ============================================================================
// PLACEHOLDER COMPONENTS
// ============================================================================

function RegisterPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-farm-soil-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-farm-soil-900">Đăng ký</h1>
        <p className="text-farm-soil-500 mt-2">Tính năng đang được phát triển</p>
      </div>
    </div>
  );
}

function ForgotPasswordPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-farm-soil-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-farm-soil-900">Quên mật khẩu</h1>
        <p className="text-farm-soil-500 mt-2">Tính năng đang được phát triển</p>
      </div>
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-farm-soil-100 p-8">
      <h1 className="text-2xl font-bold text-farm-soil-900">Cài đặt</h1>
      <p className="text-farm-soil-500 mt-2">Tính năng đang được phát triển</p>
    </div>
  );
}

function SupportPlaceholder() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-farm-soil-100 p-8">
      <h1 className="text-2xl font-bold text-farm-soil-900">Hỗ trợ</h1>
      <p className="text-farm-soil-500 mt-2">Tính năng đang được phát triển</p>
    </div>
  );
}

function AccountPlaceholder() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-farm-soil-100 p-8">
      <h1 className="text-2xl font-bold text-farm-soil-900">Tài khoản</h1>
      <p className="text-farm-soil-500 mt-2">Tính năng đang được phát triển</p>
    </div>
  );
}

function UnauthorizedPlaceholder() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-farm-soil-100 p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Không có quyền truy cập</h1>
      <p className="text-farm-soil-500 mt-2">
        Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên.
      </p>
    </div>
  );
}
