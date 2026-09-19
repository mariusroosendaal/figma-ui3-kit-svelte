import SegmentedControl from './index.svelte';
import SegmentedControlWrapper from '../../../.storybook/SegmentedControlWrapper.svelte';
import IconLayoutVertical from '../../icons/24/icon.24.al.layout-vertical.svg';
import IconLayoutHorizontal from '../../icons/24/icon.24.al.layout-horizontal.svg';
import IconLayoutWrap from '../../icons/24/icon.24.al.layout-wrap.svg';
import IconMinus from '../../icons/24/icon.24.minus.svg';
import IconUppercase from '../../icons/24/icon.24.uppercase.svg';
import IconLowercase from '../../icons/24/icon.24.lowercase.svg';
import IconTitleCase from '../../icons/24/icon.24.title-case.svg';
import IconSmallCaps from '../../icons/24/icon.24.small-caps.svg';
import IconAlignLeft from '../../icons/24/icon.24.text.align-left.svg';
import IconAlignCenter from '../../icons/24/icon.24.text.align-center.svg';
import IconAlignRight from '../../icons/24/icon.24.text.align-right.svg';
import IconAlignJustified from '../../icons/24/icon.24.text.align-justified.svg';

export default {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disables every segment',
    },
    width: {
      control: 'number',
      description: 'Container width in the story (UI3 grid: 88px or 168px for icons)',
    },
    segments: {
      table: {
        disable: true,
      },
    },
    value: {
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
  render: (args) => ({
    Component: SegmentedControlWrapper,
    props: { ...args },
  }),
};

export const Icons = {
  args: {
    width: 88,
    disabled: false,
    value: 'vertical',
    segments: [
      { value: 'vertical', iconName: IconLayoutVertical, tooltip: 'Vertical layout' },
      { value: 'horizontal', iconName: IconLayoutHorizontal, tooltip: 'Horizontal layout' },
    ],
  },
};

export const ThreeIcons = {
  args: {
    width: 168,
    disabled: false,
    value: 'vertical',
    segments: [
      { value: 'vertical', iconName: IconLayoutVertical, tooltip: 'Vertical layout' },
      { value: 'horizontal', iconName: IconLayoutHorizontal, tooltip: 'Horizontal layout' },
      { value: 'wrap', iconName: IconLayoutWrap, tooltip: 'Wrap' },
    ],
  },
};

export const FourIcons = {
  args: {
    width: 168,
    disabled: false,
    value: 'left',
    segments: [
      { value: 'left', iconName: IconAlignLeft, tooltip: 'Align left' },
      { value: 'center', iconName: IconAlignCenter, tooltip: 'Align center' },
      { value: 'right', iconName: IconAlignRight, tooltip: 'Align right' },
      { value: 'justified', iconName: IconAlignJustified, tooltip: 'Justified' },
    ],
  },
};

export const Labels = {
  args: {
    width: 240,
    disabled: false,
    value: 'fill',
    segments: [
      { value: 'fill', label: 'Fill' },
      { value: 'hug', label: 'Hug' },
      { value: 'fixed', label: 'Fixed' },
    ],
  },
};

export const Disabled = {
  args: {
    width: 240,
    disabled: true,
    value: 'fill',
    segments: [
      { value: 'fill', label: 'Fill' },
      { value: 'hug', label: 'Hug' },
      { value: 'fixed', label: 'Fixed' },
    ],
  },
};

export const DisabledOption = {
  args: {
    width: 168,
    disabled: false,
    value: 'none',
    segments: [
      { value: 'none', iconName: IconMinus, tooltip: 'As typed' },
      { value: 'upper', iconName: IconUppercase, tooltip: 'Uppercase' },
      { value: 'lower', iconName: IconLowercase, tooltip: 'Lowercase' },
      { value: 'title', iconName: IconTitleCase, tooltip: 'Title case' },
      {
        value: 'small-caps',
        iconName: IconSmallCaps,
        disabled: true,
        tooltip: 'Small caps are not supported by this font',
      },
    ],
  },
};
