<!--
  Tree: a nested list that expands and collapses, in UI3's row style (24px rows,
  16px per level). Not in the UI3 file; built on the Kit additions page.

  Nodes are `{ id, label, iconName?, detail?, disabled?, children? }`.

  - mode 'none': browse only (a JSON preview).
  - mode 'single': one row is `selected` (a picker).
  - mode 'check': leaves are ticked in `checked`; a parent shows all, some or
    none of its leaves and ticks or clears them all (pages to scan).

  `expanded` lists open parents; left null, every parent starts open.
  Keyboard follows the tree pattern: Up/Down move, Right opens or steps in,
  Left closes or steps out, Home/End, Enter/Space select or tick.
-->
<script lang="ts" generics="T extends TreeNode = TreeNode">
  import type { TreeNode } from '../../types';
  import Icon from '../Icon/index.svelte';
  import IconChevronRight from './../../icons/16/icon.16.chevron.right.svg';
  import IconCheck from './../../icons/16/icon.16.check.svg';
  import IconMixed from './../../icons/16/icon.16.mixed.svg';

  interface Props {
    nodes?: T[];
    /** none: browse only; single: one row is `selected`; check: leaves are ticked in `checked` */
    mode?: 'none' | 'single' | 'check';
    /** Ids of open parents; null opens them all */
    expanded?: string[] | null;
    /** Mode 'single' */
    selected?: string | null;
    /** Mode 'check': ticked leaf ids */
    checked?: string[];
    disabled?: boolean;
    ariaLabel?: string;
    class?: string;
    /** A parent opened or closed, after `expanded` updates */
    ontoggle?: (detail: { id: string; expanded: boolean }) => void;
    /** Mode 'single': the picked node, after `selected` updates */
    onselect?: (node: T) => void;
    /** Mode 'check': the ticked leaf ids, after `checked` updates */
    onchange?: (checked: string[]) => void;
  }

  let {
    nodes = [],
    mode = 'none',
    expanded = $bindable(),
    selected = $bindable(),
    checked = $bindable(),
    disabled = false,
    ariaLabel = '',
    class: className = '',
    ontoggle,
    onselect,
    onchange,
  }: Props = $props();

  type Row = {
    node: T;
    depth: number;
    parent: string | null;
    isParent: boolean;
    setSize: number;
    pos: number;
  };

  const treeId = 'tree-' + Math.random().toString(36).slice(2, 11);
  let active: string | null = $state(null);

  const hasChildren = (node: TreeNode) => Array.isArray(node.children) && node.children.length > 0;

  function allParents(list: TreeNode[], out: string[] = []) {
    for (const node of list) {
      if (hasChildren(node)) {
        out.push(node.id);
        allParents(node.children ?? [], out);
      }
    }
    return out;
  }

  function leavesOf(node: TreeNode, out: string[] = []) {
    if (!hasChildren(node)) out.push(node.id);
    else for (const child of node.children ?? []) leavesOf(child, out);
    return out;
  }

  let open = $derived(new Set(expanded ?? allParents(nodes)));
  let ticked = $derived(new Set(checked ?? []));

  // The visible rows, in order, with what the keys and ARIA need. `openIds` is
  // passed in so the rows re-derive when a parent opens or closes.
  function flatten(
    list: T[],
    openIds: Set<string>,
    depth = 0,
    parent: string | null = null,
    into: Row[] = []
  ) {
    list.forEach((node, i) => {
      const isParent = hasChildren(node);
      into.push({ node, depth, parent, isParent, setSize: list.length, pos: i + 1 });
      if (isParent && openIds.has(node.id))
        flatten((node.children ?? []) as T[], openIds, depth + 1, node.id, into);
    });
    return into;
  }
  let rows = $derived(flatten(nodes, open));
  let activeRow = $derived(rows.find((r) => r.node.id === active) ?? null);

  // Every row's tick state in one post-order pass, so drawing a row is a lookup
  // rather than a walk of its own subtree.
  function checkStates(
    list: TreeNode[],
    on: Set<string>,
    out: Record<string, boolean | 'mixed'> = {}
  ) {
    for (const node of list) {
      if (!hasChildren(node)) {
        out[node.id] = on.has(node.id);
        continue;
      }
      const children = node.children ?? [];
      checkStates(children, on, out);
      let all = true;
      let none = true;
      for (const child of children) {
        const state = out[child.id];
        if (state === true) none = false;
        else if (state === false) all = false;
        else all = none = false;
      }
      out[node.id] = all ? true : none ? false : 'mixed';
    }
    return out;
  }
  let states = $derived(mode === 'check' ? checkStates(nodes, ticked) : null);

  function toggleOpen(node: TreeNode, force?: boolean) {
    const opening = force ?? !open.has(node.id);
    const others = [...open].filter((id) => id !== node.id);
    // Closing a parent takes its rows away: leave the keyboard on the parent
    // rather than on a row that is no longer there.
    if (!opening && active !== null && active !== node.id && findNode([node], active))
      active = node.id;
    expanded = opening ? [...others, node.id] : others;
    ontoggle?.({ id: node.id, expanded: opening });
  }

  function pick(node: T) {
    if (disabled || node.disabled) return;
    if (mode === 'single') {
      selected = node.id;
      onselect?.(node);
    } else if (mode === 'check') {
      const leaves = leavesOf(node).filter((id) => !findNode(nodes, id)?.disabled);
      const on = states?.[node.id] !== true;
      const next = on
        ? [...(checked ?? []), ...leaves.filter((id) => !ticked.has(id))]
        : (checked ?? []).filter((id) => !leaves.includes(id));
      checked = next;
      onchange?.(next);
    } else if (hasChildren(node)) {
      toggleOpen(node);
    }
  }

  function findNode(list: TreeNode[], id: string): TreeNode | null {
    for (const node of list) {
      if (node.id === id) return node;
      if (hasChildren(node)) {
        const found = findNode(node.children ?? [], id);
        if (found) return found;
      }
    }
    return null;
  }

  function handleClick(row: Row, event: MouseEvent) {
    active = row.node.id;
    // The chevron opens and closes; the rest of the row picks.
    if (row.isParent && (event.target as Element).closest('.twisty')) toggleOpen(row.node);
    else pick(row.node);
  }

  function move(index: number) {
    const row = rows[Math.max(0, Math.min(rows.length - 1, index))];
    if (!row) return;
    active = row.node.id;
    document.getElementById(`${treeId}-${row.node.id}`)?.scrollIntoView({ block: 'nearest' });
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!rows.length) return;
    // Read from `active`, not the derived row, which lags a key pressed straight after another.
    const index = rows.findIndex((r) => r.node.id === active);
    const activeRow = rows[index];
    switch (event.key) {
      case 'ArrowDown':
        move(index + 1);
        break;
      case 'ArrowUp':
        move(index <= 0 ? 0 : index - 1);
        break;
      case 'Home':
        move(0);
        break;
      case 'End':
        move(rows.length - 1);
        break;
      case 'ArrowRight':
        if (!activeRow?.isParent) return;
        if (!open.has(activeRow.node.id)) toggleOpen(activeRow.node, true);
        else move(index + 1);
        break;
      case 'ArrowLeft':
        if (!activeRow) return;
        if (activeRow.isParent && open.has(activeRow.node.id)) toggleOpen(activeRow.node, false);
        else if (activeRow.parent !== null)
          move(rows.findIndex((r) => r.node.id === activeRow.parent));
        break;
      case 'Enter':
      case ' ':
        if (activeRow) pick(activeRow.node);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  function handleFocus() {
    if (active === null && rows.length) {
      const start = mode === 'single' && rows.find((r) => r.node.id === selected);
      active = (start || rows[0]).node.id;
    }
  }
</script>

<ul
  class="tree {className}"
  class:disabled
  role="tree"
  tabindex={disabled ? -1 : 0}
  aria-label={ariaLabel || undefined}
  aria-multiselectable={mode === 'check' || undefined}
  aria-activedescendant={activeRow ? `${treeId}-${activeRow.node.id}` : undefined}
  onkeydown={handleKeydown}
  onfocus={handleFocus}
  onmousedown={(e) => {
    e.preventDefault();
    e.currentTarget.focus();
  }}
>
  {#each rows as row (row.node.id)}
    {@const state = states ? states[row.node.id] : null}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <li
      id="{treeId}-{row.node.id}"
      class="row"
      class:active={row.node.id === active}
      class:selected={mode === 'single' && row.node.id === selected}
      class:row-disabled={row.node.disabled}
      role="treeitem"
      aria-level={row.depth + 1}
      aria-setsize={row.setSize}
      aria-posinset={row.pos}
      aria-expanded={row.isParent ? open.has(row.node.id) : undefined}
      aria-selected={mode === 'single' ? row.node.id === selected : undefined}
      aria-checked={mode === 'check' ? state : undefined}
      aria-disabled={row.node.disabled || undefined}
      style:--depth={row.depth}
      onclick={(e) => handleClick(row, e)}
    >
      <span class="twisty" class:open={open.has(row.node.id)}>
        {#if row.isParent}
          <Icon iconName={IconChevronRight} color="--figma-color-icon-secondary" size={16} />
        {/if}
      </span>
      {#if mode === 'check'}
        <span class="box" class:on={state === true} class:mixed={state === 'mixed'}>
          {#if state === 'mixed'}
            <Icon iconName={IconMixed} color="--figma-color-icon-onbrand" size={16} />
          {:else if state}
            <Icon iconName={IconCheck} color="--figma-color-icon-onbrand" size={16} />
          {/if}
        </span>
      {/if}
      {#if row.node.iconName}
        <span class="lead"
          ><Icon iconName={row.node.iconName} color="--figma-color-icon-secondary" /></span
        >
      {/if}
      <span class="label">{row.node.label}</span>
      {#if row.node.detail}
        <span class="detail">{row.node.detail}</span>
      {/if}
    </li>
  {/each}
</ul>

<style>
  .tree {
    margin: 0;
    padding: 0;
    list-style: none;
    outline: none;
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
    color: var(--figma-color-text);
  }

  .row {
    display: flex;
    align-items: center;
    gap: var(--size-xxxsmall); /* 4px */
    min-height: var(--size-small); /* 24px */
    padding: 0 var(--size-xxsmall) 0 calc(var(--size-xxxsmall) + var(--depth) * var(--size-xsmall));
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium);
    cursor: default;
    user-select: none;
  }

  .row:hover {
    background-color: var(--figma-color-bg-hover);
  }

  .row.selected {
    background-color: var(--figma-color-bg-selected);
  }

  /* The keyboard's row, shown only while the tree has keyboard focus */
  .tree:focus-visible .row.active {
    border-color: var(--figma-color-border-selected);
  }

  .row.row-disabled,
  .disabled .row {
    color: var(--figma-color-text-disabled);
  }

  .twisty {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--size-xsmall);
    height: var(--size-xsmall);
    transition: transform 0.1s ease;
  }

  .twisty.open {
    transform: rotate(90deg);
  }

  .twisty :global(.icon-component),
  .lead :global(.icon-component),
  .box :global(.icon-component) {
    cursor: inherit;
  }

  .box {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: var(--size-xsmall);
    height: var(--size-xsmall);
    border: 1px solid var(--figma-color-border);
    border-radius: var(--border-radius-medium);
    background-color: var(--figma-color-bg-secondary);
  }

  .box.on,
  .box.mixed {
    border-color: var(--figma-color-border-selected-strong);
    background-color: var(--figma-color-bg-brand);
  }

  .lead {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: var(--size-xsmall);
    height: var(--size-xsmall);
  }

  .label {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .detail {
    flex: 0 1 auto;
    min-width: 0;
    margin-left: var(--size-xxsmall);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--figma-color-text-tertiary);
  }
</style>
