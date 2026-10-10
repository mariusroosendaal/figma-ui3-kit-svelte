import Banner from './index.svelte';

export default {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['danger', 'warning', 'info', 'success'],
      description: 'Banner variant style',
    },
    message: {
      control: 'text',
      description: 'Banner message (children replace it)',
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
    variant: 'danger',
    message: 'This is a banner message',
  },
};
