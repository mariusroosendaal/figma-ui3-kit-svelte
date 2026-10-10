<!--
  ModalHeader: UI3's "Modal header" — Default (title), Navigation (back arrow and
  title), Tabs (the dialog's tabs) and Dropdown (a control in place of the title,
  through the `header` snippet). The title is always rendered, visually hidden when
  tabs or the snippet replace it, so the dialog stays labelled.
-->
<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import IconButton from '../IconButton/index.svelte';
  import Tabs from '../Tabs/index.svelte';
  import IconCloseSmall from '../../icons/24/icon.24.close.small.svg';
  import IconBack from '../../icons/24/icon.24.navigate.back.svg';

  interface Props {
    title?: string;
    titleId?: string | null;
    variant?: 'default' | 'navigation' | 'tabs';
    icon2?: boolean;
    /** SVG icon data, for a second icon button by the close button */
    icon2Name?: string | null;
    /** Required whenever `icon2` is set (WCAG 4.1.2) */
    icon2AriaLabel?: string;
    /** Navigation variant: the back arrow's name */
    backAriaLabel?: string;
    /** Tabs variant: as Tabs' `tabs`. */
    tabs?: ComponentProps<typeof Tabs>['tabs'];
    selectedTab?: number;
    tabsId?: string;
    panelIds?: string[];
    class?: string;
    /** A control in place of the title, such as a Dropdown; the title stays for screen readers */
    header?: Snippet;
    onicon2click?: (event: MouseEvent) => void;
    onclose?: () => void;
    /** Navigation variant: the back arrow */
    onback?: (event: MouseEvent) => void;
    /** Tabs variant: the chosen tab's index, after `selectedTab` updates */
    ontabchange?: (index: number) => void;
  }

  let {
    title = '',
    titleId = null,
    variant = 'default',
    icon2 = false,
    icon2Name = null,
    icon2AriaLabel = '',
    backAriaLabel = 'Back',
    tabs = [],
    selectedTab = $bindable(),
    tabsId = undefined,
    panelIds = [],
    class: className = '',
    header,
    onicon2click,
    onclose,
    onback,
    ontabchange,
  }: Props = $props();

  let replaced = $derived(!!header || (variant === 'tabs' && tabs.length > 0));

  function handleTabChange(index: number) {
    selectedTab = index;
    ontabchange?.(index);
  }
</script>

<div class="modal-header {className}" class:navigation={variant === 'navigation'} class:replaced>
  <div class="modal-header-lead">
    {#if variant === 'navigation'}
      <IconButton iconName={IconBack} ariaLabel={backAriaLabel} onclick={(e) => onback?.(e)} />
    {/if}
    <h2 class="modal-header-title" class:visually-hidden={replaced} id={titleId || undefined}>
      {title}
    </h2>
    {#if header}
      {@render header()}
    {:else if variant === 'tabs' && tabs.length > 0}
      <Tabs {tabs} {selectedTab} id={tabsId} {panelIds} onchange={handleTabChange} />
    {/if}
  </div>

  <div class="modal-header-icons">
    {#if icon2 && icon2Name}
      <IconButton
        iconName={icon2Name}
        ariaLabel={icon2AriaLabel}
        onclick={(e) => onicon2click?.(e)}
        variant="default"
      />
    {/if}
    <IconButton
      iconName={IconCloseSmall}
      onclick={() => onclose?.()}
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
