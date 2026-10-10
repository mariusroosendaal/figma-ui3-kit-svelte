<script lang="ts" module>
  // The open modals, the last opened on top: only it answers Escape and Tab,
  // so a confirmation over a modal closes alone.
  const openModals: object[] = [];
</script>

<script lang="ts">
  import { onDestroy, tick, type ComponentProps, type Snippet } from 'svelte';
  import ModalHeader from '../ModalHeader/index.svelte';
  import ModalFooter from '../ModalFooter/index.svelte';

  type Size = string | number;

  interface Props {
    isOpen?: boolean;
    title?: string;
    headerVariant?: 'default' | 'navigation' | 'tabs';
    /** Navigation header's back arrow */
    backAriaLabel?: string;
    /** Tabs header: as Tabs' `tabs` */
    headerTabs?: ComponentProps<typeof ModalHeader>['tabs'];
    /** Tabs header */
    selectedTab?: number;
    /** Tabs header: ids of the panels, for aria-controls */
    panelIds?: string[];
    icon2?: boolean;
    icon2Name?: string | null;
    /** Required whenever `icon2` is set (WCAG 4.1.2) */
    icon2AriaLabel?: string;
    footerVariant?: string;
    footerBorder?: boolean;
    showOverlay?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    /** Asked before X, Escape or a click outside closes the modal: return false,
     * or a promise of false, to keep it open (to confirm discarding edits, say). */
    beforeClose?: (() => boolean | Promise<boolean>) | null;
    /** "small" (240px), "medium" (320px), "large" (480px), a CSS length, or px */
    width?: Size;
    /** "auto" (hugs content), "50vh", "80vh", a CSS length, or px */
    height?: Size;
    position?: 'center' | 'left' | 'right' | 'bottom';
    /** The gap kept round the modal; "0px" for edge to edge */
    overlayPadding?: string;
    contentPadding?: boolean;
    class?: string;
    children?: Snippet;
    /** A control in place of the title, such as a Dropdown */
    header?: Snippet;
    footerLeft?: Snippet;
    footerRight?: Snippet;
    /** Across the footer, when there is no `footerLeft` or `footerRight` */
    footerFull?: Snippet;
    /** X, Escape or a click outside, once `beforeClose` allows it. `isOpen`
     * turns false a tick later unless the handler closed the modal itself. */
    onclose?: () => void;
    /** Navigation header's back arrow */
    onback?: (event: MouseEvent) => void;
    onicon2click?: (event: MouseEvent) => void;
    /** Tabs header: the chosen tab's index, after `selectedTab` updates */
    ontabchange?: (index: number) => void;
  }

  let {
    isOpen = $bindable(),
    title = '',
    headerVariant = 'default',
    backAriaLabel = 'Back',
    headerTabs = [],
    selectedTab = $bindable(),
    panelIds = [],
    icon2 = false,
    icon2Name = null,
    icon2AriaLabel = '',
    footerVariant = 'default',
    footerBorder = true,
    showOverlay = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    beforeClose = null,
    width = 'medium',
    height = 'auto',
    position = 'center',
    overlayPadding = '16px',
    contentPadding = true,
    class: className = '',
    children,
    header,
    footerLeft,
    footerRight,
    footerFull,
    onclose,
    onback,
    onicon2click,
    ontabchange,
  }: Props = $props();

  let modalElement: HTMLDivElement | undefined = $state();
  let previousActiveElement: HTMLElement | null = null;
  const self = {};
  let closing = false;
  let modalTitleId = 'modal-title--' + (Math.random() * 10000000).toFixed(0).toString();

  // Calculate modal width
  let modalWidth = $derived.by(() => {
    // For bottom position, default to full width minus padding
    if (
      position === 'bottom' &&
      typeof width === 'string' &&
      ['small', 'medium', 'large'].includes(width)
    ) {
      return `calc(100vw - 2 * ${overlayPadding})`;
    }

    if (typeof width === 'string') {
      switch (width) {
        case 'small':
          return '240px';
        case 'medium':
          return '320px';
        case 'large':
          return '480px';
        default:
          return width; // Custom string value
      }
    }
    return `${width}px`; // Number value
  });

  // Calculate modal height
  let modalHeight = $derived.by(() => {
    if (typeof height === 'string') {
      switch (height) {
        case 'auto':
          // For side panels, default to full height minus padding
          if (position === 'left' || position === 'right') {
            return `calc(100vh - 2 * ${overlayPadding})`;
          }
          return undefined; // No height constraint for center/bottom
        case '50vh':
          return '50vh';
        case '80vh':
          return '80vh';
        default:
          return height; // Custom string value
      }
    }
    return `${height}px`; // Number value
  });

  // Calculate modal max-height
  let modalMaxHeight = $derived(`calc(100vh - 2 * ${overlayPadding})`);

  // Calculate border-radius based on position and padding
  let modalBorderRadius = $derived.by(() => {
    // If no padding (edge-to-edge), remove border-radius for positioned modals
    if (overlayPadding === '0px' || overlayPadding === '0') {
      if (position === 'left' || position === 'right' || position === 'bottom') {
        return '0px';
      }
    }
    // Default border-radius for centered modals or when padding exists
    return 'var(--border-radius-large)';
  });

  function getFocusableElements() {
    if (!modalElement) return [];
    return Array.from(
      modalElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function handleOverlayClick(event: MouseEvent) {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      closeModal();
    }
  }

  const isTop = () => openModals[openModals.length - 1] === self;

  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen || !isTop()) return;

    if (event.key === 'Escape') {
      // Handled by a modal that has since closed, as a confirmation on top
      if (event.defaultPrevented) return;
      event.preventDefault();
      if (closeOnEscape) closeModal();
      return;
    }

    if (event.key === 'Tab') {
      const focusable = getFocusableElements();
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  async function closeModal() {
    if (closing) return;
    if (beforeClose) {
      closing = true;
      let close;
      try {
        close = await beforeClose();
      } finally {
        closing = false;
      }
      if (!close || !isOpen) return;
    }
    onclose?.();
    // Close it here only if the parent didn't. Writing the prop while the
    // parent's own update is in flight leaves Svelte 5.35+ deaf to the parent
    // reopening it when isOpen is an expression, such as `panel !== null`.
    await tick();
    if (isOpen) isOpen = false;
  }

  // Focus management and body scroll lock
  $effect.pre(() => {
    if (isOpen) {
      if (!openModals.includes(self)) openModals.push(self);
      previousActiveElement = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      tick().then(() => {
        if (!isOpen) return;
        const focusable = getFocusableElements();
        if (focusable.length) {
          focusable[0].focus();
        } else if (modalElement) {
          modalElement.setAttribute('tabindex', '-1');
          modalElement.focus();
        }
      });
    } else {
      removeFromStack();
      if (!openModals.length) document.body.style.overflow = '';
      // Not when it went with a modal underneath that closed too
      if (previousActiveElement?.isConnected) previousActiveElement.focus();
      previousActiveElement = null;
    }
  });

  function removeFromStack() {
    const index = openModals.indexOf(self);
    if (index !== -1) openModals.splice(index, 1);
  }

  // Unmounted while open, as by a parent's {#if}: undo the lock and focus
  // move that closing would have
  onDestroy(() => {
    if (!openModals.includes(self)) return;
    removeFromStack();
    if (!openModals.length) document.body.style.overflow = '';
    if (previousActiveElement?.isConnected) previousActiveElement.focus();
  });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <!-- Without an overlay the wrapper takes no box (display: contents). -->
  <div
    class={showOverlay ? `modal-overlay modal-overlay--${position}` : 'modal-bare'}
    style={showOverlay ? `padding: ${overlayPadding}` : undefined}
    onclick={showOverlay ? handleOverlayClick : undefined}
    role="presentation"
  >
    <div
      class="modal-container modal-container--{position} {className}"
      style="width: {modalWidth}; height: {modalHeight ||
        'auto'}; max-height: {modalMaxHeight}; border-radius: {modalBorderRadius}"
      bind:this={modalElement}
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
    >
      <ModalHeader
        {title}
        titleId={modalTitleId}
        variant={headerVariant}
        {icon2}
        {icon2Name}
        {icon2AriaLabel}
        {backAriaLabel}
        tabs={headerTabs}
        bind:selectedTab
        {panelIds}
        {header}
        {onicon2click}
        onclose={closeModal}
        {onback}
        {ontabchange}
      />

      <div class="modal-content" class:no-padding={!contentPadding}>
        {@render children?.()}
      </div>

      {#if footerLeft || footerRight || footerFull}
        <ModalFooter
          variant={footerVariant}
          border={footerBorder}
          useFullLayout={!!footerFull && !footerLeft && !footerRight}
          left={footerLeft}
          right={footerRight}
          full={footerFull}
        />
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-modal-backdrop);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  /* Position-based overlay alignment */
  .modal-overlay--center {
    align-items: center;
    justify-content: center;
  }

  .modal-overlay--left {
    align-items: stretch;
    justify-content: flex-start;
  }

  .modal-overlay--right {
    align-items: stretch;
    justify-content: flex-end;
  }

  .modal-overlay--bottom {
    align-items: flex-end;
    justify-content: center;
  }

  .modal-bare {
    display: contents;
  }

  .modal-container {
    background-color: var(--figma-color-bg);
    box-shadow: var(--elevation-500-modal-window);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .modal-content {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: var(--size-xsmall);
  }

  .modal-content.no-padding {
    padding: 0;
  }

  /* Responsive adjustments */
  /* @media (max-width: 480px) {
        .modal-overlay {
            padding: var(--size-xxsmall) !important; 
        }
        
        .modal-container {
            max-height: calc(100vh - 16px) !important; 
            width: 100% !important;
        }
    } */
</style>
