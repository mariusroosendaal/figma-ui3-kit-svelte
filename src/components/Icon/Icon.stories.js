import Icon from './index.svelte';
import Icon24Check from '../../icons/24/icon.24.check.svg';
import Icon24Close from '../../icons/24/icon.24.close.svg';
import Icon24Plus from '../../icons/24/icon.24.plus.svg';
import Icon24Warning from '../../icons/24/icon.24.warning.small.svg';
import Icon24Settings from '../../icons/24/icon.24.settings.svg';

export default {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    iconName: {
      control: 'select',
      options: [Icon24Check, Icon24Close, Icon24Plus, Icon24Warning, Icon24Settings],
      description: 'SVG icon data',
    },
    spin: {
      control: 'boolean',
      description: 'Enable spinning animation',
    },
    iconText: {
      control: 'text',
      description: 'Alternative text content (instead of icon)',
    },
    color: {
      control: 'text',
      description: 'CSS variable or color value',
    },
    size: {
      control: 'number',
      description: 'Icon size in pixels',
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
    iconName: Icon24Check,
    spin: false,
    iconText: null,
    color: '--figma-color-icon',
    size: 24,
  },
};

export const WithText = {
  args: {
    iconName: null,
    spin: false,
    iconText: 'Aa',
    color: '--figma-color-icon',
    size: 24,
  },
};

export const Spinning = {
  args: {
    iconName: Icon24Settings,
    spin: true,
    iconText: null,
    color: '--figma-color-icon',
    size: 24,
  },
};

