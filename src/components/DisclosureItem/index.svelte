<script lang="ts" module>
  export const disclosure = {};

  export interface DisclosureContext {
    readonly selected: ReadonlySet<string>;
    clickHandler(itemId: string): void;
    open(itemId: string): void;
  }
</script>

<script lang="ts">
  import { getContext, onMount, hasContext, untrack, type Snippet } from 'svelte';
  import Icon from './../Icon/index.svelte';
  import ChevronRight from './../../icons/16/icon.16.chevron.right.svg';
  import ChevronDown from './../../icons/16/icon.16.chevron.down.svg';

  interface Props {
    uniqueId?: string;
    title?: string | null;
    /** Whether it is open; bind it to follow a standalone item */
    expanded?: boolean;
    section?: boolean;
    /** Open at first */
    open?: boolean;
    /** Opens and closes on its own, even inside a Disclosure */
    standalone?: boolean;
    class?: string;
    /** What it shows when open */
    children?: Snippet;
    /** A standalone item, after it opens or closes */
    ontoggle?: (detail: { expanded: boolean; uniqueId: string }) => void;
  }

  let {
    uniqueId = 'disclosureItem--' + (Math.random() * 10000000).toFixed(0).toString(),
    title = null,
    expanded = $bindable(),
    section = false,
    open = false,
    standalone = false,
    class: className = '',
    children,
    ontoggle,
  }: Props = $props();

  // Check if we're inside a Disclosure wrapper
  const inDisclosureContext = hasContext(disclosure);
  const isStandalone = untrack(() => standalone) || !inDisclosureContext;

  const context = inDisclosureContext ? getContext<DisclosureContext>(disclosure) : null;
  let internalExpanded = $state(untrack(() => open));

  let isExpanded = $derived(
    isStandalone ? internalExpanded : context ? context.selected.has(uniqueId) : false
  );

  // Standalone, the item keeps its own state and reports it through bind:expanded
  $effect.pre(() => {
    if (isStandalone) expanded = internalExpanded;
  });

  // Set initial open state
  onMount(() => {
    if (open && !isStandalone && context) context.open(uniqueId);
  });

  // Click handler
  function handleClick() {
    if (isStandalone) {
      // Standalone mode: toggle internal state
      internalExpanded = !internalExpanded;
      ontoggle?.({ expanded: internalExpanded, uniqueId });
    } else if (context) {
      // Context mode: use the wrapper's click handler
      context.clickHandler(uniqueId);
    }
  }
</script>

<li id={uniqueId} class={className} class:expanded={isExpanded} data-open={open} data-title={title}>
  <button
    type="button"
    onclick={handleClick}
    aria-expanded={isExpanded}
    aria-controls="{uniqueId}-content"
    class="header"
    class:section
  >
    <div class="icon" aria-hidden="true">
      {#if isExpanded}
        <Icon iconName={ChevronDown} size={16} />
      {:else}
        <Icon iconName={ChevronRight} size={16} />
      {/if}
    </div>
    <div class="title">{title ?? ''}</div>
  </button>
  <div class="content" id="{uniqueId}-content" hidden={!isExpanded}>
    {@render children?.()}
  </div>
</li>

<style>
  li {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style-type: none;
    user-select: none;
  }

  .header {
    display: flex;
    align-items: center;
    width: 100%;
    height: var(--size-small);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    color: var(--figma-color-text);
    border-radius: var(--border-radius-medium);
    border: 1px solid transparent;
    background: none;
    gap: var(--size-xxsmall);
    padding: 0 var(--size-xxsmall);
    cursor: pointer;
    text-align: left;
  }
  .header:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }
  .header:focus:not(:focus-visible) {
    outline: none;
  }
  .header:hover {
    background: var(--figma-color-bg-secondary);
  }
  .header:hover .icon {
    opacity: 0.9;
  }

  .title {
    margin-left: -4px;
    user-select: none;
  }

  .icon {
    margin-left: -4px;
    opacity: 0.3;
  }
  .expanded .icon {
    opacity: 0.8;
  }

  .section {
    font-weight: var(--font-weight-strong);
  }

  .content {
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    color: var(--figma-color-text);
    padding: var(--size-xxsmall) 0 var(--size-xxsmall) var(--size-small);
  }
</style>
