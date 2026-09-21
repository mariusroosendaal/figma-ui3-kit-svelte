import Avatar from './index.svelte';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    src: { control: 'text', description: 'Photo or organisation image URL' },
    color: {
      control: 'select',
      options: [null, 'purple', 'blue', 'pink', 'red', 'yellow', 'green', 'grey'],
      description: 'Multiplayer color; picked from the name when null',
    },
    size: { control: 'select', options: ['small', 'default', 'large'] },
    shape: { control: 'select', options: ['circle', 'square'] },
    count: { control: 'number', description: 'Overflow avatar ("3 more")' },
    unread: { control: 'boolean' },
    disabled: { control: 'boolean' },
    class: { table: { disable: true } },
  },
};

export const Initial = { args: { name: 'Lizzy Lasagna' } };
export const Yellow = { args: { name: 'Olivia Martinez', color: 'yellow' } };
export const Large = { args: { name: 'Team A', size: 'large', shape: 'square' } };
export const Small = { args: { name: 'Ethan', size: 'small' } };
export const Overflow = { args: { count: 2, unread: true } };
export const OverflowRead = { args: { count: 2 } };
export const Disabled = { args: { name: 'Guest', disabled: true } };
