<!--
  Avatar: UI3's "Avatar" — a person (photo, or their initial on a multiplayer
  color), an organization's image, or an overflow count ("+3").

  Without a `color`, one is picked from the name, so the same person keeps the
  same color. `count` draws the overflow avatar (blue when `unread`).
-->
<script>
  export let name = '';
  /** @type {string | null} photo or organization image URL */
  export let src = null;
  /** @type {'purple' | 'blue' | 'pink' | 'red' | 'yellow' | 'green' | 'grey' | null} */
  export let color = null;
  /** @type {'small' | 'default' | 'large'} 16, 24 or 32px */
  export let size = 'default';
  /** @type {'circle' | 'square'} */
  export let shape = 'circle';
  /** @type {number | null} overflow avatar, e.g. 3 more people */
  export let count = null;
  export let unread = false;
  export let disabled = false;
  /** Only when the tooltip is the wrong name; by default the tooltip names it
   * (the name, or "N more" for a count) and doubling the two reads twice. */
  export let ariaLabel = '';

  let className = '';
  export { className as class };

  const COLORS = ['purple', 'blue', 'pink', 'red', 'yellow', 'green', 'grey'];

  $: hash = [...(name || '')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  $: hue = color ?? COLORS[hash % COLORS.length];
  $: initial = (name || '').trim().charAt(0).toUpperCase();
  $: overflow = count !== null && count !== undefined;
  // The tooltip names the avatar on its own, so `aria-label` is only set when
  // the caller wants a different one — otherwise both are read out.
  $: tooltip = (overflow ? `${count} more` : name) || undefined;
  $: label = ariaLabel || tooltip;
  // A broken image falls back to the initial; a new src tries again.
  let failed = false;
  $: resetFailed(src);
  function resetFailed(_src) {
    failed = false;
  }
</script>

<span
  class="avatar {size} {shape} {className}"
  class:disabled
  class:overflow
  class:unread={overflow && unread}
  style:--avatar-bg={overflow || disabled ? null : `var(--color-multiplayer-${hue})`}
  style:--avatar-text={overflow || disabled
    ? null
    : hue === 'yellow'
      ? 'var(--color-text-on-multiplayer-yellow)'
      : 'var(--color-text-on-multiplayer)'}
  role={label ? 'img' : undefined}
  aria-label={ariaLabel || undefined}
  title={tooltip}
>
  {#if src && !failed && !overflow}
    <img {src} alt="" on:error={() => (failed = true)} />
  {:else}
    <span class="text" aria-hidden="true">{overflow ? count : initial}</span>
  {/if}
</span>

<style>
  .avatar {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--size-small); /* 24px */
    height: var(--size-small);
    overflow: hidden;
    background-color: var(--avatar-bg);
    color: var(--avatar-text);
    font-family: var(--font-stack);
    font-size: var(--body-large-font-size);
    font-weight: var(--body-large-font-weight);
    letter-spacing: var(--body-large-letter-spacing);
    line-height: 1;
    user-select: none;
  }

  .avatar.small {
    width: var(--size-xsmall); /* 16px */
    height: var(--size-xsmall);
    font-size: var(--body-small-font-size);
    font-weight: var(--font-weight-strong);
    letter-spacing: var(--body-small-letter-spacing);
  }

  .avatar.large {
    width: var(--size-medium); /* 32px */
    height: var(--size-medium);
    font-weight: var(--font-weight-strong);
  }

  .avatar.circle {
    border-radius: 50%;
  }

  .avatar.square {
    border-radius: var(--border-radius-medium);
  }

  .avatar.square.small {
    border-radius: var(--border-radius-small);
  }

  .avatar.disabled {
    background-color: var(--figma-color-bg-tertiary);
    color: var(--figma-color-text);
  }

  .avatar.overflow {
    background-color: var(--figma-color-bg-secondary);
    color: var(--figma-color-text);
  }

  .avatar.overflow.unread {
    background-color: var(--figma-color-bg-brand-secondary);
    color: var(--figma-color-text-onbrand);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .text {
    pointer-events: none;
  }
</style>
