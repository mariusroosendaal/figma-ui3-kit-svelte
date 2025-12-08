import Tabs from './index.svelte';
import TabsWrapper from '../../../.storybook/TabsWrapper.svelte';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    tabs: {
      control: 'object',
      description: 'Array of tab objects with label property, or array of strings',
    },
    selectedTab: {
      control: 'number',
      description: 'Index of currently selected tab',
    },
    onTabChange: {
      table: {
        disable: true,
      },
    },
    class: {
      table: {
        disable: true,
      },
    },
  },
};

const basicTabs = [
  { label: 'Tab 1' },
  { label: 'Tab 2' },
  { label: 'Tab 3' },
];

export const Default = {
  args: {
    tabs: basicTabs,
    selectedTab: 0,
  },
  render: (args) => ({
    Component: TabsWrapper,
    props: { ...args },
  }),
};

export const ManyTabs = {
  args: {
    tabs: [
      { label: 'First' },
      { label: 'Second' },
      { label: 'Third' },
      { label: 'Fourth' },
      { label: 'Fifth' },
    ],
    selectedTab: 0,
  },
  render: (args) => ({
    Component: TabsWrapper,
    props: { ...args },
  }),
};

