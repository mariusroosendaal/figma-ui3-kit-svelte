<script>
  import SegmentedControl from '../src/components/SegmentedControl/index.svelte';
  import Segment from '../src/components/Segment/index.svelte';

  export let segments = [];
  export let value = null;
  export let disabled = false;
  export let width = 168;

  let selected = value;
</script>

<div style="width: {width}px;">
  <SegmentedControl bind:value={selected} {disabled} ariaLabel="Example">
    {#each segments as segment (segment.value)}
      <Segment
        value={segment.value}
        iconName={segment.iconName}
        disabled={segment.disabled}
        tooltip={segment.tooltip}
      >
        {segment.label ?? ''}
      </Segment>
    {/each}
  </SegmentedControl>
</div>
