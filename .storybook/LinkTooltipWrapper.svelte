<script>
  import LinkTooltip from '../src/components/LinkTooltip/index.svelte';
  import Button from '../src/components/Button/index.svelte';

  export let label = 'Open google.com';
  export let iconName = null;
  export let actions = [{ label: 'Edit', value: 'edit' }];
  export let input = false;
  /** @type {'Top' | 'Bottom'} */
  export let direction = 'Top';

  // The parent owns the flow: Edit switches to the field with the current link,
  // Enter switches back with the new one.
  let anchor;
  let open = false;
  let url = 'https://google.com';
  let value = '';

  $: host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  $: shownLabel = label === 'Open google.com' ? `Open ${host}` : label;

  function handleAction(event) {
    if (event.detail.value === 'edit') {
      value = url;
      input = true;
    }
  }

  function handleSubmit(event) {
    if (!event.detail) return;
    url = /^[a-z]+:/i.test(event.detail) ? event.detail : `https://${event.detail}`;
    input = false;
  }
</script>

<div style="padding: 64px 16px;">
  <span bind:this={anchor} style="display: inline-block;">
    <Button
      variant="secondary"
      label={open ? 'Close' : 'Open link tooltip'}
      on:click={() => (open = !open)}
    />
  </span>
</div>

<LinkTooltip
  bind:open
  bind:value
  {anchor}
  label={shownLabel}
  {iconName}
  {actions}
  {input}
  {direction}
  on:action={handleAction}
  on:submit={handleSubmit}
/>
