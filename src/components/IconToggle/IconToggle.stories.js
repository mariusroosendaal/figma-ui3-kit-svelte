import IconToggle from './index.svelte';
import IconEye from '../../icons/24/icon.24.eye.small.svg';
import IconHidden from '../../icons/24/icon.24.hidden.small.svg';
import IconLinkBroken from '../../icons/24/icon.24.link-broken.svg';
import IconLinkConnected from '../../icons/24/icon.24.link-connected.svg';
import IconStyles from '../../icons/24/icon.24.styles.svg';

export default {
  title: 'Components/IconToggle',
  component: IconToggle,
  tags: ['autodocs'],
  argTypes: {
    pressed: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'secondary'] },
    highlighted: { control: 'boolean', description: 'Pressed fill with swapped icons too' },
    disabled: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    iconName: { table: { disable: true } },
    iconNameOn: { table: { disable: true } },
    class: { table: { disable: true } },
  },
};

// "Button icon toggle": the icon swaps
export const Swap = {
  args: {
    iconName: IconLinkBroken,
    iconNameOn: IconLinkConnected,
    ariaLabel: 'Constrain proportions',
  },
};
export const Highlighted = {
  args: {
    iconName: IconEye,
    iconNameOn: IconHidden,
    highlighted: true,
    pressed: true,
    ariaLabel: 'Hide layer',
  },
};
// "Button icon dialog toggle": one icon on the selected fill
export const Fill = { args: { iconName: IconStyles, pressed: true, ariaLabel: 'Styles panel' } };
export const Secondary = {
  args: { iconName: IconStyles, variant: 'secondary', ariaLabel: 'Styles panel' },
};
export const Disabled = {
  args: { iconName: IconStyles, pressed: true, disabled: true, ariaLabel: 'Styles panel' },
};
