import Textarea from './index.svelte';

export default {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Textarea value',
    },
    rows: {
      control: 'number',
      description: 'Number of visible rows',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the textarea is in an invalid state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when invalid',
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
    value: null,
    rows: 2,
    disabled: false,
    placeholder: 'Input something here...',
    invalid: false,
    errorMessage: 'Error message',
  },
};

