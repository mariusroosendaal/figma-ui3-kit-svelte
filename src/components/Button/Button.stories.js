import Button from './index.svelte';
import Icon24Check from '../../icons/24/icon.24.check.svg';
import Icon24Close from '../../icons/24/icon.24.close.svg';
import Icon24Plus from '../../icons/24/icon.24.plus.svg';
import Icon24Settings from '../../icons/24/icon.24.settings.svg';
import WideContainer from '../../../.storybook/WideContainer.svelte';

export default {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'secondary-destructive', 'inverse', 'success', 'link', 'link-danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['default', 'large', 'wide'],
    },
    iconLead: {
      control: 'select',
      options: ['left', 'center'],
      description: 'Icon positioning (only applies to wide variant)',
    },
    disabled: {
      control: 'boolean',
    },
    label: {
      control: 'text',
      description: 'Button label text',
    },
    iconName: {
      control: 'select',
      options: [null, Icon24Plus, Icon24Settings],
      description: 'SVG icon content (imported SVG file)'
    },
    
    // Hide internal/advanced props from Storybook controls
    class: {
      table: {
        disable: true,
      },
    },
    element: {
      table: {
        disable: true,
      },
    },
  },
};

export const Primary = {
  args: {
    variant: 'primary',
    size: 'default',
    disabled: false,
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    size: 'default',
    disabled: false,
    label: 'Secondary Button',
  },
};

export const Destructive = {
  args: {
    variant: 'destructive',
    size: 'default',
    disabled: false,
    label: 'Destructive',
  },
};

export const SecondaryDestructive = {
  args: {
    variant: 'secondary-destructive',
    size: 'default',
    disabled: false,
    label: 'Secondary Destructive',
  },
};

export const Inverse = {
  args: {
    variant: 'inverse',
    size: 'default',
    disabled: false,
    label: 'Inverse',
  },
};

export const Success = {
  args: {
    variant: 'success',
    size: 'default',
    disabled: false,
    label: 'Success',
  },
};

export const Link = {
  args: {
    variant: 'link',
    size: 'default',
    disabled: false,
    label: 'Link Button',
  },
};

export const LinkDanger = {
  args: {
    variant: 'link-danger',
    size: 'default',
    disabled: false,
    label: 'Link Danger',
  },
};

export const Ghost = {
  args: {
    variant: 'ghost',
    size: 'default',
    disabled: false,
    label: 'Ghost',
  },
};

export const WithIconLeft = {
  args: {
    variant: 'primary',
    size: 'wide',
    disabled: false,
    label: 'With Icon Left',
    iconName: Icon24Check,
    iconLead: 'left',
  },
  render: (args) => ({
    Component: WideContainer,
    props: {
      width: '300px',
      childComponent: Button,
      childProps: args,
    },
  }),
};

export const WithIconCenter = {
  args: {
    variant: 'primary',
    size: 'wide',
    disabled: false,
    label: 'With Icon Center',
    iconName: Icon24Plus,
    iconLead: 'center',
  },
  render: (args) => ({
    Component: WideContainer,
    props: {
      width: '300px',
      childComponent: Button,
      childProps: args,
    },
  }),
};

export const SecondaryWithIcon = {
  args: {
    variant: 'secondary',
    size: 'default',
    disabled: false,
    label: 'Settings',
    iconName: Icon24Settings,
    iconLead: 'left',
  },
};
