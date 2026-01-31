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
  },
};
