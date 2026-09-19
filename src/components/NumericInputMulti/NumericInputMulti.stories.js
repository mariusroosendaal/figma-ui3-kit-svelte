import NumericInputMulti from './index.svelte';
import IconRadius from '../../icons/24/icon.24.radius.top.left.svg';

export default {
  title: 'Components/NumericInputMulti',
  component: NumericInputMulti,
  tags: ['autodocs'],
  argTypes: {
    values: { control: 'object' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    label: { control: 'text' },
    disabled: { control: 'object', description: 'One flag, or one per cell' },
    iconName: { table: { disable: true } },
    class: { table: { disable: true } },
  },
};

const ariaLabels = ['Top left', 'Top right', 'Bottom right', 'Bottom left'];

export const CornerRadius = {
  args: { values: [8, 8, 0, 0], min: 0, iconName: IconRadius, ariaLabels },
};
export const PartlyDisabled = {
  args: {
    values: [24, 24, 24, 0],
    min: 0,
    iconName: IconRadius,
    ariaLabels,
    disabled: [false, false, false, true],
  },
};
export const Disabled = {
  args: { values: [24, 24, 24, 24], iconName: IconRadius, ariaLabels, disabled: true },
};
