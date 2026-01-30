import type { Meta, StoryObj } from '@storybook/react';
import { Search, Mail, Eye, EyeOff, Calendar } from 'lucide-react';
import * as React from 'react';

import { Input, SearchInput, NumberInput } from './Input';

/**
 * Input component với nhiều variants, icons, và addons.
 * Hỗ trợ error states, clearable, và number input.
 */
const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    inputSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Kích thước input',
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'flushed'],
      description: 'Kiểu hiển thị',
    },
    hasError: {
      control: 'boolean',
      description: 'Trạng thái lỗi',
    },
    hasSuccess: {
      control: 'boolean',
      description: 'Trạng thái thành công',
    },
    disabled: {
      control: 'boolean',
      description: 'Vô hiệu hóa input',
    },
    clearable: {
      control: 'boolean',
      description: 'Hiển thị nút xóa',
    },
  },
  args: {
    placeholder: 'Nhập nội dung...',
    inputSize: 'md',
    variant: 'default',
    hasError: false,
    hasSuccess: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ===== BASIC =====

export const Default: Story = {
  args: {
    placeholder: 'Nhập tên lô đất',
  },
};

// ===== SIZES =====

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input inputSize="sm" placeholder="Small input" />
      <Input inputSize="md" placeholder="Medium input" />
      <Input inputSize="lg" placeholder="Large input" />
    </div>
  ),
};

// ===== VARIANTS =====

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input variant="default" placeholder="Default variant" />
      <Input variant="filled" placeholder="Filled variant" />
      <Input variant="flushed" placeholder="Flushed variant" />
    </div>
  ),
};

// ===== WITH LEFT ICON =====

export const WithLeftIcon: Story = {
  args: {
    leftIcon: <Search className="h-4 w-4" />,
    placeholder: 'Tìm kiếm...',
  },
};

// ===== WITH RIGHT ICON =====

export const WithRightIcon: Story = {
  args: {
    rightIcon: <Calendar className="h-4 w-4" />,
    placeholder: 'Chọn ngày',
  },
};

// ===== WITH ADDONS =====

export const WithLeftAddon: Story = {
  args: {
    leftAddon: 'https://',
    placeholder: 'example.com',
  },
};

export const WithRightAddon: Story = {
  args: {
    rightAddon: 'm²',
    placeholder: 'Nhập diện tích',
    type: 'number',
  },
};

export const WithBothAddons: Story = {
  args: {
    leftAddon: '₫',
    rightAddon: '.000',
    placeholder: 'Nhập giá',
    type: 'number',
  },
};

// ===== CLEARABLE =====

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = React.useState('Cà chua');
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        clearable
        onClear={() => setValue('')}
        placeholder="Nhập tên cây trồng"
      />
    );
  },
};

// ===== STATES =====

export const ErrorState: Story = {
  args: {
    hasError: true,
    placeholder: 'Tên không hợp lệ',
    defaultValue: 'abc123!@#',
  },
};

export const SuccessState: Story = {
  args: {
    hasSuccess: true,
    defaultValue: 'Lô đất A1-01',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Không thể chỉnh sửa',
  },
};

// ===== PASSWORD INPUT =====

export const PasswordInput: Story = {
  render: () => {
    const [show, setShow] = React.useState(false);
    return (
      <Input
        type={show ? 'text' : 'password'}
        placeholder="Nhập mật khẩu"
        rightIcon={
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="focus:outline-none"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />
    );
  },
};

// ===== SEARCH INPUT =====

export const SearchInputStory: Story = {
  name: 'Search Input',
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <SearchInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue('')}
        placeholder="Tìm kiếm lô đất, cây trồng..."
      />
    );
  },
};

export const SearchInputLoading: Story = {
  name: 'Search Input Loading',
  render: () => (
    <SearchInput
      loading
      defaultValue="Đang tìm kiếm..."
      placeholder="Tìm kiếm..."
    />
  ),
};

// ===== NUMBER INPUT =====

export const NumberInputStory: Story = {
  name: 'Number Input',
  render: () => {
    const [value, setValue] = React.useState(100);
    return (
      <NumberInput
        value={value}
        onValueChange={setValue}
        min={0}
        max={1000}
        step={10}
        rightAddon="m²"
      />
    );
  },
};

export const NumberInputWithStepper: Story = {
  name: 'Number Input with Stepper',
  render: () => {
    const [value, setValue] = React.useState(5);
    return (
      <div className="w-48">
        <NumberInput
          value={value}
          onValueChange={setValue}
          min={1}
          max={100}
          step={1}
          showStepper
        />
      </div>
    );
  },
};

// ===== REAL WORLD EXAMPLES =====

export const FormInputs: Story = {
  name: 'Form Inputs',
  render: () => (
    <div className="w-96 space-y-4 rounded-lg border border-border p-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="email@example.com"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Diện tích</label>
        <Input
          type="number"
          rightAddon="m²"
          placeholder="500"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Website</label>
        <Input
          leftAddon="https://"
          placeholder="farm.example.com"
        />
      </div>
    </div>
  ),
};
