<!--
  VariablePill: UI3's "Chip variable" — the pill Figma shows in place of a value
  that is bound to a variable. Display only; put it in a button to make it act.

  States: `selected` (the pill itself is picked), `onSelected` (it sits in a
  field or row that is selected), `muted` (soft-deleted, or its value isn't
  rendered) and `disabled`.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    label?: string | null;
    selected?: boolean;
    /** Sits in a field or row that is selected */
    onSelected?: boolean;
    muted?: boolean;
    disabled?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    label = '',
    selected = false,
    onSelected = false,
    muted = false,
    disabled = false,
    class: className = '',
    children,
  }: Props = $props();
</script>

<span
  class="variable-pill {className}"
  class:selected
  class:on-selected={onSelected && !selected}
  class:muted
  class:disabled
  title={label}
>
  <span class="label"
    >{#if children}{@render children()}{:else}{label}{/if}</span
  >
</span>

<style>
  .variable-pill {
    display: inline-flex;
    flex: 0 1 auto;
    align-items: center;
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    height: var(--size-xsmall); /* 16px */
    padding: 0 var(--size-xxxsmall); /* 4px */
    border: 1px solid var(--figma-color-border);
    border-radius: var(--border-radius-medium);
    background-color: var(--figma-color-bg);
    color: var(--figma-color-text);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    user-select: none;
  }

  .label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .selected {
    border-color: var(--figma-color-border-selected);
    background-color: var(--figma-color-bg-selected);
  }

  .on-selected {
    border-color: var(--figma-color-border-onselected);
    background-color: var(--figma-color-bg-onselected);
  }

  .muted {
    background-color: var(--figma-color-bg-secondary);
  }

  .disabled {
    border-color: var(--figma-color-border-disabled);
    background-color: var(--figma-color-bg-secondary);
    color: var(--figma-color-text-disabled);
  }
</style>
