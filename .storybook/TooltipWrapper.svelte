<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Tooltip from '../src/components/Tooltip/index.svelte';
  import Button from '../src/components/Button/index.svelte';

  let {
    label = 'Tooltip text',
    hotkey = true,
    hotkeyText = '⌘V',
    direction = 'Top',
    disabled = false,
  }: ComponentProps<typeof Tooltip> = $props();
</script>

<Tooltip {label} {hotkey} {hotkeyText} {direction} {disabled}>
  <Button variant="secondary" label="Hover me" />
</Tooltip>
