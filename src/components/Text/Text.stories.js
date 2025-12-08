import Text from './index.svelte';

export default {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['heading-large', 'heading-medium', 'heading-small', 'body-large', 'body-large-strong', 'body-medium', 'body-medium-strong', 'body-small', 'body-small-strong'],
      description: 'Text typography variant',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Text alignment',
    },
    block: {
      control: 'boolean',
      description: 'Display as block element',
    },
    color: {
      control: 'text',
      description: 'CSS variable or color value (e.g., --figma-color-text)',
    },
    text: {
      control: 'text',
      description: 'Text content (falls back to slot content if provided)',
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
    variant: 'body-medium',
    align: 'start',
    block: false,
    color: '--figma-color-text',
    text: 'Text content',
  },
};

