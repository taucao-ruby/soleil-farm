import type { Meta, StoryObj } from '@storybook/react';
import { colors, status, getStatusColor, gradients } from '../tokens/colors';

// Color Swatch Component
const ColorSwatch = ({ 
  name, 
  color, 
  className = '' 
}: { 
  name: string; 
  color: string; 
  className?: string;
}) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div
      className="w-16 h-16 rounded-lg shadow-md border border-gray-200"
      style={{ backgroundColor: color }}
    />
    <span className="mt-2 text-xs font-medium text-gray-700">{name}</span>
    <span className="text-xs text-gray-500 font-mono">{color}</span>
  </div>
);

// Color Scale Component
const ColorScale = ({ 
  name, 
  scale 
}: { 
  name: string; 
  scale: Record<string, string>; 
}) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{name}</h3>
    <div className="flex flex-wrap gap-4">
      {Object.entries(scale).map(([shade, color]) => (
        <ColorSwatch key={shade} name={shade} color={color} />
      ))}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Design System/Tokens/Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Color Palette

Soleil Farm's color system is inspired by agriculture and nature:

- **Primary (Green)**: Growth, freshness, crops
- **Earth (Amber/Brown)**: Soil, harvest, warmth
- **Water (Blue)**: Irrigation, water sources
- **Sun (Yellow)**: Energy, sunlight, prosperity
- **Neutral (Slate)**: Text, backgrounds, borders
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Primary Colors
export const Primary: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Primary - Farm Green</h2>
        <p className="text-gray-600 mb-4">
          Màu chính của Soleil Farm, biểu tượng cho sự sinh trưởng và mùa màng bội thu.
        </p>
        <ColorScale name="" scale={colors.primary} />
      </div>
    </div>
  ),
};

// All Color Palettes
export const AllPalettes: Story = {
  name: 'Complete Palette',
  render: () => (
    <div className="space-y-12">
      <ColorScale name="Primary (Farm Green)" scale={colors.primary} />
      <ColorScale name="Earth (Amber)" scale={colors.earth} />
      <ColorScale name="Soil (Brown)" scale={colors.soil} />
      <ColorScale name="Water (Blue)" scale={colors.water} />
      <ColorScale name="Sun (Yellow)" scale={colors.sun} />
      <ColorScale name="Neutral (Slate)" scale={colors.neutral} />
    </div>
  ),
};

// Status Colors
export const StatusColors: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Status Colors</h2>
        <p className="text-gray-600 mb-4">
          Màu sắc dùng để thể hiện trạng thái các entity trong hệ thống.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Land Parcel Status</h3>
        <div className="flex flex-wrap gap-4">
          <ColorSwatch name="Available" color={status.available} />
          <ColorSwatch name="In Use" color={status.in_use} />
          <ColorSwatch name="Resting" color={status.resting} />
          <ColorSwatch name="Maintenance" color={status.maintenance} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop Cycle Status</h3>
        <div className="flex flex-wrap gap-4">
          <ColorSwatch name="Planned" color={status.planned} />
          <ColorSwatch name="Active" color={status.active} />
          <ColorSwatch name="Harvesting" color={status.harvesting} />
          <ColorSwatch name="Completed" color={status.completed} />
          <ColorSwatch name="Failed" color={status.failed} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Status</h3>
        <div className="flex flex-wrap gap-4">
          <ColorSwatch name="Pending" color={status.pending} />
          <ColorSwatch name="In Progress" color={status.in_progress} />
          <ColorSwatch name="Done" color={status.done} />
          <ColorSwatch name="Cancelled" color={status.cancelled} />
        </div>
      </div>
    </div>
  ),
};

// Semantic Colors
export const SemanticColors: Story = {
  render: () => (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Semantic Colors</h2>
      <p className="text-gray-600 mb-4">
        Màu sắc ngữ nghĩa dùng cho feedback và notifications.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Success</h4>
          <ColorScale name="" scale={colors.success} />
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Warning</h4>
          <ColorScale name="" scale={colors.warning} />
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Error</h4>
          <ColorScale name="" scale={colors.error} />
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Info</h4>
          <ColorScale name="" scale={colors.info} />
        </div>
      </div>
    </div>
  ),
};

// Gradients
export const Gradients: Story = {
  render: () => (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Gradients</h2>
      <p className="text-gray-600 mb-4">
        Gradients dùng cho backgrounds và accent elements.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(gradients).map(([name, gradient]) => (
          <div key={name} className="flex flex-col">
            <div
              className="h-24 rounded-lg shadow-md"
              style={{ background: gradient }}
            />
            <span className="mt-2 text-sm font-medium text-gray-700 capitalize">
              {name.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

// Color Usage Guide
export const UsageGuide: Story = {
  name: 'Usage Guide',
  render: () => (
    <div className="space-y-8 max-w-3xl">
      <h2 className="text-xl font-bold text-gray-900">Hướng dẫn sử dụng màu sắc</h2>

      <div className="prose prose-slate">
        <h3>Import colors</h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { colors, status, getStatusColor } from '@/design-system/tokens';

// Sử dụng màu cụ thể
const primaryColor = colors.primary[500]; // #10b981

// Lấy màu theo status
const statusColor = getStatusColor('active'); // #10b981

// Trong Tailwind classes
<div className="bg-primary-500 text-white">...</div>`}
        </pre>

        <h3>Color Meaning</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Color</th>
              <th>Meaning</th>
              <th>Use Cases</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="inline-block w-4 h-4 rounded bg-green-500" /> Primary</td>
              <td>Growth, Success</td>
              <td>CTAs, Active states, Success messages</td>
            </tr>
            <tr>
              <td><span className="inline-block w-4 h-4 rounded bg-amber-500" /> Earth</td>
              <td>Harvest, Warmth</td>
              <td>Warnings, Highlights, Categories</td>
            </tr>
            <tr>
              <td><span className="inline-block w-4 h-4 rounded bg-blue-500" /> Water</td>
              <td>Irrigation, Info</td>
              <td>Links, Info badges, Water-related features</td>
            </tr>
            <tr>
              <td><span className="inline-block w-4 h-4 rounded bg-red-500" /> Error</td>
              <td>Danger, Error</td>
              <td>Error states, Destructive actions</td>
            </tr>
          </tbody>
        </table>

        <h3>Accessibility</h3>
        <p>
          Tất cả color combinations trong design system đều đạt WCAG 2.1 AA contrast ratio:
        </p>
        <ul>
          <li>Text trên nền: Tối thiểu 4.5:1</li>
          <li>Large text: Tối thiểu 3:1</li>
          <li>UI components: Tối thiểu 3:1</li>
        </ul>
      </div>
    </div>
  ),
};
