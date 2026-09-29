<script>
  import Avatar from '../Avatar/index.svelte';
  import Badge from '../Badge/index.svelte';
  import Chit from '../Chit/index.svelte';
  import Icon from '../Icon/index.svelte';
  import IconCheck from './../../icons/16/icon.16.check.svg';
  import IconDot from './../../icons/16/icon.16.autolayoutgrid.dot.svg';
  import IconMixed from './../../icons/16/icon.16.mixed.svg';
  import IconChevronRight from './../../icons/24/icon.24.chevron.right.svg';

  export let id = null;
  /** @type {'default' | 'checkmark' | 'checkbox' | 'toggle'} */
  export let variant = 'default';
  /** Check state for the checkmark, checkbox and toggle variants; 'mixed' draws a dot or a dash. */
  /** @type {boolean | 'mixed'} */
  export let selected = false;
  /** Set by Menu, which moves the highlight with the keyboard and the pointer. Left
      null, a standalone row highlights on hover. */
  /** @type {boolean | null} */
  export let highlighted = null;
  export let hasSubMenu = false; // Whether this item has a nested sub-menu
  export let disabled = false;
  /** Lead visual after the check column: an icon (SVG import) or a color chit. */
  export let iconName = null;
  /** @type {string | string[] | null} */
  export let chit = null;
  /** Avatar props for a person or team lead, e.g. `{ name: 'Team A', color: 'yellow' }` */
  /** @type {Record<string, any> | null} */
  export let avatar = null;
  /** Right-aligned secondary text: a shortcut, a count, a value. */
  export let detail = '';
  /** Right-aligned badge text, or a list of texts and `{ text, variant?, strong? }`
      for several. */
  /** @type {string | { text: string, variant?: string, strong?: boolean } | Array<string | { text: string, variant?: string, strong?: boolean }>} */
  export let badge = '';
  /** Overrides the ARIA role, e.g. 'menuitemradio' for a single-choice list. */
  export let role = null;

  let className = '';
  export { className as class };

  $: ariaRole = role || (variant === 'default' ? 'menuitem' : 'menuitemcheckbox');
  $: badges = (Array.isArray(badge) ? badge : [badge])
    .filter(Boolean)
    .map((b) => (typeof b === 'string' ? { text: b } : b));
  $: checkable = ariaRole === 'menuitemcheckbox' || ariaRole === 'menuitemradio';
</script>

<li
  id={id != null ? `menu-item-${id}` : undefined}
  class="menu-item {className}"
  class:highlight={highlighted}
  class:controlled={highlighted !== null}
  class:disabled
  class:has-check={variant === 'checkmark'}
  class:has-trail={hasSubMenu || $$slots.trail}
  role={ariaRole}
  aria-checked={checkable ? (selected === 'mixed' ? 'mixed' : Boolean(selected)) : undefined}
  aria-disabled={disabled || undefined}
  aria-haspopup={hasSubMenu ? 'menu' : undefined}
  on:mouseenter
  on:mouseleave
  on:mousemove
  on:click
