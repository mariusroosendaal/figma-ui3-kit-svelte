import Modal from './index.svelte';
import ModalWrapper from '../../../.storybook/ModalWrapper.svelte';
import ModalHeaderSlotWrapper from '../../../.storybook/ModalHeaderSlotWrapper.svelte';

export default {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the modal is open',
    },
    title: {
      control: 'text',
      description: 'Modal title',
    },
    width: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Modal width',
    },
    height: {
      control: 'select',
      options: ['auto', '50vh', '80vh'],
      description: 'Modal height',
    },
    position: {
      control: 'select',
      options: ['center', 'left', 'right', 'bottom'],
      description: 'Modal position',
    },
    headerVariant: {
      control: 'select',
      options: ['default', 'blank', 'tabs', 'wide'],
      description: 'Header variant style',
    },
    footerVariant: {
      control: 'select',
      options: ['default'],
      description: 'Footer variant style',
    },
    footerBorder: {
      control: 'boolean',
      description: 'Show footer border',
    },
    showOverlay: {
      control: 'boolean',
      description: 'Show modal overlay',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Close modal when overlay is clicked',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Close modal when Escape key is pressed',
    },
    overlayPadding: {
      control: 'text',
      description: 'Overlay padding (e.g., "16px")',
    },
    contentPadding: {
      control: 'boolean',
      description: 'Enable content area padding',
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
    isOpen: false,
    title: 'Modal Title',
    width: 'medium',
    height: 'auto',
    position: 'center',
    headerVariant: 'default',
    footerVariant: 'default',
    footerBorder: true,
    showOverlay: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    overlayPadding: '16px',
    contentPadding: true,
  },
  render: (args) => ({
    Component: ModalWrapper,
    props: { ...args },
  }),
};

export const Small = {
  args: {
    isOpen: false,
    title: 'Small Modal',
    width: 'small',
    height: 'auto',
    position: 'center',
    headerVariant: 'default',
    footerVariant: 'default',
    footerBorder: true,
    showOverlay: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    overlayPadding: '16px',
    contentPadding: true,
  },
  render: (args) => ({
    Component: ModalWrapper,
    props: { ...args },
  }),
};

export const Large = {
  args: {
    isOpen: false,
    title: 'Large Modal',
    width: 'large',
    height: 'auto',
    position: 'center',
    headerVariant: 'default',
    footerVariant: 'default',
    footerBorder: true,
    showOverlay: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    overlayPadding: '16px',
    contentPadding: true,
  },
  render: (args) => ({
    Component: ModalWrapper,
    props: { ...args },
  }),
};

export const Bottom = {
  args: {
    isOpen: false,
    title: 'Bottom Modal',
    width: 'medium',
    height: 'auto',
    position: 'bottom',
    headerVariant: 'default',
    footerVariant: 'default',
    footerBorder: true,
    showOverlay: true,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    overlayPadding: '16px',
    contentPadding: true,
  },
  render: (args) => ({
    Component: ModalWrapper,
    props: { ...args },
  }),
};

// UI3's "Modal header" Navigation variant: a back arrow before the title
export const NavigationHeader = {
  args: { title: 'Export settings', headerVariant: 'navigation' },
  render: (args) => ({ Component: ModalWrapper, props: { ...args } }),
};

// Tabs variant: the dialog's tabs replace the title (which stays for screen readers)
export const TabsHeader = {
  args: {
    title: 'Libraries',
    headerVariant: 'tabs',
    headerTabs: ['Updates', 'Libraries', 'Analytics'],
    width: 'large',
  },
  render: (args) => ({ Component: ModalWrapper, props: { ...args } }),
};

// Dropdown variant: any control, through the `header` slot
export const DropdownHeader = {
  args: { title: 'Library' },
  render: (args) => ({ Component: ModalHeaderSlotWrapper, props: { ...args } }),
};
