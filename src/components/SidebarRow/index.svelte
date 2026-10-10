<!--
  SidebarRow: UI3's Sidebar row comment — a row in a sidebar list of comments,
  notifications or anything else that says where, what and what to do.

  From the top: the `lead` slot (avatars, an icon), `meta` (where: "#3 · Page
  1"), `title` with `detail` beside it (a name and "Just now"), `message` (or
  the default slot) and `link` ("2 replies"), which fires `link`.

  - `clickable`, on by default, makes the whole row a button that fires
    `click`, with UI3's hover fill; the link and the actions sit above it.
  - `selected` takes the selected fill.
  - `unread` draws the blue dot top right and turns the link blue.
  - The `actions` slot holds icon buttons, shown top right on hover, on focus
    and while selected, over the unread dot.
  - `lines` cuts the message after that many lines; 0 shows all of it.
-->
<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from '../Icon/index.svelte';
  import IconUnread from './../../icons/16/icon.16.unread.svg';

  export let meta = '';
  export let title = '';
  export let detail = '';
  export let message = '';
  /** The link line's label; fires `link`. */
  export let link = '';
  export let unread = false;
  export let selected = false;
  export let clickable = true;
  /** Lines the message is cut after; 0 shows all of it. */
  export let lines = 0;
  /** The row button's label; the row's text by default. */
  export let ariaLabel = '';

  let className = '';
  export { className as class };

  const dispatch = createEventDispatcher();

  $: label =
    ariaLabel ||
    [unread ? 'Unread' : '', meta, title, detail, message].filter(Boolean).join('. ');
</script>

<div class="sidebar-row {className}">
  <div
    class="content"
    class:clickable
    class:selected
    class:has-actions={$$slots.actions}
  >
    {#if clickable}
      <button
        type="button"
        class="hit"
        aria-label={label}
        aria-current={selected ? 'true' : undefined}
        on:click
        on:focus
        on:blur
      ></button>
    {/if}
    {#if $$slots.lead}
      <div class="lead"><slot name="lead" /></div>
    {/if}
    {#if meta}
      <div class="meta">{meta}</div>
    {/if}
    {#if title || detail}
      <div class="name">
        {#if title}<span class="title">{title}</span>{/if}
        {#if detail}<span class="detail">{detail}</span>{/if}
      </div>
    {/if}
    {#if message || $$slots.default}
      <div
        class="message"
        class:clamped={lines > 0}
        style={lines > 0 ? `-webkit-line-clamp: ${lines}; line-clamp: ${lines};` : undefined}
      >
        <slot>{message}</slot>
      </div>
    {/if}
    {#if link}
      <button type="button" class="link" class:unread on:click={() => dispatch('link')}
        >{link}</button
      >
    {/if}
    {#if unread}
      <div class="unread-dot" aria-hidden="true">
        <Icon iconName={IconUnread} size={16} color="--figma-color-icon-brand" />
      </div>
    {/if}
    {#if $$slots.actions}
      <div class="actions"><slot name="actions" /></div>
    {/if}
  </div>
</div>

<style>
  .sidebar-row {
    padding: var(--size-xxxsmall) var(--size-xxsmall); /* 4px 8px */
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    color: var(--figma-color-text-secondary);
  }

  .content {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: var(--size-xxsmall); /* 8px */
    border-radius: var(--border-radius-medium); /* 5px */
    background-color: var(--figma-color-bg);
    overflow-wrap: break-word;
  }

  .content.clickable:hover,
  .content.clickable:focus-within {
    background-color: var(--figma-color-bg-hover);
  }

  .content.selected,
  .content.selected:hover {
    background-color: var(--figma-color-bg-selected);
  }

  /* The whole row as a button, under the link and the actions. */
  .hit {
    position: absolute;
    inset: 0;
    z-index: 0;
    padding: 0;
    border: none;
    border-radius: inherit;
    background: none;
    outline: none;
  }

  .hit:focus-visible {
    box-shadow: inset 0 0 0 2px var(--figma-color-border-selected);
  }

  .lead {
    display: flex;
    align-items: flex-start;
    gap: var(--size-xxxsmall);
    padding-bottom: var(--size-xxxsmall);
  }

  .name {
    display: flex;
    gap: var(--size-xxxsmall);
    max-width: 100%;
  }

  .title {
    color: var(--figma-color-text);
  }

  .meta,
  .message {
    max-width: 100%;
  }

  .message.clamped {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .link {
    position: relative;
    z-index: 1;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    letter-spacing: inherit;
    color: var(--figma-color-text-secondary);
    text-align: left;
    outline: none;
  }

  .link.unread {
    color: var(--figma-color-text-brand);
  }

  .link:hover {
    text-decoration: underline;
  }

  .link:focus-visible {
    border-radius: var(--border-radius-small);
    box-shadow: 0 0 0 2px var(--figma-color-border-selected);
  }

  .unread-dot {
    position: absolute;
    top: 12px;
    right: var(--size-xxxsmall);
    pointer-events: none;
  }

  .actions {
    position: absolute;
    top: var(--size-xxsmall);
    right: var(--size-xxsmall);
    z-index: 1;
    display: none;
    align-items: center;
    gap: var(--size-xxsmall);
  }

  .content:hover .actions,
  .content:focus-within .actions,
  .content.selected .actions {
    display: flex;
  }

  .content.has-actions:hover .unread-dot,
  .content.has-actions:focus-within .unread-dot,
  .content.has-actions.selected .unread-dot {
    display: none;
  }
</style>
