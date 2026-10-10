import Switch from './index.svelte';
import LabelledWrapper from '../../../.storybook/LabelledWrapper.svelte';

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

export const WithDescription = {
  args: {
    checked: true,
    description: 'Helpful description of the setting, e.g. a side effect or a condition.',
  },
  render: (/** @type {Record<string, any>} */ args) => ({
    Component: LabelledWrapper,
    props: { component: Switch, label: 'Live sync', props: args },
  }),
};