>
  {#if variant === 'checkmark'}
    <span class="check" class:on={selected}>
      <Icon iconName={selected === 'mixed' ? IconDot : IconCheck} color="--color-icon-menu" />
    </span>
  {:else if variant === 'toggle'}
    <span class="toggle" class:on={selected === true} class:mixed={selected === 'mixed'}
      ><span class="knob"></span></span
    >
  {/if}
  {#if avatar}
    <span class="lead"><Avatar size="small" {...avatar} /></span>
  {:else if chit}
    <span class="lead"><Chit color={chit} /></span>
  {:else if iconName}
    <span class="lead"><Icon {iconName} color="--color-icon-menu" /></span>
  {:else if $$slots.lead}
    <span class="lead"><slot name="lead" /></span>
  {/if}
  <span class="label"><slot /></span>
  {#if detail}
    <span class="detail">{detail}</span>
  {/if}
  {#if badges.length}
    <span class="badge">
      {#each badges as b (b.text)}
        <Badge variant={b.variant ?? 'menu'} strong={b.strong ?? false} text={b.text} />
      {/each}
    </span>
  {/if}
  {#if variant === 'checkbox'}
    <span class="checkbox" class:on={selected}>
      {#if selected}
        <Icon iconName={selected === 'mixed' ? IconMixed : IconCheck} color="--color-icon-menu" />
      {/if}
    </span>
  {/if}
  {#if hasSubMenu}
    <span class="trail">
      <Icon iconName={IconChevronRight} color="--color-icon-menu" />
    </span>
  {:else if $$slots.trail}
    <span class="trail"><slot name="trail" /></span>
  {/if}
</li>

<style>
  li {
    display: flex;
    align-items: center;
    gap: var(--size-xxsmall); /* 8px */
    min-height: var(--size-small); /* 24px */
    padding: 0 var(--size-xxsmall); /* 8px */
    border-radius: var(--border-radius-medium); /* 5px */
    outline: none;
    color: var(--color-text-menu); /* #ffffff */
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    cursor: default;
    user-select: none;
  }

  /* The check column sits in the row's padding: 4px in, 4px to the label. */
  li.has-check {
    gap: var(--size-xxxsmall);
    padding-left: var(--size-xxxsmall);
  }

  /* A lead icon after the check: UI3's toolbar row puts its 24px icon 20px in
     and the label at 48px */
  li.has-check .lead {
    margin-right: var(--size-xxxsmall);
  }

  li.has-trail {
    padding-right: 0;
  }

  .highlight,
  li:not(.controlled):hover {
    background-color: var(--color-bg-menu-selected); /* #0d99ff */
  }

  li.disabled {
    color: var(--color-text-menu-tertiary);
    cursor: default;
  }

  li:not(.controlled).disabled {
    pointer-events: none;
  }

  li.disabled :global(.icon-component) {
    opacity: 0.4;
  }

  .label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    pointer-events: none;
  }

  .check,
  .lead,
  .trail,
  .checkbox,
  .toggle,
  .detail,
  .badge {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  /* 16px cells that still center 24px icons. */
  .check,
  .lead {
    justify-content: center;
    width: var(--size-xsmall);
    height: var(--size-xsmall);
  }

  .check :global(.icon-component),
  .lead :global(.icon-component),
  .lead :global(.chit) {
    flex: 0 0 auto;
  }

  .check {
    opacity: 0;
  }

  .check.on {
    opacity: 1;
  }

  /* Right-aligned, and the last thing to give way. */
  .detail {
    min-width: 0;
    margin-left: var(--size-xsmall);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--color-text-menu-secondary);
  }

  .highlight .detail {
    color: var(--color-text-menu);
  }

  .detail + .badge,
  .detail + .checkbox {
    margin-left: 0;
  }

  .badge,
  .checkbox {
    margin-left: auto;
  }

  /* The menu is dark in either theme, so its badges take the dark theme's
     colors: the tokens Badge reads are set here to Figma's dark values, and
     every variant draws its dark self rather than light-theme text on a dark
     panel. */
  .badge {
    gap: var(--size-xxxsmall);
    --figma-color-bg: #2c2c2c;
    --figma-color-bg-brand: #0c8ce9;
    --figma-color-bg-component: #8a38f5;
    --figma-color-bg-danger: #e03e1a;
    --figma-color-bg-hover: #383838;
    --figma-color-bg-inverse: #ffffff;
    --figma-color-bg-onselected: #667799;
    --figma-color-bg-selected: #4a5878;
    --figma-color-bg-success: #198f51;
    --figma-color-bg-tertiary: #444444;
    --figma-color-bg-warning: #f3c11b;
    --figma-color-border: #444444;
    --figma-color-border-brand: #105cad;
    --figma-color-border-component: #652ca8;
    --figma-color-border-danger: #963323;
    --figma-color-border-disabled: #444444;
    --figma-color-border-onselected: #667799;
    --figma-color-border-success: #0a5c35;
    --figma-color-border-warning: #925711;
    --figma-color-text: #ffffff;
    --figma-color-text-brand: #7cc4f8;
    --figma-color-text-component: #d1a8ff;
    --figma-color-text-danger: #fca397;
    --figma-color-text-onbrand: #ffffff;
    --figma-color-text-oncomponent: #ffffff;
    --figma-color-text-ondanger: #ffffff;
    --figma-color-text-oninverse: #000000e5;
    --figma-color-text-onselected: #ffffffe5;
    --figma-color-text-onsuccess: #ffffff;
    --figma-color-text-onwarning: #000000e5;
    --figma-color-text-secondary: #ffffffb2;
    --figma-color-text-selected: #7cc4f8;
    --figma-color-text-success: #79d297;
    --figma-color-text-tertiary: #ffffff66;
    --figma-color-text-warning: #f7d15f;
  }

  /* An outlined badge is see-through, and its colored text is lost on the blue
     highlight. UI3's menu badge is a solid dark chip in both states, so on the
     highlight the others take that fill and keep their own text and edge. The
     class is doubled to outrank Badge's own variant rules. */
  .highlight .badge :global(.badge.badge:not(.strong)) {
    background-color: var(--figma-color-bg);
  }

  .label + .checkbox {
    margin-left: var(--size-xsmall);
  }

  .checkbox {
    justify-content: center;
    box-sizing: border-box;
    width: var(--size-xsmall);
    height: var(--size-xsmall);
    border: 1px solid var(--color-border-menu);
    border-radius: var(--border-radius-medium);
    background-color: rgba(255, 255, 255, 0.06);
  }

  .checkbox.on {
    border-color: var(--color-bg-menu-selected);
    background-color: var(--color-bg-menu-selected);
  }

  /* On the blue highlight the box needs its own edge. */
  .highlight .checkbox {
    border-color: var(--color-text-menu);
  }

  .toggle {
    position: relative;
    box-sizing: border-box;
    width: 32px; /* the kit Switch's track */
    height: 16px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.85);
  }

  .toggle.on,
  .toggle.mixed {
    background-color: var(--color-bg-menu-selected);
  }

  .highlight .toggle.on,
  .highlight .toggle.mixed {
    box-shadow: inset 0 0 0 1px var(--color-text-menu);
  }

  .knob {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: var(--color-text-menu);
    box-shadow:
      0 0 0.5px rgba(0, 0, 0, 0.3),
      0 1px 2px rgba(0, 0, 0, 0.15);
    transition: left 0.1s ease;
  }

  .toggle.on .knob {
    left: 17px;
  }

  .toggle.mixed .knob {
    left: 9px;
  }

  .trail {
    margin-left: auto;
  }

  .detail + .trail,
  .badge + .trail {
    margin-left: 0;
  }
</style>
