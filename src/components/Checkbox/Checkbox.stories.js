import Checkbox from './index.svelte';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    mixed: {
      control: 'boolean',
    },
    muted: {
      control: 'boolean',
    },
    ghost: {
      control: 'boolean',
    },
  },
};

export const Unchecked = {
  args: {
    checked: false,
    disabled: false,
    mixed: false,
    muted: false,
    ghost: false,
  },
};

export const Checked = {
  args: {
    checked: true,
    disabled: false,
    mixed: false,
    muted: false,
    ghost: false,
  },
};

export const Mixed = {
  args: {
    checked: false,
    disabled: false,
    mixed: true,
    muted: false,
    ghost: false,
  },
};

export const Disabled = {
  args: {
    checked: false,
    disabled: true,
    mixed: false,
    muted: false,
    ghost: false,
  },
};

export const DisabledChecked = {
  args: {
    checked: true,
    disabled: true,
    mixed: false,
    muted: false,
    ghost: false,
  },
};

export const Muted = {
  args: {
    checked: true,
    disabled: false,
    mixed: false,
    muted: true,
    ghost: false,
  },
};

export const Ghost = {
  args: {
    checked: true,
    disabled: false,
    mixed: false,
    muted: false,
    ghost: true,
  },
};
