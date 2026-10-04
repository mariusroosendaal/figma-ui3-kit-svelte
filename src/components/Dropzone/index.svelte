<!--
  Dropzone: a dashed area that takes files dropped on it or picked through
  its button, as on Figma's publish screen. It fires `files` with the files
  that match `accept` and `reject` with the rest; reading them is the
  parent's job.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Button from '../Button/index.svelte';
  import Icon from '../Icon/index.svelte';
  import IconImage from '../../icons/24/icon.24.image.svg';

  /** The file input's accept list: MIME types, `image/*` wildcards or `.ext` */
  export let accept = '';
  export let multiple = true;
  export let buttonLabel = 'Choose files';
  /** A line under the button, such as the accepted formats */
  export let hint = '';
  /** The illustration; null for none */
  export let iconName = IconImage;
  export let disabled = false;
  export let invalid = false;
  export let errorMessage = '';
  export let id = null;
  export let ariaLabel = '';
  /**
   * One row with no illustration, for when files are already in and listed
   * below: the button turns secondary, leaving the primary action to the page.
   */
  export let compact = false;

  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();
  const uid = id || 'dropzone--' + (Math.random() * 10000000).toFixed(0);
  const hintId = uid + '-hint';
  const errorId = uid + '-error';

  let input;
  // dragenter and dragleave fire for every child the pointer crosses, so
  // count them rather than flip a flag.
  let depth = 0;
  $: dragging = depth > 0 && !disabled;

  $: acceptList = accept
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);

  /** @param {File} file */
  function matches(file) {
    if (acceptList.length === 0) return true;
    const name = file.name.toLowerCase();
    const type = (file.type || '').toLowerCase();
    return acceptList.some((a) => {
      if (a.startsWith('.')) return name.endsWith(a);
      if (a.endsWith('/*')) return type.startsWith(a.slice(0, -1));
      return type === a;
    });
  }

  /** @param {File[]} all */
  function take(all) {
    if (all.length === 0) return;
    const accepted = all.filter(matches);
    const rejected = all.filter((f) => !matches(f));
    const files = multiple ? accepted : accepted.slice(0, 1);
    if (files.length > 0) dispatch('files', { files });
    if (rejected.length > 0) dispatch('reject', { files: rejected });
  }

  /** @param {DragEvent} e */
  function carriesFiles(e) {
    return Array.from(e.dataTransfer?.types || []).includes('Files');
  }

  /** @param {DragEvent} e */
  function handleDragEnter(e) {
    if (disabled || !carriesFiles(e)) return;
    e.preventDefault();
    depth += 1;
  }

  /** @param {DragEvent} e */
  function handleDragOver(e) {
    if (disabled || !carriesFiles(e)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  }

  function handleDragLeave() {
    depth = Math.max(0, depth - 1);
  }

  /** @param {DragEvent} e */
  function handleDrop(e) {
    if (!carriesFiles(e)) return;
    e.preventDefault();
    depth = 0;
    if (disabled || !e.dataTransfer) return;
    // A dropped folder arrives as a file that can't be read, so it's left out
    const files = Array.from(e.dataTransfer.items)
      .filter((item) => item.kind === 'file' && !item.webkitGetAsEntry?.()?.isDirectory)
      .map((item) => item.getAsFile())
      .filter(Boolean);
    take(files);
  }

  /** @param {HTMLInputElement} picker */
  function handleChange(picker) {
    take(Array.from(picker.files || []));
    // Picking the same file again still fires change
    picker.value = '';
  }

  $: describedBy = [hint ? hintId : '', invalid && errorMessage ? errorId : '']
    .filter(Boolean)
    .join(' ');
</script>

<div class="dropzone-wrapper {className}">
  <div
    class="dropzone"
    class:dragging
    class:invalid
    class:disabled
    class:compact
    role="group"
    aria-label={ariaLabel || undefined}
    aria-describedby={describedBy || undefined}
    on:dragenter={handleDragEnter}
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
  >
    {#if !compact}
      <slot>
        {#if iconName}
          <Icon
            {iconName}
            size={48}
            color={disabled ? '--figma-color-icon-disabled' : '--figma-color-icon-tertiary'}
            class="dropzone__icon"
          />
        {/if}
      </slot>
    {/if}
    <Button variant={compact ? 'secondary' : 'primary'} {disabled} on:click={() => input.click()}
      >{buttonLabel}</Button
    >
    {#if hint}
      <span class="hint" id={hintId}>{hint}</span>
    {/if}
    <input
      bind:this={input}
      id={uid}
      type="file"
      accept={accept || undefined}
      {multiple}
      {disabled}
      tabindex="-1"
      aria-hidden="true"
      on:change={() => handleChange(input)}
    />
  </div>
  {#if invalid && errorMessage}
    <div class="error" id={errorId}>{errorMessage}</div>
  {/if}
</div>

<style>
  /* Given a height through `class`, the dashed area fills it */
  .dropzone-wrapper {
    display: flex;
    flex-direction: column;
  }

  .dropzone {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--size-xxsmall);
    padding: var(--size-small) var(--size-xsmall);
    border: 1px dashed var(--figma-color-border-strong);
    border-radius: var(--border-radius-medium);
    background-color: transparent;
    transition:
      background-color 0.1s,
      border-color 0.1s;
  }

  .dropzone.compact {
    flex-direction: row;
    flex-wrap: wrap;
    padding: var(--size-xxsmall);
  }

  .dropzone.dragging {
    border-color: var(--figma-color-border-selected);
    background-color: var(--figma-color-bg-selected);
  }

  .dropzone.invalid {
    border-color: var(--figma-color-border-danger-strong);
  }

  .dropzone.disabled {
    border-color: var(--figma-color-border-disabled-strong);
  }

  /* The icons are drawn at 24px; the illustration scales one up */
  .dropzone :global(.dropzone__icon svg) {
    width: 100%;
    height: 100%;
  }

  .hint {
    color: var(--figma-color-text-secondary);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    text-align: center;
  }

  .disabled .hint {
    color: var(--figma-color-text-disabled);
  }

  input {
    display: none;
  }

  .error {
    color: var(--figma-color-text-danger);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    padding-top: var(--size-xxxsmall);
  }
</style>
