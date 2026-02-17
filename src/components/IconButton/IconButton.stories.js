import IconButton from './index.svelte';
import Icon24Close from '../../icons/24/icon.24.close.svg';
import Icon24Plus from '../../icons/24/icon.24.plus.svg';
import Icon24Settings from '../../icons/24/icon.24.settings.svg';
import Icon24AlPaddingSides from '../../icons/24/icon.24.al.padding-sides.svg';

export default {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    iconName: {
      control: 'select',
      options: [Icon24AlPaddingSides, Icon24Close, Icon24Plus, Icon24Settings],
      description: 'SVG icon data',
    },
    iconText: {
      control: 'text',
      description: 'Alternative text content (instead of icon)',
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary'],
      description: 'Button variant style',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    spin: {
      control: 'boolean',
      description: 'Enable spinning animation on icon',
    },
    iconColor: {
      control: 'text',
      description: 'Optional: override icon color (CSS variable)',
    },
    class: {
      table: {
        disable: true,
      },
    },
  },
};

export const Default = {
  args: {
    iconName: Icon24AlPaddingSides,
    iconText: null,
    variant: 'default',
    disabled: false,
    spin: false,
    iconColor: null,
  },
};
export const Secondary = {
  args: {
    iconName: Icon24AlPaddingSides,
    iconText: null,
    variant: 'secondary',
    disabled: false,
    spin: false,
    iconColor: null,
  },
};
