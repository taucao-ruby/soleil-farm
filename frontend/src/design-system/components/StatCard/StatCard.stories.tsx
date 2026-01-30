import type { Meta, StoryObj } from '@storybook/react';
import { 
  Sprout, 
  Droplets, 
  MapPin, 
  Package,
  Users,
  TrendingUp
} from 'lucide-react';

import { StatCard, StatCardGroup } from './StatCard';

/**
 * StatCard hiển thị số liệu thống kê với trend indicators,
 * icons, và animated numbers.
 */
const meta: Meta<typeof StatCard> = {
  title: 'Components/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Kích thước card',
    },
    interactive: {
      control: 'boolean',
      description: 'Card có thể click',
    },
    animateValue: {
      control: 'boolean',
      description: 'Animate số khi hiển thị',
    },
    loading: {
      control: 'boolean',
      description: 'Trạng thái loading',
    },
  },
  args: {
    title: 'Tổng lô đất',
    value: 24,
    size: 'md',
    interactive: false,
    animateValue: false,
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

// ===== BASIC =====

export const Default: Story = {
  args: {
    title: 'Tổng lô đất',
    value: 24,
    icon: <MapPin className="h-5 w-5" />,
  },
};

// ===== WITH TREND =====

export const WithTrendUp: Story = {
  args: {
    title: 'Sản lượng tháng này',
    value: '2,500 kg',
    trend: '+12%',
    icon: <Package className="h-5 w-5" />,
    description: 'so với tháng trước',
  },
};

export const WithTrendDown: Story = {
  args: {
    title: 'Chi phí',
    value: '15,000,000 ₫',
    trend: '-5%',
    icon: <TrendingUp className="h-5 w-5" />,
    description: 'so với tháng trước',
  },
};

// ===== WITH UNIT =====

export const WithUnit: Story = {
  args: {
    title: 'Tổng diện tích',
    value: '50,000',
    unit: 'm²',
    icon: <MapPin className="h-5 w-5" />,
  },
};

// ===== ANIMATED =====

export const Animated: Story = {
  args: {
    title: 'Tổng số cây',
    value: 12500,
    icon: <Sprout className="h-5 w-5" />,
    animateValue: true,
    trend: '+8%',
  },
};

// ===== INTERACTIVE =====

export const Interactive: Story = {
  args: {
    title: 'Chu kỳ đang hoạt động',
    value: 8,
    icon: <Sprout className="h-5 w-5" />,
    interactive: true,
    description: 'Click để xem chi tiết',
  },
};

// ===== LOADING =====

export const Loading: Story = {
  args: {
    title: 'Đang tải...',
    value: '-',
    loading: true,
  },
};

// ===== SIZES =====

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <StatCard
        title="Small"
        value={24}
        size="sm"
        icon={<MapPin className="h-4 w-4" />}
      />
      <StatCard
        title="Medium"
        value={24}
        size="md"
        icon={<MapPin className="h-5 w-5" />}
      />
      <StatCard
        title="Large"
        value={24}
        size="lg"
        icon={<MapPin className="h-5 w-5" />}
      />
    </div>
  ),
};

// ===== STAT CARD GROUP =====

export const CardGroup: Story = {
  render: () => (
    <StatCardGroup columns={4}>
      <StatCard
        title="Tổng lô đất"
        value={24}
        icon={<MapPin className="h-5 w-5" />}
        trend="+2"
        description="lô mới"
      />
      <StatCard
        title="Diện tích canh tác"
        value="50,000"
        unit="m²"
        icon={<Sprout className="h-5 w-5" />}
        trend="+12%"
      />
      <StatCard
        title="Lượng nước sử dụng"
        value="1,250"
        unit="m³"
        icon={<Droplets className="h-5 w-5" />}
        trend="-8%"
        description="tiết kiệm"
      />
      <StatCard
        title="Nhân công"
        value={15}
        icon={<Users className="h-5 w-5" />}
      />
    </StatCardGroup>
  ),
};

// ===== DASHBOARD EXAMPLE =====

export const DashboardStats: Story = {
  name: 'Dashboard Stats',
  render: () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Tổng quan trang trại</h2>
      <StatCardGroup columns={4}>
        <StatCard
          title="Lô đất hoạt động"
          value={18}
          icon={<MapPin className="h-5 w-5" />}
          iconBg="bg-emerald-100"
          trend={{ value: '+3', direction: 'up', label: 'tuần này' }}
          animateValue
          interactive
        />
        <StatCard
          title="Chu kỳ canh tác"
          value={12}
          icon={<Sprout className="h-5 w-5" />}
          iconBg="bg-blue-100"
          trend={{ value: '2', direction: 'neutral', label: 'đang thu hoạch' }}
          animateValue
          interactive
        />
        <StatCard
          title="Sản lượng tháng"
          value="3,250"
          unit="kg"
          icon={<Package className="h-5 w-5" />}
          iconBg="bg-amber-100"
          trend={{ value: '+15%', direction: 'up' }}
          animateValue
          interactive
        />
        <StatCard
          title="Hiệu suất tưới"
          value={92}
          unit="%"
          icon={<Droplets className="h-5 w-5" />}
          iconBg="bg-sky-100"
          trend={{ value: '+5%', direction: 'up' }}
          animateValue
          interactive
        />
      </StatCardGroup>
    </div>
  ),
};

// ===== WITH ACTION =====

export const WithAction: Story = {
  args: {
    title: 'Hoạt động hôm nay',
    value: 5,
    icon: <Sprout className="h-5 w-5" />,
    description: 'cần thực hiện',
    action: (
      <button className="text-sm font-medium text-primary hover:underline">
        Xem tất cả →
      </button>
    ),
  },
};

// ===== RESPONSIVE =====

export const Responsive: Story = {
  render: () => (
    <StatCardGroup columns={2}>
      <StatCard
        title="Thu nhập tháng"
        value="45,000,000"
        unit="₫"
        trend="+18%"
        description="so với tháng trước"
        animateValue
      />
      <StatCard
        title="Chi phí tháng"
        value="15,000,000"
        unit="₫"
        trend="-5%"
        description="tiết kiệm được"
        animateValue
      />
    </StatCardGroup>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};
