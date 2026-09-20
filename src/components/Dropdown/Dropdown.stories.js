import Dropdown from './index.svelte';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when no selection is made',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the dropdown is disabled',
    },
    showGroupLabels: {
      control: 'boolean',
      description: 'Show labels for option groups',
    },
    iconName: {
      control: 'text',
      description: 'Optional icon to display in the dropdown button',
      table: {
        type: { summary: 'SVG string' },
      },
    },

    stroke: {
      control: 'boolean',
      description: "False: no border until hovered (UI3's Stroke=False)",
    },
    size: {
      control: 'select',
      options: ['default', 'large'],
      description: 'Trigger height',
    },
    searchable: {
      control: 'boolean',
      description: 'Show a search field above long lists',
    },
    chit: {
      control: 'object',
      description:
        'A lead chit when no chosen item carries one; wins over iconName. String or array of strings',
    },
    label: {
      control: 'text',
      description:
        'Button text when it should not be the chosen item\'s menu label. "" shows the placeholder whatever is chosen',
    },
    badge: {
      control: 'text',
      description: "Badge between the label and the chevron; the kit Badge's text",
    },
    badgeVariant: {
      control: 'select',
      options: ['default', 'brand', 'component', 'variable', 'success', 'warning', 'danger'],
      description: "The kit Badge's variant",
    },

    menuItems: {
      control: 'object',
      description: 'Array of menu item objects with label, value, selected, group properties',
    },
    value: {
      control: 'object',
      description: 'Currently selected menu item object',
    },
    // Hide internal props
    class: {
      table: {
        disable: true,
      },
    },
  },
};

// Simple menu items for dropdown (select-like behavior)
const dropdownMenuItems = [
  { value: 'small', label: 'Small', selected: false },
  { value: 'medium', label: 'Medium', selected: true },
  { value: 'large', label: 'Large', selected: false },
  { value: 'extra-large', label: 'Extra Large', selected: false },
];

export const Default = {
  args: {
    placeholder: 'Select size',
    menuItems: dropdownMenuItems,
    value: dropdownMenuItems.find((item) => item.selected) || null,
    disabled: false,
    showGroupLabels: false,
    iconName: null,
    badge: '',
  },
};

// UI3's Stroke=False: no border until hovered
export const Borderless = {
  args: { menuItems: dropdownMenuItems, placeholder: 'Select size', stroke: false },
};

export const Large = {
  args: { menuItems: dropdownMenuItems, placeholder: 'Select size', size: 'large' },
};

// The chosen item's chit (or icon) shows in the button
const colorItems = [
  { value: 'brand', label: 'bg-brand', chit: '#0d99ff' },
  { value: 'danger', label: 'bg-danger', chit: '#f24822' },
  { value: 'success', label: 'bg-success', chit: '#14ae5c' },
];
export const WithChits = {
  args: { menuItems: colorItems, value: colorItems[0], placeholder: 'Choose a color' },
};

// A badge sits between the label and the chevron
export const WithBadge = {
  args: {
    menuItems: dropdownMenuItems,
    value: dropdownMenuItems[1],
    placeholder: 'Select size',
    badge: 'Beta',
    badgeVariant: 'brand',
  },
};

// `label` overrides what the button says when the menu row carries more than it has room for
const collectionItems = [
  { value: 'palette', label: 'Palette — Light, Dark', chit: ['#1c7ed6', '#f76707'] },
  { value: 'spacing', label: 'Spacing — Compact, Default', chit: ['#14ae5c', '#0d99ff'] },
  { value: 'type', label: 'Type — Mobile, Desktop', chit: ['#9747ff', '#f24822'] },
];
export const WithBadgeAndChit = {
  args: {
    menuItems: collectionItems,
    value: collectionItems[0],
    chit: ['#1c7ed6', '#f76707'],
    label: 'Palette',
    badge: '2 modes',
    badgeVariant: 'variable',
    searchable: true,
  },
};

// `label: ""` keeps the placeholder in the button whatever is chosen
export const LabelAsPlaceholder = {
  args: {
    menuItems: dropdownMenuItems,
    value: dropdownMenuItems[1],
    placeholder: 'Select size',
    label: '',
    badge: '4',
    badgeVariant: 'default',
  },
};
