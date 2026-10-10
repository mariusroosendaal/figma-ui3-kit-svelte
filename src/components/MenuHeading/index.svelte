<script lang="ts">
  interface Props {
    text?: string;
    alignment?: 'default' | 'toggle';
    class?: string;
  }

  let { text = '', alignment = 'default', class: className = '' }: Props = $props();
</script>

<div class="select-heading {className}" class:alignment-toggle={alignment === 'toggle'}>
  <span class="heading-text">{text}</span>
</div>

<style>
  .select-heading {
    height: var(--size-small);
    padding: 0 var(--size-xxsmall); /* 8px; with the menu's 8px, text sits 16px in */
    display: flex;
    align-items: center;
    overflow: hidden;
    user-select: none;
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
</style>
