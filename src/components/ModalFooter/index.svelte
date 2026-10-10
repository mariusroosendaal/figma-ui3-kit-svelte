<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: string;
    border?: boolean;
    /** Draws `full` across the footer in place of `left` and `right` */
    useFullLayout?: boolean;
    class?: string;
    left?: Snippet;
    right?: Snippet;
    full?: Snippet;
  }

  let {
    variant = 'default',
    border = true,
    useFullLayout = false,
    class: className = '',
    left,
    right,
    full,
  }: Props = $props();
</script>

<div class="modal-footer {className}" class:variant class:has-border={border}>
  {#if useFullLayout}
    <div class="modal-footer-full">
      {@render full?.()}
    </div>
  {:else}
    <div class="modal-footer-left">
      {@render left?.()}
    </div>

    <div class="modal-footer-right">
      {@render right?.()}
    </div>
  {/if}
</div>

<style>
  .modal-footer {
    position: relative;
    height: 40px;
    background-color: var(--figma-color-bg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--size-xxsmall);
  }
  .modal-footer :global(> *),
  .modal-footer :global(> * > *) {
    display: flex;
    gap: var(--size-xxsmall);
    align-items: center;
  }

  .modal-footer.has-border {
    border-top: 1px solid var(--figma-color-border);
  }

  .modal-footer-left {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .modal-footer-right {
    display: flex;
    align-items: center;
    gap: var(--size-xxsmall); /* 8px */
    margin-left: auto;
  }

  .modal-footer-full {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: var(--size-xxsmall); /* 8px */
  }

  .modal-footer-full > :global(*) {
    flex: 1;
  }
</style>
