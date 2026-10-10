import SidebarRow from './index.svelte';
import SidebarRowWrapper from '../../../.storybook/SidebarRowWrapper.svelte';

const comment = {
  meta: '#3 ∙ Page 1',
  title: 'Wayne Sun',
  detail: 'Just now',
  message:
    'What happens if we adjust this to handle a light and dark mode? I’m not sure we’re ready to handle that quite yet.',
  link: '2 replies',
};

export default {
  title: 'Components/SidebarRow',
  component: SidebarRow,
  tags: ['autodocs'],
  argTypes: {
    meta: { control: 'text', description: 'Where: "#3 ∙ Page 1"' },
    title: { control: 'text', description: 'Who or what: a name, a short title' },
    detail: { control: 'text', description: 'Beside the title: "Just now"' },
    message: { control: 'text' },
    link: { control: 'text', description: 'The link line; fires `link`' },
    unread: { control: 'boolean', description: 'Blue dot, blue link' },
    selected: { control: 'boolean' },
    clickable: { control: 'boolean', description: 'The whole row is a button that fires `click`' },
    lines: { control: 'number', description: 'Lines the message is cut after; 0 shows all' },
    avatars: { control: 'boolean', description: 'Story only: avatars in the `lead` snippet' },
    actions: {
      control: 'boolean',
      description: 'Story only: icon buttons in the `actions` snippet',
    },
    class: { table: { disable: true } },
  },
  render: (/** @type {Record<string, any>} */ args) => ({
    Component: SidebarRowWrapper,
    props: { ...args },
  }),
};

export const Default = { args: { ...comment } };
export const NoReplies = { args: { ...comment, link: '' } };
export const Unread = { args: { ...comment, unread: true } };
export const Selected = { args: { ...comment, selected: true } };
export const Clamped = { args: { ...comment, lines: 3 } };
export const NotClickable = { args: { ...comment, clickable: false, actions: false } };
