<script>
  import Tabs from '../src/components/Tabs/index.svelte';
  
  export let tabs = [];
  export let selectedTab = 0;
  
  let currentTab = selectedTab;
  
  function handleTabChange(index) {
    currentTab = index;
  }
</script>

<div style="padding: 20px;">
  <Tabs
    {tabs}
    bind:selectedTab={currentTab}
    onTabChange={handleTabChange}
  />
</div>

