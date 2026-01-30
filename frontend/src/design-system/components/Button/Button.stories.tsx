import type { Meta, StoryObj } from '@storybook/react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Settings, 
  ChevronRight,
  Loader2 
} from 'lucide-react';

import { Button, ButtonGroup } from './Button';

/**
 * Button component với nhiều variants, sizes, và states.
 * Hỗ trợ icons, loading state, và animations.
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'ghost', 'outline', 'link', 'success', 'warning'],
      description: 'Visual style của button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'icon', 'icon-sm', 'icon-lg'],
      description: 'Kích thước button',
    },
    loading: {
      control: 'boolean',
      description: 'Hiển thị trạng thái loading',
    },
    disabled: {
      control: 'boolean',
      description: 'Vô hiệu hóa button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Button chiếm toàn bộ width',
    },
    animated: {
      control: 'boolean',
      description: 'Bật/tắt animation',
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
    animated: true,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ===== BASIC STORIES =====

export const Default: Story = {
  args: {
    children: 'Tạo mới',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Tạo mới',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Hủy',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Xóa',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Chi tiết',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Xem thêm',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Đọc thêm',
  },
};

// ===== SIZE VARIANTS =====

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

// ===== WITH ICONS =====

export const WithLeftIcon: Story = {
  args: {
    leftIcon: <Plus className="h-4 w-4" />,
    children: 'Thêm lô đất',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <ChevronRight className="h-4 w-4" />,
    children: 'Tiếp theo',
  },
};

export const IconButton: Story = {
  args: {
    size: 'icon',
    children: <Settings className="h-4 w-4" />,
    'aria-label': 'Cài đặt',
  },
};

// ===== STATES =====

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Đang xử lý',
  },
};

export const LoadingWithText: Story = {
  args: {
    loading: true,
    loadingText: 'Đang lưu...',
    children: 'Lưu',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Không khả dụng',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Đăng nhập',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

// ===== ALL VARIANTS =====

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
      </div>
    </div>
  ),
};

// ===== BUTTON GROUP =====

export const Group: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary">Hủy</Button>
      <Button variant="primary">Lưu</Button>
    </ButtonGroup>
  ),
};

export const GroupAttached: Story = {
  render: () => (
    <ButtonGroup attached>
      <Button variant="outline">Ngày</Button>
      <Button variant="outline">Tuần</Button>
      <Button variant="outline">Tháng</Button>
    </ButtonGroup>
  ),
};

// ===== REAL WORLD EXAMPLES =====

export const FormActions: Story = {
  name: 'Form Actions',
  render: () => (
    <div className="flex justify-end gap-3 rounded-lg border border-border bg-muted/50 p-4">
      <Button variant="ghost">Hủy bỏ</Button>
      <Button variant="secondary">Lưu nháp</Button>
      <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
        Tạo lô đất
      </Button>
    </div>
  ),
};

export const DangerZone: Story = {
  name: 'Danger Zone',
  render: () => (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
      <h3 className="text-lg font-semibold text-destructive">Xóa lô đất</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
      </p>
      <div className="mt-4">
        <Button variant="destructive" leftIcon={<Trash2 className="h-4 w-4" />}>
          Xóa vĩnh viễn
        </Button>
      </div>
    </div>
  ),
};

export const ExportActions: Story = {
  name: 'Export Actions',
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
        Xuất Excel
      </Button>
      <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
        Xuất PDF
      </Button>
    </div>
  ),
};
