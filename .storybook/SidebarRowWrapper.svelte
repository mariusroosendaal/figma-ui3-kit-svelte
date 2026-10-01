<script>
  import SidebarRow from '../src/components/SidebarRow/index.svelte';
  import Avatar from '../src/components/Avatar/index.svelte';
  import IconButton from '../src/components/IconButton/index.svelte';
  import IconMore from '../src/icons/24/icon.24.more.svg';
  import IconResolve from '../src/icons/24/icon.24.resolve.svg';

  export let meta = '';
  export let title = '';
  export let detail = '';
  export let message = '';
  export let link = '';
  export let unread = false;
  export let selected = false;
  export let clickable = true;
  export let lines = 0;
  /** Two avatars in the lead, as UI3's row has. */
  export let avatars = true;
  /** UI3's More and Resolve buttons, shown on hover. */
  export let actions = true;
</script>

<div style="width: 240px;">
  <SidebarRow {meta} {title} {detail} {message} {link} {unread} {selected} {clickable} {lines}>
    <svelte:fragment slot="lead">
      {#if avatars}
        <Avatar name="Wayne Sun" color="yellow" />
        <Avatar name="Kai" color="green" />
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="actions">
      {#if actions}
        <IconButton iconName={IconMore} ariaLabel="More actions" />
        <IconButton iconName={IconResolve} ariaLabel="Resolve" />
      {/if}
    </svelte:fragment>
  </SidebarRow>
</div>
