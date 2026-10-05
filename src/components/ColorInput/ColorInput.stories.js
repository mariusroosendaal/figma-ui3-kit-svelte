import ColorInput from './index.svelte';

export default {
  title: 'Components/ColorInput',
  component: ColorInput,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'color', description: '#RRGGBB' },
    opacity: { control: 'number', description: '0–100; null hides the opacity cell' },
    variable: { control: 'text', description: 'Bound variable name, shown instead of the hex' },
    pickable: { control: 'boolean', description: 'Chit opens a color picker' },
    picker: { control: 'select', options: ['system', 'panel'] },
    swatches: { control: 'object', description: 'The panel picker\'s swatches' },
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    class: { table: { disable: true } },
  },
};

export const Fill = { args: { value: '#FF24BD', opacity: 100 } };
export const Translucent = { args: { value: '#FF24BD', opacity: 24 } };
export const HexOnly = { args: { value: '#0D99FF', opacity: null } };
export const Variable = { args: { value: '#FF24BD', variable: 'bg-assistive' } };
export const Disabled = { args: { value: '#FF24BD', opacity: 100, disabled: true } };

// The chit opens the kit's ColorPicker instead of the system picker
export const Panel = {
  args: {
    value: '#FF24BD',
    opacity: 100,
    picker: 'panel',
    swatches: ['#FFFFFF', '#000000', '#0D99FF', '#FF24BD', { color: '#000000', opacity: 15 }],
  },
};
