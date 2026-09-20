import ToggleButton from './index.svelte';
import IconFilter from '../../icons/24/icon.24.filter.svg';

export default {
  title: 'Components/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  argTypes: {
    pressed: { control: 'boolean' },
    label: { control: 'text' },
    badge: { control: 'text' },
    badgeVariant: {
      control: 'select',
      options: ['default', 'count', 'count-inactive', 'invert', 'success', 'danger', 'warning'],
    },
    variant: { control: 'select', options: ['default', 'secondary'] },
    size: { control: 'select', options: ['default', 'large'] },
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    iconName: { table: { disable: true } },
    class: { table: { disable: true } },
  },
};

export const Default = { args: { label: 'Hidden layers' } };
export const Pressed = { args: { label: 'Hidden layers', pressed: true } };
export const WithBadge = { args: { label: 'Hidden layers', badge: '12', pressed: true } };
export const WithIcon = { args: { label: 'Filters', iconName: IconFilter, badge: '3' } };
export const Secondary = { args: { label: 'Filters', variant: 'secondary', badge: '3' } };
export const Large = {
  args: { label: 'Filters', size: 'large', iconName: IconFilter, badge: '3' },
};
export const Disabled = {
  args: { label: 'Hidden layers', badge: '12', pressed: true, disabled: true },
};
