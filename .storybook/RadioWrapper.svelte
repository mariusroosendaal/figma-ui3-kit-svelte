<script lang="ts">
  import { untrack } from 'svelte';
  import Radio from '../src/components/Radio/index.svelte';
  import RadioGroup from '../src/components/RadioGroup/index.svelte';

  interface Props {
    value?: string;
    disabled?: boolean;
    variant?: 'input' | 'button';
  }

  let { value = 'option1', disabled = false, variant = 'input' }: Props = $props();

  let selectedValue = $state(untrack(() => value));
</script>

<div style="width: 280px;">
  <RadioGroup
    legend={variant === 'button' ? 'Export as' : ''}
    direction={variant === 'button' ? 'horizontal' : 'vertical'}
  >
    <Radio bind:group={selectedValue} value="option1" {variant} {disabled}>Option 1</Radio>
    <Radio bind:group={selectedValue} value="option2" {variant} {disabled}>Option 2</Radio>
    <Radio bind:group={selectedValue} value="option3" {variant} {disabled}>Option 3</Radio>
  </RadioGroup>
</div>
