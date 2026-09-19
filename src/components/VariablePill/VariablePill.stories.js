import VariablePill from './index.svelte';

export default {
  title: 'Components/VariablePill',
  component: VariablePill,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'boolean' },
    onSelected: { control: 'boolean', description: 'Inside a selected field or row' },
    muted: { control: 'boolean', description: 'Soft-deleted, or its value is not rendered' },
    disabled: { control: 'boolean' },
    class: { table: { disable: true } },
  },
};

export const Default = { args: { label: 'spacing/8' } };
export const Selected = { args: { label: 'spacing/8', selected: true } };
export const OnSelected = { args: { label: 'spacing/8', onSelected: true } };
export const Muted = { args: { label: 'spacing/8', muted: true } };
export const Disabled = { args: { label: 'spacing/8', disabled: true } };
