import ColorInput from './index.svelte';

export default {
  title: 'Components/ColorInput',
  component: ColorInput,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'color', description: '#RRGGBB' },
    opacity: { control: 'number', description: '0–100; null hides the opacity cell' },
    variable: { control: 'text', description: 'Bound variable name, shown instead of the hex' },
    pickable: { control: 'boolean', description: 'Chit opens the system color picker' },
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
