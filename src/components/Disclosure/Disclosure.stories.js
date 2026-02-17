import Disclosure from './index.svelte';
import DisclosureWrapper from '../../../.storybook/DisclosureWrapper.svelte';

export default {
  title: 'Components/Disclosure',
  component: Disclosure,
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: 'Allow multiple items to be expanded at once (accordion vs disclosure)',
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
    multiple: false,
  },
  render: (args) => ({
    Component: DisclosureWrapper,
    props: { ...args },
  }),
};

export const Multiple = {
  args: {
    multiple: true,
  },
  render: (args) => ({
    Component: DisclosureWrapper,
    props: { ...args },
  }),
};
