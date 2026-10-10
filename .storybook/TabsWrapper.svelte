<script lang="ts">
  import { untrack, type ComponentProps } from 'svelte';
  import Tabs from '../src/components/Tabs/index.svelte';

  interface Props {
    tabs?: ComponentProps<typeof Tabs>['tabs'];
    selectedTab?: number;
  }

  let { tabs = [], selectedTab = 0 }: Props = $props();

  let currentTab = $state(untrack(() => selectedTab));
</script>

<div style="padding: 20px;">
  <Tabs {tabs} bind:selectedTab={currentTab} />
</div>
