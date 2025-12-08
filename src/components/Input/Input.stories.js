import Input from './index.svelte';
import Icon24Search from '../../icons/24/icon.24.search.small.svg';

export default {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
    invalid: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    value: {
      control: 'text',
    },
    errorMessage: {
      control: 'text',
    },
  },
};

export const Default = {
  args: {
    size: 'default',
    disabled: false,
    invalid: false,
    placeholder: 'Input something here...',
    value: '',
  },
};

export const WithValue = {
  args: {
    size: 'default',
    disabled: false,
    invalid: false,
    placeholder: 'Input something here...',
    value: 'Sample text',
  },
};

export const WithIcon = {
  args: {
    size: 'default',
    disabled: false,
    invalid: false,
    placeholder: 'Search...',
    value: '',
    iconName: Icon24Search,
  },
};

export const Large = {
  args: {
    size: 'large',
    disabled: false,
    invalid: false,
    placeholder: 'Large input...',
    value: '',
  },
};

export const Invalid = {
  args: {
    size: 'default',
    disabled: false,
    invalid: true,
    placeholder: 'Input something here...',
    value: 'Invalid input',
    errorMessage: 'This field is required',
  },
};

export const Disabled = {
  args: {
    size: 'default',
    disabled: true,
    invalid: false,
    placeholder: 'Disabled input...',
    value: 'Disabled value',
  },
};


