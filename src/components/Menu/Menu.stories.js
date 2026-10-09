import Menu from './index.svelte';
import MenuWrapper from '../../../.storybook/MenuWrapper.svelte';
import IconFolder from '../../icons/16/icon.16.folder.svg';
import IconFrame from '../../icons/16/icon.16.frame.svg';
import IconComponent from '../../icons/16/icon.16.component.svg';

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
    searchable: {
      control: 'boolean',
      description: 'Search field above the list; filters by label, group and detail',
    },
    searchPlaceholder: {
      control: 'text',
      description: 'Placeholder and accessible name of the search field',
    },
    footerLabel: {
      control: 'text',
      description: 'Label of a full-width button under the list; fires `footer`',
    },
    footerVariant: {
      control: 'select',
      options: ['button', 'row'],
      description: 'button (multi-select menus) or a centered "+ label" row',
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

// Checkmark rows flip on their own and close the menu; the dot marks a sub-menu
// holding the current choice. Details carry shortcuts.
const viewMenuItems = [
  {
    value: 'pixel-preview',
    label: 'Pixel preview',
    type: 'check',
    checked: 'mixed',
    subMenu: [
      { value: 'off', label: 'Disabled' },
      { value: '1x', label: '1x' },
      { value: '2x', label: '2x' },
    ],
  },
  { value: 'pixel-grid', label: 'Pixel grid', type: 'check', checked: true, detail: "⇧'" },
  { value: 'snap', label: 'Snap to pixel grid', type: 'check', checked: true, detail: "⇧⌘'" },
  { value: 'layout-grids', label: 'Layout grids', type: 'check', detail: '⇧G' },
  { value: 'rulers', label: 'Rulers', type: 'check', detail: '⇧R' },
  {
    value: 'multiplayer',
    label: 'Multiplayer cursors',
    type: 'check',
    checked: true,
    detail: '⌥⌘\\',
    disabled: true,
  },
  {
    value: 'comments',
    label: 'Comments',
    type: 'check',
    checked: true,
    detail: '⇧C',
    group: 'Canvas',
  },
  {
    value: 'prototypes',
    label: 'Prototypes',
    type: 'check',
    checked: true,
    detail: '⇧E',
    group: 'Canvas',
  },
];

export const Checkmarks = {
  args: { menuItems: viewMenuItems, minWidth: '208px' },
  render: (args) => ({ Component: MenuWrapper, props: { ...args } }),
};

// Toggle rows keep the menu open, so several can be flipped in one go.
export const Toggles = {
  args: {
    menuItems: [
      { value: 'outline', label: 'Show outlines', type: 'toggle', checked: true, detail: '⌥⇧⌘O' },
      { value: 'grid', label: 'Show grid', type: 'toggle', checked: false },
      { value: 'labels', label: 'Show labels', type: 'toggle', checked: 'mixed' },
    ],
    minWidth: '208px',
  },
  render: (args) => ({ Component: MenuWrapper, props: { ...args } }),
};

// UI3's "Menu multi-select": search, grouped rows with icons or chits, trailing
// checkboxes with counts, and a footer action.
export const MultiSelect = {
  args: {
    searchable: true,
    searchPlaceholder: 'Search projects, teams, or organizations',
    footerLabel: 'Clear all',
    showGroupLabels: true,
    menuItems: [
      { value: 'a', label: 'Project A', group: 'Projects', iconName: IconFolder, type: 'checkbox' },
      { value: 'b', label: 'Project B', group: 'Projects', iconName: IconFolder, type: 'checkbox' },
      {
        value: 'ta',
        label: 'Team A',
        group: 'Teams',
        chit: '#ffc700',
        type: 'checkbox',
        checked: true,
      },
      { value: 'tb', label: 'Team B', group: 'Teams', chit: '#f24e1e', type: 'checkbox' },
      {
        value: 'oa',
        label: 'Org A',
        group: 'Organizations',
        chit: '#14ae5c',
        type: 'checkbox',
        detail: '24',
      },
      {
        value: 'ob',
        label: 'Org B',
        group: 'Organizations',
        chit: '#14ae5c',
        type: 'checkbox',
        detail: '3',
        checked: true,
      },
    ],
  },
  render: (args) => ({ Component: MenuWrapper, props: { ...args } }),
};

// "Menu row/Complex": lead icons, counts and badges.
export const RichRows = {
  args: {
    menuItems: [
      { value: 'frame', label: 'Frame', iconName: IconFrame, detail: 'F' },
      { value: 'component', label: 'Component', iconName: IconComponent, badge: 'New' },
      { value: 'files', label: 'Files', iconName: IconFolder, detail: '250' },
      { value: 'archived', label: 'Archived', iconName: IconFolder, disabled: true },
    ],
    minWidth: '208px',
  },
  render: (args) => ({ Component: MenuWrapper, props: { ...args } }),
};

// UI3's Complex rows with avatars, and Menu row/Footer as the last row
export const PeopleWithFooterRow = {
  args: {
    footerLabel: 'Invite people',
    footerVariant: 'row',
    menuItems: [
      {
        value: 'e',
        label: 'Elijah Smith',
        avatar: { name: 'Elijah Smith', color: 'green' },
        type: 'checkbox',
      },
      {
        value: 't',
        label: 'Ethan Thompson',
        avatar: { name: 'Ethan Thompson', color: 'pink' },
        type: 'checkbox',
      },
      {
        value: 'o',
        label: 'Olivia Martinez',
        avatar: { name: 'Olivia Martinez', color: 'yellow' },
        type: 'checkbox',
        checked: true,
      },
    ],
    minWidth: '208px',
  },
  render: (args) => ({ Component: MenuWrapper, props: { ...args } }),
};

// Taller than the window: UI3's overflow arrows (Menu row/Expand) scroll it on hover
export const Overflow = {
  args: {
    menuItems: Array.from({ length: 60 }, (_, i) => ({
      value: i,
      label: `Weight ${100 + i * 10}`,
    })),
    minWidth: '208px',
  },
  render: (args) => ({ Component: MenuWrapper, props: { ...args } }),
};
