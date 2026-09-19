<!--
  ModalHeader: UI3's "Modal header" — Default (title), Navigation (back arrow and
  title), Tabs (the dialog's tabs) and Dropdown (a control in place of the title,
  through the `title` slot). The title is always rendered, visually hidden when
  tabs or a slot replace it, so the dialog stays labelled.
-->
<script>
  import IconButton from '../IconButton/index.svelte';
  import Tabs from '../Tabs/index.svelte';
  import IconCloseSmall from '../../icons/24/icon.24.close.small.svg';
  import IconBack from '../../icons/24/icon.24.navigate.back.svg';
  import { createEventDispatcher } from 'svelte';

  export let title = '';
  export let titleId = null;
  export let variant = 'default'; // 'default' | 'navigation' | 'tabs'
  export let icon2 = false;
  export let icon2Name = null;
  export let icon2AriaLabel = '';
  export let onIcon2Click = null;
  export let onClose = null;
  /** Navigation variant: the back arrow. Also fires `back`. */
  export let onBack = null;
  export let backAriaLabel = 'Back';
  /** Tabs variant: as Tabs' `tabs`. */
  export let tabs = [];
  export let selectedTab = 0;
  export let tabsId = undefined;
  export let panelIds = [];

  let className = '';
  export { className as class };
  const dispatch = createEventDispatcher();

  $: replaced = $$slots.title || (variant === 'tabs' && tabs.length > 0);

  function handleIcon2Click(event) {
    if (onIcon2Click) onIcon2Click(event);
    dispatch('icon2Click', event);
  }

  function handleClose(event) {
    if (onClose) onClose(event);
    dispatch('close', event);
  }

  function handleBack(event) {
    if (onBack) onBack(event);
    dispatch('back', event);
  }

  function handleTabChange(index) {
    selectedTab = index;
    dispatch('tabChange', index);
  }
</script>

<div class="modal-header {className}" class:navigation={variant === 'navigation'} class:replaced>
  <div class="modal-header-lead">
    {#if variant === 'navigation'}
      <IconButton iconName={IconBack} ariaLabel={backAriaLabel} on:click={handleBack} />
    {/if}
    <h2 class="modal-header-title" class:visually-hidden={replaced} id={titleId || undefined}>
      {title}
    </h2>
    {#if $$slots.title}
      <slot name="title" />
    {:else if variant === 'tabs' && tabs.length > 0}
      <Tabs {tabs} {selectedTab} id={tabsId} {panelIds} onTabChange={handleTabChange} />
    {/if}
  </div>

  <div class="modal-header-icons">
    {#if icon2 && icon2Name}
      <IconButton
        iconName={icon2Name}
        ariaLabel={icon2AriaLabel}
        on:click={handleIcon2Click}
        variant="default"
      />
    {/if}
    <IconButton
      iconName={IconCloseSmall}
      on:click={handleClose}
      variant="default"
      ariaLabel="Close dialog"
    />
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
    gap: var(--size-xxsmall);
    padding: 0 var(--size-xxsmall) 0 var(--size-xsmall); /* 8px, 16px before a title */
  }

  /* A back arrow, tabs or a control start 8px in, as in UI3 */
  .modal-header.navigation,
  .modal-header.replaced {
    padding-left: var(--size-xxsmall);
  }

  .modal-header-lead {
    display: flex;
    flex: 1;
    align-items: center;
    gap: var(--size-xxsmall); /* 8px */
    min-width: 0;
  }

  .modal-header-title {
    margin: 0;
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

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
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
