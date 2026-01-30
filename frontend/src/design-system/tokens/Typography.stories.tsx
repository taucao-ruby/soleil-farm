import type { Meta, StoryObj } from '@storybook/react';
import { typography, textStyles, vietnameseTypography } from '../tokens/typography';

// Text Sample Component
const TextSample = ({
  label,
  style,
  sample = 'Soleil Farm - Quản lý trang trại thông minh',
}: {
  label: string;
  style: { fontSize: string; lineHeight: string; fontWeight: string | number };
  sample?: string;
}) => (
  <div className="mb-6 border-b border-gray-100 pb-6">
    <div className="flex items-baseline gap-4 mb-2">
      <span className="text-sm font-medium text-gray-500 w-32">{label}</span>
      <span className="text-xs text-gray-400 font-mono">
        {style.fontSize} / {style.lineHeight} / {style.fontWeight}
      </span>
    </div>
    <p
      style={{
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        fontWeight: style.fontWeight as number,
      }}
      className="text-gray-900"
    >
      {sample}
    </p>
  </div>
);

const meta: Meta = {
  title: 'Design System/Tokens/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Typography System

Soleil Farm sử dụng hệ thống typography được tối ưu cho tiếng Việt:

- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace)
- **Base Size**: 16px
- **Line Heights**: Được điều chỉnh cho dấu tiếng Việt
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Font Families
export const FontFamilies: Story = {
  render: () => (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Font Families</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Sans-serif (Primary)</h3>
          <p
            className="text-2xl text-gray-900"
            style={{ fontFamily: typography.fontFamily.sans.join(', ') }}
          >
            Inter - Nông nghiệp thông minh, mùa màng bội thu
          </p>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            {typography.fontFamily.sans.join(', ')}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Monospace (Code)</h3>
          <p
            className="text-2xl text-gray-900"
            style={{ fontFamily: typography.fontFamily.mono.join(', ') }}
          >
            JetBrains Mono - const farm = new SoleilFarm();
          </p>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            {typography.fontFamily.mono.join(', ')}
          </p>
        </div>
      </div>
    </div>
  ),
};

