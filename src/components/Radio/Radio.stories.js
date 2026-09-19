import Radio from './index.svelte';
import RadioWrapper from '../../../.storybook/RadioWrapper.svelte';

export default {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Radio value',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio is disabled',
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
    value: 'option1',
    disabled: false,
  },
  render: (args) => ({
    Component: RadioWrapper,
    props: { ...args },
  }),
};

// UI3's radio "Button" variant, laid out as a row by RadioGroup direction="horizontal"
export const ButtonVariant = {
  args: { value: 'option1', disabled: false, variant: 'button' },
  render: (args) => ({ Component: RadioWrapper, props: { ...args } }),
};
