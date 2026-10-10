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
      options: [
        'default',
        'brand',
        'component',
        'danger',
        'success',
        'warning',
        'invert',
        'selected',
        'variable',
        'variable-selected',
        'feedback',
        'merged',
        'archived',
        'menu',
        'figjam',
      ],
      description: 'Badge variant style',
    },
    strong: {
      control: 'boolean',
      description: 'Use strong variant (colored backgrounds)',
    },
    iconName: {
      control: 'select',
      options: [null, Icon16Check, Icon16Warning],
      description:
        'Icon for variants that support icons (variable, variable-selected, feedback, merged, archived)',
    },
    text: {
      control: 'text',
      description: 'Badge text (children replace it)',
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

// UI3's "Badge small alt": counts on tabs and lists
export const Count = { args: { variant: 'count', text: '21' } };
export const CountInactive = { args: { variant: 'count-inactive', text: '21' } };

// UI3's "Badge large"
export const Large = { args: { size: 'large', variant: 'default', strong: true, text: 'Badge' } };

// UI3's "Badge Dot": an unread marker
export const Dot = { args: { dot: true, ariaLabel: 'Unread' } };
export const DotWarning = { args: { dot: true, variant: 'warning', ariaLabel: 'Changed' } };
