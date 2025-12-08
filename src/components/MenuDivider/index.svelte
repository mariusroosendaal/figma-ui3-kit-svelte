<script>
  let className = '';
  export { className as class };
</script>

<div class="divider {className}">
  <div class="line"></div>
</div>

<style>
  .divider {
    height: var(--size-xsmall); /* 16px */
    display: flex;
    align-items: center;
    overflow: hidden;
    margin-left: calc(-1 * var(--size-xxsmall)); /* -8px */
    margin-right: calc(-1 * var(--size-xxsmall)); /* -8px */
  }

  .line {
    width: 100%;
    height: 1px;
    background-color: var(--color-border-menu); /* #383838 */
    border-radius: 2px;
  }
</style>