<!--
  Dropzone: a dashed area that takes files dropped on it or picked through
  its button, as on Figma's publish screen. It calls `onfiles` with the files
  that match `accept` and `onreject` with the rest; reading them is the
  parent's job.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Button from '../Button/index.svelte';
  import Icon from '../Icon/index.svelte';
  import IconImage from '../../icons/24/icon.24.image.svg';

  interface Props {
    /** The file input's accept list: MIME types, `image/*` wildcards or `.ext` */
    accept?: string;
    multiple?: boolean;
    buttonLabel?: string;
    /** A line under the button, such as the accepted formats */
    hint?: string;
    /** The illustration; null for none */
    iconName?: string | null;
    disabled?: boolean;
    invalid?: boolean;
    errorMessage?: string;
    id?: string | null;
    ariaLabel?: string;
    /**
     * One row with no illustration, for when files are already in and listed
     * below: the button turns secondary, leaving the primary action to the page.
     */
    compact?: boolean;
    class?: string;
    /** In place of the illustration */
    children?: Snippet;
    /** The files that match `accept`; one unless `multiple` */
    onfiles?: (detail: { files: File[] }) => void;
    /** The files that don't match `accept` */
    onreject?: (detail: { files: File[] }) => void;
  }

  let {
    accept = '',
    multiple = true,
    buttonLabel = 'Choose files',
    hint = '',
    iconName = IconImage,
    disabled = false,
    invalid = false,
    errorMessage = '',
    id = null,
    ariaLabel = '',
    compact = false,
    class: className = '',
    children,
    onfiles,
    onreject,
  }: Props = $props();

  const fallbackId = 'dropzone--' + (Math.random() * 10000000).toFixed(0);
  let uid = $derived(id || fallbackId);
  let hintId = $derived(uid + '-hint');
  let errorId = $derived(uid + '-error');

  let input: HTMLInputElement | undefined = $state();
  // dragenter and dragleave fire for every child the pointer crosses, so
  // count them rather than flip a flag.
  let depth = $state(0);
  let dragging = $derived(depth > 0 && !disabled);

  let acceptList = $derived(
    accept
      .split(',')
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean)
  );

  function matches(file: File) {
    if (acceptList.length === 0) return true;
    const name = file.name.toLowerCase();
    const type = (file.type || '').toLowerCase();
    return acceptList.some((a) => {
      if (a.startsWith('.')) return name.endsWith(a);
      if (a.endsWith('/*')) return type.startsWith(a.slice(0, -1));
      return type === a;
    });
  }

  function take(all: File[]) {
    if (all.length === 0) return;
    const accepted = all.filter(matches);
    const rejected = all.filter((f) => !matches(f));
    const files = multiple ? accepted : accepted.slice(0, 1);
    if (files.length > 0) onfiles?.({ files });
    if (rejected.length > 0) onreject?.({ files: rejected });
  }

  function carriesFiles(e: DragEvent) {
    return Array.from(e.dataTransfer?.types || []).includes('Files');
  }

  function handleDragEnter(e: DragEvent) {
    if (disabled || !carriesFiles(e)) return;
    e.preventDefault();
    depth += 1;
  }

  function handleDragOver(e: DragEvent) {
    if (disabled || !carriesFiles(e)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  }

  function handleDragLeave() {
    depth = Math.max(0, depth - 1);
  }

  function handleDrop(e: DragEvent) {
    if (!carriesFiles(e)) return;
    e.preventDefault();
    depth = 0;
    if (disabled || !e.dataTransfer) return;
    // A dropped folder arrives as a file that can't be read, so it's left out
    const files = Array.from(e.dataTransfer.items)
      .filter((item) => item.kind === 'file' && !item.webkitGetAsEntry?.()?.isDirectory)
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);
    take(files);
  }

  function handleChange(picker: HTMLInputElement) {
    take(Array.from(picker.files || []));
    // Picking the same file again still fires change
    picker.value = '';
  }

  let describedBy = $derived(
    [hint ? hintId : '', invalid && errorMessage ? errorId : ''].filter(Boolean).join(' ')
  );
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
    ondragenter={handleDragEnter}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    {#if !compact}
      {#if children}
        {@render children()}
      {:else if iconName}
        <Icon
          {iconName}
          size={48}
          color={disabled ? '--figma-color-icon-disabled' : '--figma-color-icon-tertiary'}
          class="dropzone__icon"
        />
      {/if}
    {/if}
    <Button variant={compact ? 'secondary' : 'primary'} {disabled} onclick={() => input?.click()}
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
      onchange={(e) => handleChange(e.currentTarget)}
    />
  </div>
  {#if invalid && errorMessage}
    <div class="error" id={errorId} role="alert">{errorMessage}</div>
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
    border: 1px dashed var(--figma-color-border);
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
    border-color: var(--figma-color-border-disabled);
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
    user-select: none;
  }

  .disabled .hint {
    color: var(--figma-color-text-disabled);
  }

  input {
    display: none;
  }

  .error {
    color: var(--figma-color-text-danger);
    cursor: default;
    user-select: none;
    font-family: var(--font-stack);
    /* A small FieldGroup sets --field-error-* to body-small */
    font-size: var(--field-error-font-size, var(--body-medium-font-size));
    font-weight: var(--field-error-font-weight, var(--body-medium-font-weight));
    letter-spacing: var(--field-error-letter-spacing, var(--body-medium-letter-spacing));
    line-height: var(--field-error-line-height, var(--body-medium-line-height));
    padding-top: var(--size-xxxsmall);
  }
</style>
