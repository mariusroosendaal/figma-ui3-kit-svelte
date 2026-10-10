<script context="module">
  // The open modals, the last opened on top: only it answers Escape and Tab,
  // so a confirmation over a modal closes alone.
  const openModals = [];
</script>

<script>
  import ModalHeader from '../ModalHeader/index.svelte';
  import ModalFooter from '../ModalFooter/index.svelte';
  import { createEventDispatcher, onDestroy, tick } from 'svelte';

  export let isOpen = false;
  export let title = '';
  export let headerVariant = 'default'; // 'default' | 'navigation' | 'tabs'
  export let onBack = null; // navigation header's back arrow; also fires `back`
  export let backAriaLabel = 'Back'; // navigation header's back arrow
  export let headerTabs = []; // tabs header: as Tabs' `tabs`
  export let selectedTab = 0; // tabs header: bindable
  export let panelIds = []; // tabs header: ids of the panels, for aria-controls
  export let icon2 = false;
  export let icon2Name = null;
  export let icon2AriaLabel = ''; // required whenever `icon2` is set (WCAG 4.1.2)
  export let onIcon2Click = null;
  export let footerVariant = 'default';
  export let footerBorder = true;
  export let showOverlay = true;
  export let closeOnOverlayClick = true;
  export let closeOnEscape = true;
  export let onClose = null;
  // Asked before X, Escape or a click outside closes the modal: return false,
  // or a promise of false, to keep it open (to confirm discarding edits, say).
  export let beforeClose = null;
  export let width = 'medium'; // "small" (240px), "medium" (320px), "large" (480px), or custom string
  export let height = 'auto'; // "auto" (hugs content), "50vh", "80vh", or custom string
  export let position = 'center'; // "center" (default), "left", "right", "bottom"
  export let overlayPadding = '16px'; // Controls padding/viewport constraint
  export let contentPadding = true; // Controls padding on content area

  let className = '';
  export { className as class };
  let modalElement;
  let previousActiveElement = null;
  const self = {};
  let closing = false;
  const dispatch = createEventDispatcher();
  let modalTitleId = 'modal-title--' + (Math.random() * 10000000).toFixed(0).toString();

  // Calculate modal width
  $: modalWidth = (() => {
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
  })();

  // Calculate modal height
  $: modalHeight = (() => {
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
  })();

  // Calculate modal max-height
  $: modalMaxHeight = `calc(100vh - 2 * ${overlayPadding})`;

  // Calculate border-radius based on position and padding
  $: modalBorderRadius = (() => {
    // If no padding (edge-to-edge), remove border-radius for positioned modals
    if (overlayPadding === '0px' || overlayPadding === '0') {
      if (position === 'left' || position === 'right' || position === 'bottom') {
        return '0px';
      }
    }
    // Default border-radius for centered modals or when padding exists
    return 'var(--border-radius-large)';
  })();

  function getFocusableElements() {
    if (!modalElement) return [];
    return Array.from(
      modalElement.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function handleOverlayClick(event) {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      closeModal();
    }
  }

  const isTop = () => openModals[openModals.length - 1] === self;

  function handleKeydown(event) {
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

  function handleIcon2Click(event) {
    if (onIcon2Click) {
      onIcon2Click(event);
    }
    dispatch('icon2Click', event);
  }

  function handleBack(event) {
    if (onBack) onBack(event);
    dispatch('back', event);
  }

  function handleTabChange(event) {
    selectedTab = event.detail;
    dispatch('tabChange', selectedTab);
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
    if (onClose) {
      onClose();
    }
    dispatch('close');
    // Close it here only if the parent didn't. Writing the prop while the
    // parent's own update is in flight leaves Svelte 5.35+ deaf to the parent
    // reopening it when isOpen is an expression, such as `panel !== null`.
    await tick();
    if (isOpen) isOpen = false;
  }

  // Focus management and body scroll lock
  $: if (typeof document !== 'undefined') {
    if (isOpen) {
      if (!openModals.includes(self)) openModals.push(self);
      previousActiveElement = document.activeElement;
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
  }

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

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <!-- Without an overlay the wrapper takes no box (display: contents). -->
  <div
    class={showOverlay ? `modal-overlay modal-overlay--${position}` : 'modal-bare'}
    style={showOverlay ? `padding: ${overlayPadding}` : undefined}
    on:click={showOverlay ? handleOverlayClick : undefined}
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
      {#if $$slots.header}
        <ModalHeader
          {title}
          titleId={modalTitleId}
          variant={headerVariant}
          {icon2}
          {icon2Name}
          {icon2AriaLabel}
          onIcon2Click={handleIcon2Click}
          onClose={closeModal}
          onBack={handleBack}
          {backAriaLabel}
        >
          <slot name="header" slot="title" />
        </ModalHeader>
      {:else}
        <ModalHeader
          {title}
          titleId={modalTitleId}
          variant={headerVariant}
          {icon2}
          {icon2Name}
          {icon2AriaLabel}
          onIcon2Click={handleIcon2Click}
          onClose={closeModal}
          onBack={handleBack}
          {backAriaLabel}
          tabs={headerTabs}
          {selectedTab}
          {panelIds}
          on:tabChange={handleTabChange}
        />
      {/if}

      <div class="modal-content" class:no-padding={!contentPadding}>
        <slot />
      </div>

      {#if $$slots['footer-left'] || $$slots['footer-right'] || $$slots['footer-full']}
        <ModalFooter
          variant={footerVariant}
          border={footerBorder}
          useFullLayout={$$slots['footer-full'] &&
            !$$slots['footer-left'] &&
            !$$slots['footer-right']}
        >
          <slot name="footer-left" slot="left" />
          <slot name="footer-right" slot="right" />
          <slot name="footer-full" slot="full" />
        </ModalFooter>
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
