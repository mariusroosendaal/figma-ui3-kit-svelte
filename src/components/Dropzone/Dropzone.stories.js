import Dropzone from './index.svelte';

export default {
  title: 'Components/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  argTypes: {
    accept: {
      control: 'text',
      description: 'Accepted MIME types, image/* wildcards or .ext, comma-separated',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether more than one file can be taken at a time',
    },
    compact: {
      control: 'boolean',
      description: 'One row with no illustration, for when files are listed below it',
    },
    buttonLabel: {
      control: 'text',
      description: 'The button label',
    },
    hint: {
      control: 'text',
      description: 'A line under the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the dropzone is disabled',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the dropzone is in an invalid state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when invalid',
    },
    iconName: {
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
};

export const Default = {
  args: {
    accept: 'image/png,image/jpeg,image/gif',
    multiple: true,
    buttonLabel: 'Choose images',
    hint: 'Or drop PNG, JPEG or GIF files here',
    disabled: false,
    invalid: false,
  },
};

export const Invalid = {
  args: {
    accept: 'image/png,image/jpeg,image/gif',
    buttonLabel: 'Upload image',
    invalid: true,
    errorMessage: 'You must set a thumbnail for your resource',
  },
};

export const Disabled = {
  args: {
    buttonLabel: 'Choose files',
    disabled: true,
  },
};

export const Compact = {
  args: {
    accept: '.md,image/png,image/jpeg,image/gif',
    buttonLabel: 'Choose files',
    hint: 'or drop more here',
    compact: true,
  },
};
