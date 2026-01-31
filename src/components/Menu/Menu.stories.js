import Menu from './index.svelte';
import MenuWrapper from '../../../.storybook/MenuWrapper.svelte';

export default {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the menu is visible',
    },
    showGroupLabels: {
      control: 'boolean',
      description: 'Show labels for option groups',
    },
    position: {
      control: 'select',
      options: ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
      description: 'Menu position relative to anchor element',
    },
    itemVariant: {
      control: 'select',
      options: ['default', 'checkmark'],
      description: 'MenuItem variant style',
    },
    minWidth: {
      control: 'text',
      description: 'Minimum width of the menu',
    },
    menuItems: {
      control: 'object',
      description:
        'Array of menu item objects with label, value, selected, group, and optionally subMenu properties',
    },
    // Hide internal props
    anchorElement: {
      table: {
        disable: true,
      },
    },
    nestingLevel: {
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

// Sample menu items (no selected flags - menus are action-based, not select-like)
const simpleMenuItems = [
  { value: 'copy', label: 'Copy' },
  { value: 'paste', label: 'Paste' },
  { value: 'cut', label: 'Cut' },
  { value: 'delete', label: 'Delete' },
];

const menuItemsWithGroups = [
  { value: 'granny', label: 'Granny Smith', group: 'Apples' },
  { value: 'honey', label: 'Honey Crisp', group: 'Apples' },
  { value: 'blood', label: 'Blood Orange', group: 'Oranges' },
  { value: 'valencia', label: 'Valencia', group: 'Oranges' },
];

const menuItemsWithNested = [
  { value: 'copy', label: 'Copy' },
  {
    value: 'copy-paste',
    label: 'Copy / Paste as',
    subMenu: [
      { value: 'png', label: 'PNG' },
      { value: 'jpg', label: 'JPG' },
      { value: 'svg', label: 'SVG' },
      { value: 'pdf', label: 'PDF' },
    ],
  },
  { value: 'paste', label: 'Paste' },
  {
    value: 'export',
    label: 'Export',
    subMenu: [
      { value: 'export-selected', label: 'Export Selected' },
      {
        value: 'export-options',
        label: 'Export Options',
        subMenu: [
          { value: 'export-all', label: 'Export All Pages' },
          { value: 'export-frame', label: 'Export Frame Only' },
        ],
      },
      { value: 'export-png', label: 'As PNG' },
      { value: 'export-svg', label: 'As SVG' },
    ],
  },
  { value: 'delete', label: 'Delete' },
];

export const Default = {
  args: {
    menuItems: simpleMenuItems,
    showGroupLabels: false,
    position: 'bottom-left',
    itemVariant: 'default',
  },
  render: (args) => ({
    Component: MenuWrapper,
    props: { ...args },
  }),
};

export const WithGroups = {
  args: {
    menuItems: menuItemsWithGroups,
    showGroupLabels: true,
    position: 'bottom-left',
    itemVariant: 'default',
  },
  render: (args) => ({
    Component: MenuWrapper,
    props: { ...args },
  }),
};

export const WithNested = {
  args: {
    menuItems: menuItemsWithNested,
    showGroupLabels: false,
    position: 'bottom-left',
    itemVariant: 'default',
  },
  render: (args) => ({
    Component: MenuWrapper,
    props: { ...args },
  }),
};
