<script>
  import ModalHeader from '../ModalHeader/index.svelte';
  import ModalFooter from '../ModalFooter/index.svelte';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let isOpen = false;
  export let title = 'Modal Title';
  export let headerVariant = 'default';
  export let icon2 = false;
  export let icon2Name = null;
  export let onIcon2Click = null;
  export let footerVariant = 'default';
  export let footerBorder = true;
  export let showOverlay = true;
  export let closeOnOverlayClick = true;
  export let closeOnEscape = true;
  export let onClose = null;
  export let width = 'medium'; // "small" (240px), "medium" (320px), "large" (480px), or custom string
  export let height = 'auto'; // "auto" (hugs content), "50vh", "80vh", or custom string
  export let position = 'center'; // "center" (default), "left", "right", "bottom"
  export let overlayPadding = '16px'; // Controls padding/viewport constraint
  export let contentPadding = true; // Controls padding on content area

  let className = '';
  export { className as class };
  let modalElement;
  const dispatch = createEventDispatcher();

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

  function handleOverlayClick(event) {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleEscapeKey(event) {
    if (closeOnEscape && event.key === 'Escape') {
      closeModal();
    }
  }

  function handleIcon2Click(event) {
    if (onIcon2Click) {
      onIcon2Click(event);
    }
    dispatch('icon2Click', event);
  }

  function closeModal() {
    if (onClose) {
      onClose();
    }
    dispatch('close');
    isOpen = false;
  }

  // Handle ESC key
  onMount(() => {
    if (closeOnEscape) {
      document.addEventListener('keydown', handleEscapeKey);
    }
  });

  onDestroy(() => {
    if (closeOnEscape) {
      document.removeEventListener('keydown', handleEscapeKey);
    }
  });

  // Body scroll lock when modal is open
  $: if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
</script>

{#if isOpen}
  {#if showOverlay}
    <div
      class="modal-overlay modal-overlay--{position}"
      style="padding: {overlayPadding}"
      on:click={handleOverlayClick}
      on:keydown={handleEscapeKey}
      role="presentation"
    >
      <div
        class="modal-container modal-container--{position} {className}"
        style="width: {modalWidth}; height: {modalHeight ||
          'auto'}; max-height: {modalMaxHeight}; border-radius: {modalBorderRadius}"
        bind:this={modalElement}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <ModalHeader
          {title}
          variant={headerVariant}
          {icon2}
          {icon2Name}
          onIcon2Click={handleIcon2Click}
          onClose={closeModal}
        />

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
  {:else}
    <div
      class="modal-container modal-container--{position} {className}"
      style="width: {modalWidth}; height: {modalHeight ||
        'auto'}; max-height: {modalMaxHeight}; border-radius: {modalBorderRadius}"
      bind:this={modalElement}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <ModalHeader
        {title}
        variant={headerVariant}
        {icon2}
        {icon2Name}
        onIcon2Click={handleIcon2Click}
        onClose={closeModal}
      />

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
  {/if}
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

  .modal-container {
    background-color: var(--figma-color-bg);
    box-shadow:
      0 0 0.5px rgba(0, 0, 0, 0.08),
      0 2px 5px rgba(0, 0, 0, 0.15),
      0 10px 24px rgba(0, 0, 0, 0.18);
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
