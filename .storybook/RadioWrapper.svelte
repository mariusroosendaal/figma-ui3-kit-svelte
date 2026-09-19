<script>
  import Radio from '../src/components/Radio/index.svelte';
  import RadioGroup from '../src/components/RadioGroup/index.svelte';

  export let value = 'option1';
  export let disabled = false;
  /** @type {'input' | 'button'} */
  export let variant = 'input';

  let selectedValue = value;
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
