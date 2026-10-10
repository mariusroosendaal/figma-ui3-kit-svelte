<script lang="ts">
  import type { FocusEventHandler, FormEventHandler, KeyboardEventHandler } from 'svelte/elements';

  interface Props {
    id?: string | null;
    value?: string | null;
    rows?: number;
    name?: string | null;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    invalid?: boolean;
    errorMessage?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    variant?: 'default' | 'code';
    class?: string;
    /** After `value` updates */
    oninput?: FormEventHandler<HTMLTextAreaElement>;
    onchange?: FormEventHandler<HTMLTextAreaElement>;
    onkeydown?: KeyboardEventHandler<HTMLTextAreaElement>;
    onfocus?: FocusEventHandler<HTMLTextAreaElement>;
    onblur?: FocusEventHandler<HTMLTextAreaElement>;
  }

  let {
    id = null,
    value = $bindable(),
    rows = 2,
    name = null,
    disabled = false,
    readonly = false,
    placeholder = '',
    invalid = false,
    errorMessage = '',
    ariaLabel = '',
    ariaLabelledBy = '',
    variant = 'default',
    class: className = '',
    oninput,
    onchange,
    onkeydown,
    onfocus,
    onblur,
  }: Props = $props();

  const fallbackId = 'textarea--' + (Math.random() * 10000000).toFixed(0).toString();
  let errorId = $derived((id || fallbackId) + '-error');

  $effect(() => {
    if (!ariaLabel && !ariaLabelledBy && !id) {
      console.warn(
        '[Textarea] provide ariaLabel, ariaLabelledBy, or id + external <Label> for accessibility.'
      );
    }
  });
</script>

<div class="textarea {className}">
  <textarea
    {oninput}
    {onchange}
    {onkeydown}
    {onfocus}
    {onblur}
    bind:value
    {id}
    {name}
    {rows}
    {disabled}
    {readonly}
    {placeholder}
    aria-label={ariaLabel || undefined}
    aria-labelledby={ariaLabelledBy || undefined}
    aria-invalid={invalid || undefined}
    aria-describedby={invalid ? errorId : undefined}
    class:invalid
    class:code={variant === 'code'}
  ></textarea>
  {#if invalid}
    <div class="error" id={errorId} role="alert">
      {errorMessage}
    </div>
  {/if}
</div>

<style>
  .textarea {
    position: relative;
  }

  textarea {
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    position: relative;
    display: block;
    width: 100%;
    min-height: 48px; /* 3 lines minimum (16px * 3) */
    margin: 1px 0 1px 0;
    padding: var(--size-xxxsmall) var(--size-xxsmall); /* 4px 8px, UI3's multi-line input */
    color: var(--figma-color-text);
    border: 1px solid var(--figma-color-border);
    border-radius: var(--border-radius-medium); /* 5px */
    outline: none;
    background-color: var(--figma-color-bg);
    resize: vertical; /* Allow vertical resize only */
    overflow-y: auto;
    font-family: var(--font-stack);
  }
  textarea:hover,
  textarea:placeholder-shown:hover {
    color: var(--figma-color-text-hover);
    border: 1px solid var(--figma-color-border);
    background-image: none;
  }
  textarea::selection {
    color: var(--figma-color-text);
    background-color: var(--text-highlight);
  }
  textarea::placeholder {
    color: var(--figma-color-text-tertiary);
    border: 1px solid transparent;
  }
  textarea:placeholder-shown {
    color: var(--figma-color-text);
    border: 1px solid var(--figma-color-border);
    background-image: none;
  }
  textarea:focus-visible:placeholder-shown {
    border: 1px solid var(--figma-color-border-selected);
    box-shadow: 0 0 0 2px inset var(--figma-color-bg);
  }

  textarea:focus-visible {
    color: var(--figma-color-text);
    border: 1px solid var(--figma-color-border-selected);
    box-shadow: 0 0 0 2px inset var(--figma-color-bg);
  }

  textarea.code {
    font-family: var(--font-stack-monospace);
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
    color: var(--figma-color-text);
  }

  textarea:focus:not(:focus-visible) {
    box-shadow: none;
  }
  textarea:disabled {
    position: relative;
    color: var(--figma-color-text-disabled);
    background-image: none;
  }
  textarea:disabled:active {
    outline: none;
    border: 1px solid var(--figma-color-border);
  }

  .invalid,
  .invalid:hover {
    border: 1px solid var(--figma-color-border-danger-strong);
    outline: none;
  }

  .invalid:focus-visible {
    border: 1px solid var(--figma-color-border-danger-strong);
    box-shadow: 0 0 0 2px inset var(--figma-color-bg);
    outline: none;
  }

  .invalid:focus:not(:focus-visible) {
    box-shadow: none;
  }

  .error {
    color: var(--figma-color-text-danger);
    cursor: default;
    user-select: none;
    /* A small FieldGroup sets --field-error-* to body-small */
    font-size: var(--field-error-font-size, var(--body-medium-font-size));
    font-weight: var(--field-error-font-weight, var(--body-medium-font-weight));
    letter-spacing: var(--field-error-letter-spacing, var(--body-medium-letter-spacing));
    line-height: var(--field-error-line-height, var(--body-medium-line-height));
    padding-top: var(--size-xxxsmall);
  }
</style>
