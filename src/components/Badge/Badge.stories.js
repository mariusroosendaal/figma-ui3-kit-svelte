import Badge from './index.svelte';
import Icon16Check from '../../icons/16/icon.16.check.svg';
import Icon16Warning from '../../icons/16/icon.16.warning.svg';

export default {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'brand', 'component', 'danger', 'success', 'warning', 'invert', 'selected', 'variable', 'variable-selected', 'feedback', 'merged', 'archived', 'menu', 'figjam'],
      description: 'Badge variant style',
    },
    strong: {
      control: 'boolean',
      description: 'Use strong variant (colored backgrounds)',
    },
    iconName: {
      control: 'select',
      options: [null, Icon16Check, Icon16Warning],
      description: 'Icon for variants that support icons (variable, variable-selected, feedback, merged, archived)',
    },
    text: {
      control: 'text',
      description: 'Badge text (falls back to slot content if provided)',
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
    variant: 'default',
    strong: false,
    iconName: null,
    text: 'Badge',
  },
};

