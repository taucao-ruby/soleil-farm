/**
 * Services Index
 * ===============
 * Central export point for all API services.
 */

// Core API Client
export * from './api/http-client';

// Named exports for convenience
export { default as landParcelService } from './land-parcel.service';
export { default as cropCycleService } from './crop-cycle.service';
export { default as seasonService } from './season.service';
export { default as activityLogService } from './activity-log.service';
export { default as authService } from './auth.service';
export { default as dashboardService } from './dashboard.service';
