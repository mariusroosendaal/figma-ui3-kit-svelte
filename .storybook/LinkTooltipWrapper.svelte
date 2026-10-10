<script lang="ts">
  import LinkTooltip from '../src/components/LinkTooltip/index.svelte';
  import Button from '../src/components/Button/index.svelte';

  interface Props {
    label?: string;
    iconName?: string | null;
    actions?: Array<{ label: string; value: string }>;
    input?: boolean;
    direction?: 'Top' | 'Bottom';
  }

  let {
    label = 'Open google.com',
    iconName = null,
    actions = [{ label: 'Edit', value: 'edit' }],
    input = $bindable(false),
    direction = 'Top',
  }: Props = $props();

  // The parent owns the flow: Edit switches to the field with the current link,
  // Enter switches back with the new one.
  let anchor: HTMLSpanElement | undefined = $state();
  let open = $state(false);
  let url = $state('https://google.com');
  let value = $state('');

  let host = $derived(url.replace(/^https?:\/\//, '').replace(/\/.*$/, ''));
  let shownLabel = $derived(label === 'Open google.com' ? `Open ${host}` : label);

  function handleAction(action: { value: string }) {
    if (action.value === 'edit') {
      value = url;
      input = true;
    }
  }

  function handleSubmit(submitted: string) {
    if (!submitted) return;
    url = /^[a-z]+:/i.test(submitted) ? submitted : `https://${submitted}`;
    input = false;
  }
</script>

<div style="padding: 64px 16px;">
  <span bind:this={anchor} style="display: inline-block;">
    <Button
      variant="secondary"
      label={open ? 'Close' : 'Open link tooltip'}
      onclick={() => (open = !open)}
    />
  </span>
</div>

<LinkTooltip
  bind:isOpen={open}
  bind:value
  {anchor}
  label={shownLabel}
  {iconName}
  {actions}
  {input}
  {direction}
  onaction={handleAction}
  onsubmit={handleSubmit}
/>