// Font Sizes
export const FontSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Font Sizes</h2>

      <div className="space-y-4">
        {Object.entries(typography.fontSize).map(([name, [size, { lineHeight }]]) => (
          <div key={name} className="flex items-baseline gap-4 py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-500 w-20">{name}</span>
            <span className="text-xs text-gray-400 font-mono w-32">
              {size} / {lineHeight}
            </span>
            <span
              style={{ fontSize: size, lineHeight }}
              className="text-gray-900"
            >
              Quản lý trang trại Soleil
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

// Font Weights
export const FontWeights: Story = {
  render: () => (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Font Weights</h2>

      <div className="space-y-4">
        {Object.entries(typography.fontWeight).map(([name, weight]) => (
          <div key={name} className="flex items-center gap-4 py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-500 w-24">{name}</span>
            <span className="text-xs text-gray-400 font-mono w-16">{weight}</span>
            <span
              style={{ fontWeight: weight }}
              className="text-xl text-gray-900"
            >
              Nền tảng quản lý nông trại thông minh
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

// Text Styles
export const TextStyles: Story = {
  render: () => (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Text Styles</h2>
      <p className="text-gray-600 mb-8">
        Các text style đã được định nghĩa sẵn để sử dụng trong ứng dụng.
      </p>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Headings</h3>
        {['heading-2xl', 'heading-xl', 'heading-lg', 'heading-md', 'heading-sm'].map((name) => (
          <TextSample
            key={name}
            label={name}
            style={textStyles[name as keyof typeof textStyles]}
          />
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Body</h3>
        {['body-lg', 'body-md', 'body-sm'].map((name) => (
          <TextSample
            key={name}
            label={name}
            style={textStyles[name as keyof typeof textStyles]}
            sample="Soleil Farm là nền tảng quản lý trang trại toàn diện, giúp nông dân theo dõi và tối ưu hóa hoạt động canh tác."
          />
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Labels</h3>
        {['label-lg', 'label-md', 'label-sm'].map((name) => (
          <TextSample
            key={name}
            label={name}
            style={textStyles[name as keyof typeof textStyles]}
            sample="Tên lô đất"
          />
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Caption</h3>
        <TextSample
          label="caption"
          style={textStyles.caption}
          sample="Cập nhật lần cuối: 15/11/2024"
        />
      </div>
    </div>
  ),
};

// Vietnamese Typography
export const VietnameseOptimization: Story = {
  name: 'Vietnamese Optimization',
  render: () => (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Tối ưu cho tiếng Việt</h2>

      <div className="prose prose-slate max-w-3xl">
        <p>
          Typography system được thiết kế đặc biệt để hiển thị tốt các ký tự tiếng Việt
          với dấu phụ (diacritics).
        </p>

        <h3>Line Height điều chỉnh</h3>
        <p>
          Line height được tăng nhẹ để tránh các dấu bị cắt hoặc chồng lên nhau:
        </p>
        <ul>
          <li><strong>Body text</strong>: 1.65 (thay vì 1.5 thông thường)</li>
          <li><strong>Headings</strong>: 1.35 (thay vì 1.2 thông thường)</li>
        </ul>

        <h3>Word Breaking</h3>
        <p>
          CSS được cấu hình để xử lý word breaking phù hợp với tiếng Việt:
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`vietnameseTypography.wordBreaking
// { wordBreak: 'keep-all', overflowWrap: 'break-word' }`}
        </pre>

        <h3>Letter Spacing</h3>
        <p>
          Letter spacing được điều chỉnh tối thiểu để không ảnh hưởng đến dấu:
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`vietnameseTypography.letterSpacing
// normal: '0', tight: '-0.01em', wide: '0.025em'`}
        </pre>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ví dụ với các dấu tiếng Việt</h3>
        <div className="space-y-4">
          <p className="text-2xl" style={vietnameseTypography.proseStyle}>
            Đây là ví dụ về typography tiếng Việt với đầy đủ các dấu.
          </p>
          <p className="text-lg" style={vietnameseTypography.proseStyle}>
            Các ký tự có dấu như: ă, â, đ, ê, ô, ơ, ư và các thanh điệu: à, á, ả, ã, ạ
            được hiển thị rõ ràng và không bị cắt.
          </p>
          <p className="text-base" style={vietnameseTypography.proseStyle}>
            Quản lý trang trại, theo dõi mùa vụ, ghi chép hoạt động canh tác - tất cả
            đều được hiển thị chính xác với line-height phù hợp.
          </p>
        </div>
      </div>
    </div>
  ),
};

// Usage Guide
export const UsageGuide: Story = {
  name: 'Usage Guide',
  render: () => (
    <div className="space-y-8 max-w-3xl">
      <h2 className="text-xl font-bold text-gray-900">Hướng dẫn sử dụng Typography</h2>

      <div className="prose prose-slate">
        <h3>Import typography tokens</h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { typography, textStyles } from '@/design-system/tokens';

// Sử dụng font family
<p style={{ fontFamily: typography.fontFamily.sans.join(', ') }}>
  Nội dung
</p>

// Sử dụng text style
<h1 style={textStyles['heading-xl']}>
  Tiêu đề lớn
</h1>`}
        </pre>

        <h3>Tailwind Classes</h3>
        <p>
          Các typography tokens đã được tích hợp vào Tailwind config:
        </p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`// Font sizes
<p className="text-xs">12px</p>
<p className="text-sm">14px</p>
<p className="text-base">16px</p>
<p className="text-lg">18px</p>
<p className="text-xl">20px</p>
<p className="text-2xl">24px</p>

// Font weights
<p className="font-normal">400</p>
<p className="font-medium">500</p>
<p className="font-semibold">600</p>
<p className="font-bold">700</p>`}
        </pre>

        <h3>Best Practices</h3>
        <ul>
          <li>Luôn sử dụng text styles đã định nghĩa thay vì custom values</li>
          <li>Đối với body text tiếng Việt, sử dụng line-height tối thiểu 1.6</li>
          <li>Tránh letter-spacing quá lớn với text tiếng Việt</li>
          <li>Test text với các dấu để đảm bảo không bị cắt</li>
        </ul>
      </div>
    </div>
  ),
};
