<script>
  import IconButton from '../IconButton/index.svelte';
  import IconCloseSmall from '../../icons/24/icon.24.close.small.svg';
  import { createEventDispatcher } from 'svelte';

  export let title = 'Title';
  export let variant = 'default'; // "default", "blank", "tabs", "wide"
  export let icon2 = false;
  export let icon2Name = null;
  export let onIcon2Click = null;
  export let onClose = null;

  let className = '';
  export { className as class };
  const dispatch = createEventDispatcher();

  function handleIcon2Click(event) {
    if (onIcon2Click) {
      onIcon2Click(event);
    }
    dispatch('icon2Click', event);
  }

  function handleClose(event) {
    if (onClose) {
      onClose(event);
    }
    dispatch('close', event);
  }
</script>

<div class="modal-header {className}">
  <div class="modal-header-title">
    {title}
  </div>

  <div class="modal-header-icons">
    {#if icon2 && icon2Name}
      <IconButton iconName={icon2Name} on:click={handleIcon2Click} variant="default" />
    {/if}
    <IconButton iconName={IconCloseSmall} on:click={handleClose} variant="default" />
  </div>

  <div class="modal-header-border"></div>
</div>

<style>
  .modal-header {
    position: relative;
    height: 40px; /* var(--size-small) + var(--size-xsmall) */
    background-color: var(--figma-color-bg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--size-xxsmall) 0 var(--size-xsmall); /* 8px */
  }

  .modal-header-title {
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--font-weight-strong);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    color: var(--figma-color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  .modal-header-icons {
    display: flex;
    align-items: center;
    gap: var(--size-xxsmall); /* 8px */
    flex-shrink: 0;
  }

  .modal-header-border {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: var(--figma-color-border);
  }
</style>
