import type { Meta, StoryObj } from '@storybook/react';
import { Clock, Sprout, CheckCircle } from 'lucide-react';

import { StatusBadge, Badge } from './StatusBadge';

/**
 * StatusBadge hiển thị trạng thái với màu sắc semantic.
 * Sử dụng cho Land Parcel, Crop Cycle, Activity status.
 */
const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: [
        'available', 'in_use', 'resting', 'maintenance',
        'planned', 'active', 'harvested', 'completed', 'failed', 'cancelled',
        'pending', 'in_progress', 'done', 'skipped',
        'success', 'warning', 'error', 'info', 'default',
      ],
      description: 'Loại trạng thái',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Kích thước badge',
    },
    variant: {
      control: 'select',
      options: ['filled', 'outline', 'subtle'],
      description: 'Kiểu hiển thị',
    },
    showDot: {
      control: 'boolean',
      description: 'Hiển thị dot indicator',
    },
    animateDot: {
      control: 'boolean',
      description: 'Animate dot (pulse effect)',
    },
  },
  args: {
    status: 'available',
    size: 'md',
    showDot: true,
    animateDot: false,
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

// ===== BASIC =====

export const Default: Story = {
  args: {
    status: 'available',
  },
};

// ===== LAND PARCEL STATUS =====

export const LandParcelStatus: Story = {
  name: 'Land Parcel Status',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="available" />
      <StatusBadge status="in_use" />
      <StatusBadge status="resting" />
      <StatusBadge status="maintenance" />
    </div>
  ),
};

// ===== CROP CYCLE STATUS =====

export const CropCycleStatus: Story = {
  name: 'Crop Cycle Status',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="planned" />
      <StatusBadge status="active" />
      <StatusBadge status="harvested" />
      <StatusBadge status="completed" />
      <StatusBadge status="failed" />
      <StatusBadge status="cancelled" />
    </div>
  ),
};

// ===== ACTIVITY STATUS =====

export const ActivityStatus: Story = {
  name: 'Activity Status',
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="pending" />
      <StatusBadge status="in_progress" />
      <StatusBadge status="done" />
      <StatusBadge status="skipped" />
    </div>
  ),
};

// ===== SIZES =====

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <StatusBadge status="active" size="sm" />
      <StatusBadge status="active" size="md" />
      <StatusBadge status="active" size="lg" />
    </div>
  ),
};

// ===== VARIANTS =====

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <StatusBadge status="active" variant="filled" />
      <StatusBadge status="active" variant="outline" />
      <StatusBadge status="active" variant="subtle" />
    </div>
  ),
};

// ===== WITH CUSTOM LABEL =====

export const CustomLabel: Story = {
  args: {
    status: 'active',
    children: 'Đang canh tác',
  },
};

// ===== WITH ICON =====

export const WithIcon: Story = {
  args: {
    status: 'active',
    icon: <Sprout className="h-3 w-3" />,
    showDot: false,
  },
};

// ===== ANIMATED DOT =====

export const AnimatedDot: Story = {
  args: {
    status: 'in_progress',
    animateDot: true,
    children: 'Đang tưới nước',
  },
};

// ===== NO DOT =====

export const NoDot: Story = {
  args: {
    status: 'completed',
    showDot: false,
  },
};

// ===== GENERIC BADGE =====

export const GenericBadge: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge color="primary">Primary</Badge>
      <Badge color="secondary">Secondary</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="error">Error</Badge>
      <Badge color="info">Info</Badge>
      <Badge color="gray">Gray</Badge>
    </div>
  ),
};

// ===== REMOVABLE BADGE =====

export const RemovableBadge: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge color="primary" onRemove={() => alert('Remove clicked!')}>
        Rau xanh
      </Badge>
      <Badge color="success" onRemove={() => alert('Remove clicked!')}>
        Cà chua
      </Badge>
    </div>
  ),
};

// ===== IN CONTEXT =====

export const InTableContext: Story = {
  name: 'In Table Context',
  render: () => (
    <div className="rounded-lg border border-border">
      <table className="w-full">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Lô đất</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Diện tích</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="px-4 py-3 text-sm">A1-01</td>
            <td className="px-4 py-3 text-sm">500 m²</td>
            <td className="px-4 py-3">
              <StatusBadge status="available" size="sm" />
            </td>
          </tr>
          <tr className="border-b border-border">
            <td className="px-4 py-3 text-sm">A1-02</td>
            <td className="px-4 py-3 text-sm">750 m²</td>
            <td className="px-4 py-3">
              <StatusBadge status="in_use" size="sm" />
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm">A1-03</td>
            <td className="px-4 py-3 text-sm">600 m²</td>
            <td className="px-4 py-3">
              <StatusBadge status="maintenance" size="sm" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

export const InCardContext: Story = {
  name: 'In Card Context',
  render: () => (
    <div className="w-80 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">Lô A1-01</h3>
          <p className="text-sm text-muted-foreground">500 m² • Cà chua</p>
        </div>
        <StatusBadge status="active" size="sm" animateDot />
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Ngày 45/90</span>
      </div>
    </div>
  ),
};
