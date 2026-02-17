import Chip from './index.svelte';
import Icon24Check from '../../icons/24/icon.24.check.svg';
import Icon24Settings from '../../icons/24/icon.24.settings.svg';

export default {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'component'],
      description: 'Chip variant style',
    },
    label: {
      control: 'text',
      description: 'Chip label text',
    },
    iconName: {
      control: 'select',
      options: [null, Icon24Check, Icon24Settings],
      description: 'Optional icon to display in the chip',
    },
    closable: {
      control: 'boolean',
      description: 'Whether the chip has a close button',
    },
    focused: {
      control: 'boolean',
      description: 'Whether the chip is in focused state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the chip is disabled',
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
    label: 'Chip',
    iconName: null,
    closable: false,
    focused: false,
    disabled: false,
  },
};
