import Label from './index.svelte';

export default {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['medium', 'small'],
      description: 'Label size variant',
    },
    text: {
      control: 'text',
      description: 'Label text (falls back to slot content if provided)',
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
    size: 'medium',
    text: 'Label',
  },
};

