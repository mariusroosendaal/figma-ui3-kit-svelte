import NumericInput from './index.svelte';
import IconOpacity from '../../icons/24/icon.24.opacity.svg';

export default {
  title: 'Components/NumericInput',
  component: NumericInput,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    precision: { control: 'number', description: 'Decimals kept; null keeps up to 2' },
    label: { control: 'text', description: 'Letter in the lead cell; drag it to scrub' },
    unit: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    options: { control: 'object', description: 'Presets for the chevron menu' },
    ariaLabel: { control: 'text' },
    iconName: { table: { disable: true } },
    class: { table: { disable: true } },
  },
};

export const Default = { args: { value: 24, label: 'X', ariaLabel: 'X position' } };
export const WithUnit = {
  args: { value: 100, min: 0, max: 100, unit: '%', iconName: IconOpacity, ariaLabel: 'Opacity' },
};
export const Mixed = {
  args: { value: null, label: 'W', placeholder: 'Mixed', ariaLabel: 'Width' },
};
export const WithPresets = {
  args: { value: 16, options: [10, 12, 14, 16, 20, 24, 32], ariaLabel: 'Font size' },
};
export const Disabled = {
  args: { value: 24, label: 'X', disabled: true, ariaLabel: 'X position' },
};
