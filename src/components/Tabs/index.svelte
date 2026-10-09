<script>
  import Badge from '../Badge/index.svelte';

  /**
   * Strings, or `{ label, badge?, unread? }` — `badge` is a count beside the
   * label, `unread` marks that count as new.
   */
  export let tabs = [];
  export let selectedTab = 0;
  export let onTabChange = null;
  export let id = 'tabs--' + (Math.random() * 10000000).toFixed(0).toString();
  export let panelIds = []; // optional: IDs of tabpanel elements for aria-controls

  let className = '';
  export { className as class };
  let tablistElement;

  $: isSingleTab = tabs.length === 1;

  // UI3's "Badge small alt" carries three counter looks, and a tab picks one
  // from two axes at once — selected or not, new or not. New wins on either
  // tab, since that is what the blue count is for; otherwise the selected tab
  // gets the filled gray Default and the rest the quieter Count Inactive.
  function counterVariant(tab, selected) {
    if (tab.unread) return 'count'; // "Count New"
    return selected ? 'default' : 'count-inactive';
  }

  function handleTabClick(index) {
    selectedTab = index;
    if (onTabChange) onTabChange(index);
  }

  function handleKeydown(event, index) {
    let newIndex = null;
    if (event.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') newIndex = 0;
    else if (event.key === 'End') newIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    handleTabClick(newIndex);

    const buttons = tablistElement?.querySelectorAll('[role="tab"]');
    if (buttons?.[newIndex]) buttons[newIndex].focus();
  }
</script>

<div bind:this={tablistElement} class="tabs-container {className}" role="tablist">
  {#each tabs as tab, index (index)}
    <button
      type="button"
      id="{id}-tab-{index}"
      class="tab"
      class:selected={index === selectedTab}
      class:single-tab={isSingleTab}
      on:click={() => handleTabClick(index)}
      on:keydown={(e) => handleKeydown(e, index)}
      aria-selected={index === selectedTab}
      aria-controls={panelIds[index] || undefined}
      tabindex={index === selectedTab ? 0 : -1}
      role="tab"
    >
      <span class="tab-text">{tab.label || tab}</span>
      {#if tab.badge !== undefined && tab.badge !== null && tab.badge !== ''}
        <Badge
          variant={counterVariant(tab, index === selectedTab)}
          strong={!tab.unread && index === selectedTab}
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
