/**
 * Soleil Farm Design System - Farm Icons
 * ======================================
 * Custom SVG icons specific to farm management.
 * Designed to complement lucide-react icons.
 */

import * as React from 'react';

// ===== ICON PROPS =====
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// ===== BASE ICON WRAPPER =====
const createIcon = (
  path: React.ReactNode,
  displayName: string,
  viewBox: string = '0 0 24 24'
) => {
  const Icon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ size = 24, className, ...props }, ref) => (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {path}
      </svg>
    )
  );
  Icon.displayName = displayName;
  return Icon;
};

// ===== FERTILIZER ICON =====
export const FertilizerIcon = createIcon(
  <>
    <path d="M12 2v6" />
    <path d="M12 22v-4" />
    <circle cx="12" cy="12" r="4" />
    <path d="M4.93 4.93l4.24 4.24" />
    <path d="M14.83 14.83l4.24 4.24" />
    <path d="M2 12h6" />
    <path d="M16 12h6" />
    <path d="M4.93 19.07l4.24-4.24" />
    <path d="M14.83 9.17l4.24-4.24" />
  </>,
  'FertilizerIcon'
);

// ===== HARVEST ICON =====
export const HarvestIcon = createIcon(
  <>
    <path d="M12 2a10 10 0 0 1 7.07 2.93" />
    <path d="M12 2a10 10 0 0 0-7.07 2.93" />
    <path d="M12 2v8" />
    <path d="M6 10c0 3.31 2.69 6 6 6s6-2.69 6-6" />
    <path d="M4 18h16" />
    <path d="M6 22h12" />
    <path d="M8 18v4" />
    <path d="M16 18v4" />
  </>,
  'HarvestIcon'
);

// ===== LAND PARCEL ICON =====
export const LandParcelIcon = createIcon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </>,
  'LandParcelIcon'
);

// ===== SOIL ICON =====
export const SoilIcon = createIcon(
  <>
    <path d="M2 22h20" />
    <path d="M2 18c3-3 7-3 10 0s7 3 10 0" />
    <path d="M2 14c3-3 7-3 10 0s7 3 10 0" />
    <path d="M12 2v4" />
    <path d="M8 4l4 2 4-2" />
  </>,
  'SoilIcon'
);

// ===== SEEDLING ICON =====
export const SeedlingIcon = createIcon(
  <>
    <path d="M12 22V10" />
    <path d="M12 10c-3 0-6-3-6-6 3 0 6 3 6 6" />
    <path d="M12 10c3 0 6-3 6-6-3 0-6 3-6 6" />
    <path d="M6 22h12" />
  </>,
  'SeedlingIcon'
);

// ===== IRRIGATION ICON =====
export const IrrigationIcon = createIcon(
  <>
    <path d="M12 2v4" />
    <path d="M8 8l4-2 4 2" />
    <circle cx="12" cy="14" r="4" />
    <path d="M12 18v4" />
    <path d="M4 14h2" />
    <path d="M18 14h2" />
    <path d="M6.34 8.34l1.42 1.42" />
    <path d="M16.24 9.76l1.42-1.42" />
  </>,
  'IrrigationIcon'
);

// ===== PEST CONTROL ICON =====
export const PestControlIcon = createIcon(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M12 12v6" />
    <path d="M8 18h8" />
    <path d="M7 4l2 2" />
    <path d="M17 4l-2 2" />
    <path d="M4 10h2" />
    <path d="M18 10h2" />
    <path d="M6 22h4v-4" />
    <path d="M14 18v4h4" />
  </>,
  'PestControlIcon'
);

// ===== WEATHER ICON =====
export const WeatherIcon = createIcon(
  <>
    <circle cx="12" cy="6" r="4" />
    <path d="M12 10v2" />
    <path d="M8.5 7.5l-1.5-1.5" />
    <path d="M15.5 7.5l1.5-1.5" />
    <path d="M6 6H4" />
    <path d="M20 6h-2" />
    <path d="M17 17c0-2.21-1.79-4-4-4H9c-2.21 0-4 1.79-4 4v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1z" />
  </>,
  'WeatherIcon'
);

// ===== CROP CYCLE ICON =====
export const CropCycleIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
    <path d="M8 12a4 4 0 0 1 8 0" />
    <path d="M12 16v2" />
  </>,
  'CropCycleIcon'
);

