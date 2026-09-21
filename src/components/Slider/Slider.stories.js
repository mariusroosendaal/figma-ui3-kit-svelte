import Slider from './index.svelte';
import WideContainer from '../../../.storybook/WideContainer.svelte';

export default {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['range', 'delta', 'stepper'],
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    step: {
      control: 'number',
    },
    disabled: {
      control: 'boolean',
    },
    defaultValue: {
      control: 'number',
    },
  },
};

export const Range = {
  args: {
    variant: 'range',
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
  render: (args) => ({
    Component: WideContainer,
    props: {
      width: '300px',
      childComponent: Slider,
      childProps: args,
    },
  }),
};

export const Delta = {
  args: {
    variant: 'delta',
    value: 65,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    defaultValue: 50,
  },
  render: (args) => ({
    Component: WideContainer,
    props: {
      width: '300px',
      childComponent: Slider,
      childProps: args,
    },
  }),
};

export const Stepper = {
  args: {
    variant: 'stepper',
    value: 40,
    min: 0,
    max: 100,
    step: 10,
    disabled: false,
  },
  render: (args) => ({
    Component: WideContainer,
    props: {
      width: '300px',
      childComponent: Slider,
      childProps: args,
    },
  }),
};

export const Disabled = {
  args: {
    variant: 'range',
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    disabled: true,
  },
  render: (args) => ({
    Component: WideContainer,
    props: {
      width: '300px',
      childComponent: Slider,
      childProps: args,
    },
  }),
};

export const CustomRange = {
  args: {
    variant: 'range',
    value: 25,
    min: 0,
    max: 50,
    step: 5,
    disabled: false,
  },
  render: (args) => ({
    Component: WideContainer,
    props: {
      width: '300px',
      childComponent: Slider,
      childProps: args,
    },
  }),
};

// UI3's "Color Range": a hue slider
export const Hue = {
  args: { variant: 'hue', value: 270, min: 0, max: 360, ariaLabel: 'Hue' },
  render: (args) => ({
    Component: WideContainer,
    props: { childComponent: Slider, childProps: args },
  }),
};

// UI3's "Fill": opacity of a color over the checkerboard
export const Opacity = {
  args: { variant: 'opacity', color: '#9747ff', value: 80, ariaLabel: 'Opacity' },
  render: (args) => ({
    Component: WideContainer,
    props: { childComponent: Slider, childProps: args },
  }),
};

// UI3's "Corner Radius": a range slider with a marker at a reference value
export const WithMarker = {
  args: { variant: 'range', value: 30, defaultValue: 70, ariaLabel: 'Corner radius' },
  render: (args) => ({
    Component: WideContainer,
    props: { childComponent: Slider, childProps: args },
  }),
};
