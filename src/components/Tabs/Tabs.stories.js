import Tabs from './index.svelte';
import TabsWrapper from '../../../.storybook/TabsWrapper.svelte';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    tabs: {
      control: 'object',
      description:
        'Array of strings, or of { label, badge?, unread? } — badge is a count, unread marks it new',
    },
    selectedTab: {
      control: 'number',
      description: 'Index of currently selected tab',
    },
    onchange: {
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

const basicTabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }];

export const Default = {
  args: {
    tabs: basicTabs,
    selectedTab: 0,
  },
  render: (/** @type {Record<string, any>} */ args) => ({
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
  render: (/** @type {Record<string, any>} */ args) => ({
    Component: TabsWrapper,
    props: { ...args },
  }),
};

// UI3's _Tab badge: a count beside the label. Filled gray on the selected tab,
// quieter on the rest.
export const WithBadges = {
  args: {
    tabs: [{ label: 'Local', badge: 3 }, { label: 'Libraries', badge: 21 }, { label: 'All' }],
    selectedTab: 0,
  },
  render: (/** @type {Record<string, any>} */ args) => ({
    Component: TabsWrapper,
    props: { ...args },
  }),
};

// `unread` takes the count blue on either tab — a new count is worth the color
// whether or not its tab is open.
export const UnreadCounts = {
  args: {
    tabs: [
      { label: 'Local', badge: 3, unread: true },
      { label: 'Libraries', badge: 21 },
      { label: 'Updates', badge: 7, unread: true },
    ],
    selectedTab: 0,
  },
  render: (/** @type {Record<string, any>} */ args) => ({
    Component: TabsWrapper,
    props: { ...args },
  }),
};
