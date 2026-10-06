import ColorPicker from './index.svelte';

// The swatches from Figma's own picker, in a file's "On this page" set
const page = [
  '#FFFFFF',
  '#000000',
  '#FF5757',
  '#D9D9D9',
  '#76FF57',
  '#6B83FF',
  '#8A38F5',
  '#222222',
  { color: '#000000', opacity: 15 },
];

export default {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'color', description: '#RRGGBB' },
    opacity: { control: 'number', description: '0–100; null leaves out the opacity controls' },
    format: { control: 'select', options: ['hex', 'rgb', 'css', 'hsl', 'hsb'] },
    swatches: { control: 'object', description: 'Colors, or `{ label, colors }` groups' },
    inline: { control: 'boolean', description: 'Drawn in the flow instead of floating' },
    position: { table: { disable: true } },
    isOpen: { table: { disable: true } },
    anchorElement: { table: { disable: true } },
    class: { table: { disable: true } },
  },
  args: { inline: true },
};

export const Default = {
  args: {
    value: '#222222',
    opacity: 100,
    swatches: [
      { label: 'On this page', colors: page },
      { label: 'Brand', colors: ['#0D99FF', '#FF24BD', '#FFC700', '#14AE5C'] },
    ],
  },
};

export const NoSwatches = { args: { value: '#0D99FF', opacity: 100 } };

export const Translucent = { args: { value: '#FF24BD', opacity: 40, swatches: page } };

export const HSL = { args: { value: '#F5F5F5', opacity: 100, format: 'hsl', swatches: page } };

export const WithoutOpacity = { args: { value: '#8A38F5', opacity: null } };