// ===== YIELD ICON =====
export const YieldIcon = createIcon(
  <>
    <path d="M12 2v4" />
    <path d="M4 10h16" />
    <path d="M4 10l2 10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l2-10" />
    <circle cx="8" cy="14" r="1" fill="currentColor" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
    <circle cx="16" cy="14" r="1" fill="currentColor" />
    <circle cx="10" cy="12" r="1" fill="currentColor" />
    <circle cx="14" cy="12" r="1" fill="currentColor" />
  </>,
  'YieldIcon'
);

// ===== GREENHOUSE ICON =====
export const GreenhouseIcon = createIcon(
  <>
    <path d="M3 22h18" />
    <path d="M5 22V10" />
    <path d="M19 22V10" />
    <path d="M5 10l7-8 7 8" />
    <path d="M9 22V14h6v8" />
    <path d="M3 10h18" />
  </>,
  'GreenhouseIcon'
);

// ===== FARM WORKER ICON =====
export const FarmWorkerIcon = createIcon(
  <>
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v6" />
    <path d="M8 10l-3 4v8h14v-8l-3-4" />
    <path d="M12 14l-4 8" />
    <path d="M12 14l4 8" />
  </>,
  'FarmWorkerIcon'
);

// ===== WATER SOURCE ICON =====
export const WaterSourceIcon = createIcon(
  <>
    <path d="M12 2c-4 4-7 7-7 11a7 7 0 0 0 14 0c0-4-3-7-7-11z" />
    <path d="M12 18a3 3 0 0 0 3-3c0-2-3-4-3-4s-3 2-3 4a3 3 0 0 0 3 3z" />
  </>,
  'WaterSourceIcon'
);

// ===== PLOWING ICON =====
export const PlowingIcon = createIcon(
  <>
    <path d="M2 22h20" />
    <path d="M2 18h20" />
    <path d="M4 22v-4l8-8 8 8v4" />
    <path d="M12 6V2" />
    <path d="M10 4h4" />
  </>,
  'PlowingIcon'
);

// ===== SOWING ICON =====
export const SowingIcon = createIcon(
  <>
    <path d="M12 22v-8" />
    <circle cx="12" cy="10" r="2" />
    <path d="M12 8V2" />
    <path d="M8 6l4 2 4-2" />
    <path d="M6 22c0-3 2-4 6-4s6 1 6 4" />
    <circle cx="8" cy="18" r="1" fill="currentColor" />
    <circle cx="16" cy="18" r="1" fill="currentColor" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </>,
  'SowingIcon'
);

// ===== WEEDING ICON =====
export const WeedingIcon = createIcon(
  <>
    <path d="M12 22v-6" />
    <path d="M9 16l3 2 3-2" />
    <path d="M12 10V6" />
    <path d="M8 8c0-2 1.5-3 4-4 2.5 1 4 2 4 4" />
    <path d="M4 12c0-4 3-6 8-8 5 2 8 4 8 8" />
    <path d="M4 22h16" />
    <line x1="7" y1="22" x2="7" y2="18" />
    <line x1="17" y1="22" x2="17" y2="18" />
  </>,
  'WeedingIcon'
);

// ===== SEASON ICON =====
export const SeasonIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" fillOpacity="0.2" stroke="none" />
    <path d="M12 6v6l4 4" />
  </>,
  'SeasonIcon'
);

// ===== ACTIVITY LOG ICON =====
export const ActivityLogIcon = createIcon(
  <>
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="M6 8h12" />
    <path d="M6 12h8" />
    <path d="M6 16h6" />
    <circle cx="18" cy="14" r="2" />
    <path d="M18 16v2" />
  </>,
  'ActivityLogIcon'
);

// ===== ALL FARM ICONS =====
export const FarmIcons = {
  Fertilizer: FertilizerIcon,
  Harvest: HarvestIcon,
  LandParcel: LandParcelIcon,
  Soil: SoilIcon,
  Seedling: SeedlingIcon,
  Irrigation: IrrigationIcon,
  PestControl: PestControlIcon,
  Weather: WeatherIcon,
  CropCycle: CropCycleIcon,
  Yield: YieldIcon,
  Greenhouse: GreenhouseIcon,
  FarmWorker: FarmWorkerIcon,
  WaterSource: WaterSourceIcon,
  Plowing: PlowingIcon,
  Sowing: SowingIcon,
  Weeding: WeedingIcon,
  Season: SeasonIcon,
  ActivityLog: ActivityLogIcon,
} as const;

export default FarmIcons;
