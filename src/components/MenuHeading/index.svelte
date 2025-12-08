<script>
  export let text = '';
  export let alignment = 'default'; // 'default' | 'toggle'

  let className = '';
  export { className as class };
</script>

<div class="select-heading {className}" class:alignment-toggle={alignment === 'toggle'}>
  <span class="heading-text">{text}</span>
</div>

<style>
  .select-heading {
    height: var(--size-small);
    padding: 0 var(--size-xxsmall); /* 4px horizontal */
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .heading-text {
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    color: var(--color-text-menu-tertiary); /* #ffffff66 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Future alignment variants */
  .alignment-toggle {
    /* Toggle alignment styles can be added here when needed */
  }
</style>
