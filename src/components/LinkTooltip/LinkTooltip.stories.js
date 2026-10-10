import LinkTooltip from './index.svelte';
import LinkTooltipWrapper from '../../../.storybook/LinkTooltipWrapper.svelte';
import IconLink from '../../icons/24/icon.24.link.small.svg';
import IconPhone from '../../icons/24/icon.24.phone.svg';
import IconMail from '../../icons/24/icon.24.mail.svg';
import IconPage from '../../icons/24/icon.24.page.svg';

export default {
  title: 'Components/LinkTooltip',
  component: LinkTooltip,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'The main action; fires `primary`' },
    actions: { control: 'object', description: 'Actions after the main one; each fires `action`' },
    input: {
      control: 'boolean',
      description: 'A URL field instead of actions; Enter fires `submit`',
    },
    direction: { control: 'select', options: ['Top', 'Bottom'] },
    iconName: { table: { disable: true } },
    class: { table: { disable: true } },
  },
  render: (/** @type {Record<string, any>} */ args) => ({
    Component: LinkTooltipWrapper,
    props: { ...args },
  }),
};

// UI3's "Tooltip link" variants
export const URL = { args: { input: true } };
export const Link = {
  args: {
    label: 'Open google.com',
    iconName: IconLink,
    actions: [{ label: 'Edit', value: 'edit' }],
  },
};
export const Phone = {
  args: {
    label: 'Call (415) 355-0394',
    iconName: IconPhone,
    actions: [{ label: 'Edit', value: 'edit' }],
  },
};
export const Email = {
  args: {
    label: 'Copy mail@mail.com',
    iconName: IconMail,
    actions: [
      { label: 'Send mail', value: 'send' },
      { label: 'Edit', value: 'edit' },
    ],
  },
};
export const Page = {
  args: { label: 'Go to page', iconName: IconPage, actions: [{ label: 'Edit', value: 'edit' }] },
};
