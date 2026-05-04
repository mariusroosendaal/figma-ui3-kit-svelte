<script>
  import Icon from './../Icon/index.svelte';
  import IconWarning from './../../icons/16/icon.16.warning.svg';
  import IconInfo from './../../icons/16/icon.16.info.svg';
  import IconCheck from './../../icons/16/icon.16.check.svg';

  export let variant = 'danger'; // danger, warning, info, success
  export let message = ''; // Banner message (falls back to slot content if provided)

  let className = '';
  export { className as class };

  const variantLabels = {
    danger: 'Error:',
    warning: 'Warning:',
    info: 'Info:',
    success: 'Success:'
  };

  /** @type {'alert' | 'status'} */
  $: liveRole = variant === 'danger' ? 'alert' : 'status';
  /** @type {'assertive' | 'polite'} */
  $: livePolite = variant === 'danger' ? 'assertive' : 'polite';

  $: currentIcon = variant === 'info' ? IconInfo : variant === 'success' ? IconCheck : IconWarning;
</script>

<div
  class="banner {variant} {className}"
  role={liveRole}
  aria-live={livePolite}
  aria-atomic="true"
>
  <div class="banner-icon-container">
    <Icon iconName={currentIcon} color="--figma-color-icon" />
  </div>
  <div class="banner-content">
    <div class="banner-message">
      <span class="sr-only">{variantLabels[variant] ?? ''}</span>
      <slot>{message}</slot>
    </div>
  </div>
</div>

<style>
  /* Base banner styles */
  .banner {
    display: flex;
    align-items: flex-start;
    border-radius: var(--border-radius-medium); /* 5px */
    border: 1px solid transparent;
    padding: var(--size-xxsmall); /* 8px */
    gap: var(--size-xxsmall); /* 8px */
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
  }

  .banner-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .banner-content {
    display: flex;
    flex: 1;
    min-width: 0;
  }

  .banner-message {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Danger variant */
  .banner.danger {
    background-color: var(--figma-color-bg-danger-tertiary);
    color: var(--figma-color-text);
  }

  /* Warning variant */
  .banner.warning {
    background-color: var(--figma-color-bg-warning-tertiary);
    color: var(--figma-color-text);
  }

  /* Info variant */
  .banner.info {
    background-color: var(--figma-color-bg-brand-tertiary);
    color: var(--figma-color-text);
  }

  /* Success variant */
  .banner.success {
    background-color: var(--figma-color-bg-success-tertiary);
    color: var(--figma-color-text);
  }
</style>
