<script lang="ts">
  import { untrack } from 'svelte';
  import SegmentedControl from '../src/components/SegmentedControl/index.svelte';
  import Segment from '../src/components/Segment/index.svelte';

  type SegmentSpec = {
    value: string;
    label?: string;
    iconName?: string | null;
    disabled?: boolean;
    tooltip?: string;
  };

  interface Props {
    segments?: SegmentSpec[];
    value?: string | null;
    disabled?: boolean;
    width?: number;
  }

  let { segments = [], value = null, disabled = false, width = 168 }: Props = $props();

  let selected = $state(untrack(() => value));
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
