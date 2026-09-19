import SplitButton from './index.svelte';
import IconPlay from '../../icons/24/icon.24.play.svg';

export default {
  title: 'Components/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'large'] },
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    menuAriaLabel: { control: 'text' },
    menuItems: { control: 'object' },
    iconName: { table: { disable: true } },
    class: { table: { disable: true } },
  },
};

const menuItems = [
  { value: 'present', label: 'Present in new tab' },
  { value: 'preview', label: 'Preview' },
  { value: 'present-here', label: 'Present in this tab' },
];

export const Small = { args: { iconName: IconPlay, ariaLabel: 'Present', menuItems } };
export const Large = {
  args: { iconName: IconPlay, ariaLabel: 'Present', menuItems, size: 'large' },
};
export const Disabled = {
  args: { iconName: IconPlay, ariaLabel: 'Present', menuItems, disabled: true },
};
