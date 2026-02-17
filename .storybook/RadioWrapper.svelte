<script>
  import Radio from '../src/components/Radio/index.svelte';
  
  export let value = 'option1';
  export let disabled = false;
  
  let selectedValue = value;
</script>

<div style="display: flex; flex-direction: column; gap: var(--size-xxsmall);">
  <Radio bind:group={selectedValue} value="option1" {disabled}>Option 1</Radio>
  <Radio bind:group={selectedValue} value="option2" {disabled}>Option 2</Radio>
  <Radio bind:group={selectedValue} value="option3" {disabled}>Option 3</Radio>
</div>

