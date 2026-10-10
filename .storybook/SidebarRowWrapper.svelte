<script lang="ts">
  import SidebarRow from '../src/components/SidebarRow/index.svelte';
  import Avatar from '../src/components/Avatar/index.svelte';
  import IconButton from '../src/components/IconButton/index.svelte';
  import IconMore from '../src/icons/24/icon.24.more.svg';
  import IconResolve from '../src/icons/24/icon.24.resolve.svg';

  interface Props {
    meta?: string;
    title?: string;
    detail?: string;
    message?: string;
    link?: string;
    unread?: boolean;
    selected?: boolean;
    clickable?: boolean;
    lines?: number;
    /** Two avatars in the lead, as UI3's row has. */
    avatars?: boolean;
    /** UI3's More and Resolve buttons, shown on hover. */
    actions?: boolean;
  }

  let {
    meta = '',
    title = '',
    detail = '',
    message = '',
    link = '',
    unread = false,
    selected = false,
    clickable = true,
    lines = 0,
    avatars = true,
    actions = true,
  }: Props = $props();
</script>

{#snippet lead()}
  <Avatar name="Wayne Sun" color="yellow" />
  <Avatar name="Kai" color="green" />
{/snippet}

{#snippet buttons()}
  <IconButton iconName={IconMore} ariaLabel="More actions" />
  <IconButton iconName={IconResolve} ariaLabel="Resolve" />
{/snippet}

<div style="width: 240px;">
  <SidebarRow
    {meta}
    {title}
    {detail}
    {message}
    {link}
    {unread}
    {selected}
    {clickable}
    {lines}
    lead={avatars ? lead : undefined}
    actions={actions ? buttons : undefined}
  />
</div>
