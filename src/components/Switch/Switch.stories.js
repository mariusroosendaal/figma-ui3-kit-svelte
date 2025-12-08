import Switch from './index.svelte';

export default {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    mixed: {
      control: 'boolean',
      description: 'Whether the switch is in mixed/indeterminate state',
    },
    value: {
      control: 'text',
      description: 'Switch value',
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
    checked: false,
    disabled: false,
    mixed: false,
    value: '',
  },
};

