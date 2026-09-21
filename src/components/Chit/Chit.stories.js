import Chit from './index.svelte';

export default {
  title: 'Components/Chit',
  component: Chit,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'text',
      description:
        'Any CSS color or gradient, or an array of colors drawn as slices (a variable’s modes)',
    },
    opacity: { control: { type: 'range', min: 0, max: 100 }, description: '0–100' },
    image: { control: 'text', description: 'Image URL, for image fills' },
    shape: { control: 'select', options: ['square', 'circle'] },
    ariaLabel: { control: 'text', description: 'Set when the color is information' },
    class: { table: { disable: true } },
  },
};

export const Fill = { args: { color: '#FF24BD' } };
export const Opacity = { args: { color: '#FF24BD', opacity: 24 } };
export const TranslucentHex = { args: { color: '#0D99FF66' } };
export const Gradient = { args: { color: 'linear-gradient(135deg, #ff7262, #ffc700)' } };
export const Circle = { args: { color: '#FF24BD', shape: 'circle' } };
export const Modes = { args: { color: ['#e8e7e5', '#212020'] } };
export const Empty = { args: { color: null } };
