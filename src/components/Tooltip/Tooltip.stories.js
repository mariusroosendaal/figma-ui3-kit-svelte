import Tooltip from './index.svelte';
import TooltipWrapper from '../../../.storybook/TooltipWrapper.svelte';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Tooltip label text',
    },
    hotkey: {
      control: 'boolean',
      description: 'Show hotkey text',
    },
    hotkeyText: {
      control: 'text',
      description: 'Hotkey text to display',
    },
    direction: {
      control: 'select',
      options: ['Top', 'TopLeft', 'TopRight', 'Bottom', 'BottomLeft', 'BottomRight', 'Left', 'Right'],
      description: 'Tooltip direction relative to trigger',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether tooltip is disabled',
    },
    class: {
      table: {
        disable: true,
      },
    },
  },
};

export const Default = {
  args: {
    label: 'Tooltip text',
    hotkey: false,
    hotkeyText: '⌘V',
    direction: 'Top', 
    disabled: false,
  },
  render: (args) => ({
    Component: TooltipWrapper,
    props: { ...args },
  }),
};

export const WithHotkey = {
  args: {
    label: 'Tooltip with hotkey',
    hotkey: true,
    hotkeyText: '⌘V',
    direction: 'Top',
    disabled: false,
  },
  render: (args) => ({
    Component: TooltipWrapper,
    props: { ...args },
  }),
};

