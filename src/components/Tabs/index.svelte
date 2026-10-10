<script lang="ts">
  import Badge from '../Badge/index.svelte';

  type Tab = string | { label: string; badge?: string | number | null; unread?: boolean };

  interface Props {
    /** Strings, or `{ label, badge?, unread? }`: `badge` is a count beside the
     * label, `unread` marks that count as new. */
    tabs?: Tab[];
    selectedTab?: number;
    id?: string;
    /** IDs of the tabpanel elements, for aria-controls */
    panelIds?: string[];
    class?: string;
    /** The chosen tab's index, after `selectedTab` updates */
    onchange?: (index: number) => void;
  }

  let {
    tabs = [],
    selectedTab = $bindable(),
    id = 'tabs--' + (Math.random() * 10000000).toFixed(0).toString(),
    panelIds = [],
    class: className = '',
    onchange,
  }: Props = $props();

  let tablistElement: HTMLDivElement | undefined = $state();

  let items = $derived(tabs.map((tab) => (typeof tab === 'string' ? { label: tab } : tab)));
  let isSingleTab = $derived(tabs.length === 1);
  // Unset, the first tab is selected
  let current = $derived(selectedTab ?? 0);

  // UI3's "Badge small alt" carries three counter looks, and a tab picks one
  // from two axes at once — selected or not, new or not. New wins on either
  // tab, since that is what the blue count is for; otherwise the selected tab
  // gets the filled gray Default and the rest the quieter Count Inactive.
  function counterVariant(tab: { unread?: boolean }, selected: boolean) {
    if (tab.unread) return 'count'; // "Count New"
    return selected ? 'default' : 'count-inactive';
  }

  function handleTabClick(index: number) {
    selectedTab = index;
    onchange?.(index);
  }

  function handleKeydown(event: KeyboardEvent, index: number) {
    let newIndex: number;
    if (event.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') newIndex = 0;
    else if (event.key === 'End') newIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    handleTabClick(newIndex);

    const buttons = tablistElement?.querySelectorAll<HTMLElement>('[role="tab"]');
    if (buttons?.[newIndex]) buttons[newIndex].focus();
  }
</script>

<div bind:this={tablistElement} class="tabs-container {className}" role="tablist">
  {#each items as tab, index (index)}
    <button
      type="button"
      id="{id}-tab-{index}"
      class="tab"
      class:selected={index === current}
      class:single-tab={isSingleTab}
      onclick={() => handleTabClick(index)}
      onkeydown={(e) => handleKeydown(e, index)}
      aria-selected={index === current}
      aria-controls={panelIds[index] || undefined}
      tabindex={index === current ? 0 : -1}
      role="tab"
    >
      <span class="tab-text">{tab.label}</span>
      {#if tab.badge !== undefined && tab.badge !== null && tab.badge !== ''}
        <Badge
          variant={counterVariant(tab, index === current)}
          strong={!tab.unread && index === current}
          text={String(tab.badge)}
          ariaLabel={tab.unread ? `${tab.badge} new` : null}
        />
      {/if}
    </button>
  {/each}
</div>

<style>
  .tabs-container {
    display: flex;
    gap: var(--size-xxxsmall); /* 4px gap between tabs */
    align-items: center;
    font-family: var(--font-stack);
  }

  .tab {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-xxxsmall); /* 4px to a badge */
    height: var(--size-small); /* 24px height */
    padding: 0 var(--size-xxsmall); /* 8px horizontal padding */
    border-radius: var(--border-radius-medium); /* 5px */
    border: none;
    background-color: var(--figma-color-bg);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;
    flex-shrink: 0;
    min-width: 0; /* Allow text to truncate */
    font-family: var(--font-stack);
  }

  .tab-text {
    color: var(--figma-color-text-secondary);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    font-family: var(--font-stack);
  }

  /* Selected tab */
  .tab.selected {
    background-color: var(--figma-color-bg-secondary);
  }

  .tab.selected .tab-text {
    color: var(--figma-color-text);
    font-weight: var(--font-weight-strong); /* 550 - semi-bold */
  }

  /* Hover state */
  .tab:hover:not(.selected) {
    background-color: var(--figma-color-bg-hover);
  }

  .tab:hover:not(.selected) .tab-text {
    color: var(--figma-color-text);
  }

  /* Focus state - only show for keyboard navigation */
  .tab:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }

  /* Remove focus outline for mouse clicks */
  .tab:focus:not(:focus-visible) {
    outline: none;
  }

  /* Active state */
  .tab:active {
    background-color: var(--figma-color-bg-secondary);
  }

  /* Disabled state (if needed) */
  .tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab:disabled:hover {
    background-color: var(--figma-color-bg);
  }

  /* Single tab styling */
  .tab.single-tab .tab-text {
    color: var(--figma-color-text);
    font-weight: var(--font-weight-strong); /* 550 - semi-bold */
  }

  .tab.single-tab:hover .tab-text {
    color: var(--figma-color-text);
    font-weight: var(--font-weight-default); /* 450 - regular on hover */
  }
</style>
