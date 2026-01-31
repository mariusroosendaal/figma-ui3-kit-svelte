<script>
  import Icon from '../Icon/index.svelte';
  import IconCheck from './../../icons/16/icon.16.check.svg';
  import IconChevronRight from './../../icons/24/icon.24.chevron.right.svg';

  export let id;
  export let selected = false;
  export let variant = 'default'; // "default" | "checkmark"
  export let hasSubMenu = false; // Whether this item has a nested sub-menu

  let className = '';
  export { className as class };
</script>

<li
  {id}
  tabindex={id + 1}
  class:highlight={selected}
  class={className}
  role="menuitem"
  on:mouseenter
  on:click
>
  {#if variant === 'checkmark'}
    <div class="lead">
      <div class="icon" class:selected>
        <Icon iconName={IconCheck} color="--color-icon-menu" />
      </div>
    </div>
  {:else if $$slots.lead}
    <div class="lead"><slot name="lead" /></div>
  {/if}
  <div class="label"><slot /></div>
  {#if hasSubMenu}
    <div class="trail">
      <Icon iconName={IconChevronRight} color="--color-icon-menu" />
    </div>
  {:else if $$slots.trail}
    <div class="trail"><slot name="trail" /></div>
  {/if}
</li>

<style>
  li {
    align-items: center;
    color: var(--color-text-menu); /* #ffffff */
    cursor: default;
    display: flex;
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    min-height: var(--size-small); /* 24px */
    padding: 0 var(--size-xxsmall); /* 8px horizontal, 0 vertical */
    user-select: none;
    outline: none;
    border-radius: var(--border-radius-medium); /* 5px */
  }

  /* Reduce left padding when checkmark icon is present */
  li:has(.lead > .icon) {
    padding-left: var(--size-xxxsmall); /* 4px when checkmark is present */
  }

  /* Remove right padding when trail icon is present */
  li:has(.trail) {
    padding-right: 0;
  }

  .label {
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    pointer-events: none;
  }

  .highlight,
  li:hover,
  li:focus {
    background-color: var(--color-bg-menu-selected); /* #0d99ff */
  }

  .lead {
    display: flex;
    align-items: center;
    margin-right: var(--size-xxxsmall); /* 8px */
    pointer-events: none;
  }

  .trail {
    display: flex;
    align-items: center;
    margin-left: auto;
    pointer-events: none;
  }

  .icon {
    width: var(--size-xsmall); /* 16px */
    height: var(--size-xsmall); /* 16px */
    opacity: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon.selected {
    opacity: 1;
  }
</style>
