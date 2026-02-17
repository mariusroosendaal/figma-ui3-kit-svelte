<script>
  export let variant = 'default';
  export let border = true;
  export let useFullLayout = false;

  let className = '';
  export { className as class };
</script>

<div class="modal-footer {className}" class:variant class:has-border={border}>
  {#if useFullLayout}
    <div class="modal-footer-full">
      <slot name="full" />
    </div>
  {:else}
    <div class="modal-footer-left">
      <slot name="left" />
    </div>

    <div class="modal-footer-right">
      <slot name="right" />
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
