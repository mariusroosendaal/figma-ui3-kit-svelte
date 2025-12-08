<script>
  import Tooltip from '../src/components/Tooltip/index.svelte';
  import Button from '../src/components/Button/index.svelte';
  
  export let label = 'Tooltip text';
  export let hotkey = true;
  export let hotkeyText = '⌘V';
  export let direction = 'Top';
  export let disabled = false;
</script>

<Tooltip {label} {hotkey} {hotkeyText} {direction} {disabled}>
  <Button variant="secondary" label="Hover me" />
</Tooltip>

