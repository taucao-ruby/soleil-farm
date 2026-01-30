import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import FarmIcons, {
  FertilizerIcon,
  HarvestIcon,
  LandParcelIcon,
  SoilIcon,
  SeedlingIcon,
  IrrigationIcon,
  PestControlIcon,
  WeatherIcon,
  CropCycleIcon,
  YieldIcon,
  GreenhouseIcon,
  FarmWorkerIcon,
  WaterSourceIcon,
  PlowingIcon,
  SowingIcon,
  WeedingIcon,
  SeasonIcon,
  ActivityLogIcon,
} from './FarmIcons';

/**
 * Custom SVG icons cho Soleil Farm.
 * Thiết kế để phù hợp với lucide-react icons.
 */
const meta: Meta = {
  title: 'Design System/Icons',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'range', min: 16, max: 64, step: 4 },
      description: 'Kích thước icon',
    },
    color: {
      control: 'color',
      description: 'Màu icon',
    },
    strokeWidth: {
      control: { type: 'range', min: 1, max: 3, step: 0.5 },
      description: 'Độ dày nét',
    },
  },
  args: {
    size: 24,
    color: 'currentColor',
    strokeWidth: 2,
  },
};

export default meta;

// ===== ICON GRID =====

export const AllIcons: Meta = {
  render: () => (
    <div className="grid grid-cols-6 gap-6">
      {Object.entries(FarmIcons).map(([name, Icon]) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 hover:bg-muted/50"
        >
          <Icon size={24} className="text-foreground" />
          <span className="text-xs text-muted-foreground">{name}</span>
        </div>
      ))}
    </div>
  ),
};

// ===== INDIVIDUAL ICONS =====

export const Fertilizer: Meta = {
  render: (args) => <FertilizerIcon {...args} />,
};

export const Harvest: Meta = {
  render: (args) => <HarvestIcon {...args} />,
};

export const LandParcel: Meta = {
  render: (args) => <LandParcelIcon {...args} />,
};

export const Soil: Meta = {
  render: (args) => <SoilIcon {...args} />,
};

export const Seedling: Meta = {
  render: (args) => <SeedlingIcon {...args} />,
};

export const Irrigation: Meta = {
  render: (args) => <IrrigationIcon {...args} />,
};

export const PestControl: Meta = {
  render: (args) => <PestControlIcon {...args} />,
};

export const Weather: Meta = {
  render: (args) => <WeatherIcon {...args} />,
};

export const CropCycle: Meta = {
  render: (args) => <CropCycleIcon {...args} />,
};

export const Yield: Meta = {
  render: (args) => <YieldIcon {...args} />,
};

export const Greenhouse: Meta = {
  render: (args) => <GreenhouseIcon {...args} />,
};

export const FarmWorker: Meta = {
  render: (args) => <FarmWorkerIcon {...args} />,
};

export const WaterSource: Meta = {
  render: (args) => <WaterSourceIcon {...args} />,
};

export const Plowing: Meta = {
  render: (args) => <PlowingIcon {...args} />,
};

export const Sowing: Meta = {
  render: (args) => <SowingIcon {...args} />,
};

export const Weeding: Meta = {
  render: (args) => <WeedingIcon {...args} />,
};

export const Season: Meta = {
  render: (args) => <SeasonIcon {...args} />,
};

export const ActivityLog: Meta = {
  render: (args) => <ActivityLogIcon {...args} />,
};

// ===== SIZES =====

export const Sizes: Meta = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <SeedlingIcon size={16} />
        <span className="text-xs text-muted-foreground">16px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SeedlingIcon size={20} />
        <span className="text-xs text-muted-foreground">20px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SeedlingIcon size={24} />
        <span className="text-xs text-muted-foreground">24px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SeedlingIcon size={32} />
        <span className="text-xs text-muted-foreground">32px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SeedlingIcon size={48} />
        <span className="text-xs text-muted-foreground">48px</span>
      </div>
    </div>
  ),
};

// ===== COLORS =====

export const Colors: Meta = {
  render: () => (
    <div className="flex gap-4">
      <HarvestIcon size={32} className="text-primary" />
      <HarvestIcon size={32} className="text-farm-harvest" />
      <HarvestIcon size={32} className="text-farm-water" />
      <HarvestIcon size={32} className="text-farm-soil" />
      <HarvestIcon size={32} className="text-muted-foreground" />
    </div>
  ),
};

// ===== IN CONTEXT =====

export const InButtonContext: Meta = {
  render: () => (
    <div className="flex gap-2">
      <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <SeedlingIcon size={16} />
        Tạo chu kỳ mới
      </button>
      <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
        <IrrigationIcon size={16} />
        Ghi nhận tưới nước
      </button>
    </div>
  ),
};

export const InNavigationContext: Meta = {
  render: () => (
    <nav className="w-64 rounded-lg border border-border bg-card">
      <ul className="space-y-1 p-2">
        {[
          { icon: LandParcelIcon, label: 'Lô đất', active: false },
          { icon: CropCycleIcon, label: 'Chu kỳ canh tác', active: true },
          { icon: ActivityLogIcon, label: 'Hoạt động', active: false },
          { icon: WaterSourceIcon, label: 'Nguồn nước', active: false },
          { icon: WeatherIcon, label: 'Thời tiết', active: false },
        ].map(({ icon: Icon, label, active }) => (
          <li key={label}>
            <a
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                active
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon size={18} />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  ),
};

export const InCardContext: Meta = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {[
        { icon: SeedlingIcon, label: 'Gieo hạt', color: 'bg-emerald-100 text-emerald-600' },
        { icon: IrrigationIcon, label: 'Tưới nước', color: 'bg-blue-100 text-blue-600' },
        { icon: FertilizerIcon, label: 'Bón phân', color: 'bg-amber-100 text-amber-600' },
        { icon: PestControlIcon, label: 'Phun thuốc', color: 'bg-red-100 text-red-600' },
        { icon: WeedingIcon, label: 'Làm cỏ', color: 'bg-lime-100 text-lime-600' },
        { icon: HarvestIcon, label: 'Thu hoạch', color: 'bg-orange-100 text-orange-600' },
      ].map(({ icon: Icon, label, color }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 hover:shadow-md cursor-pointer transition-shadow"
        >
          <div className={`rounded-full p-3 ${color}`}>
            <Icon size={24} />
          </div>
          <span className="text-sm font-medium">{label}</span>
        </div>
      ))}
    </div>
  ),
};
