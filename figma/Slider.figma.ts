// url=<UI3_FILE>?node-id=2015-23280
// source=src/components/Slider/index.svelte
// component=Slider
import figma from 'figma'
const instance = figma.selectedInstance

// Range in Figma fills from the centre, which is the kit's delta variant.
// Gradient, Color Range and Corner Radius have no dedicated code variant.
const variant = instance.getEnum('👥 Variant', {
  'Corner Radius': 'range',
  'Fill': 'range',
  'Gradient': 'range',
  'Range': 'delta',
  'Stepper': 'stepper',
  'Slider': 'range',
  'Color Range': 'range',
  'Disabled': 'range',
})
const disabled = instance.getPropertyValue('👥 Variant') === 'Disabled'

// 🐣 Knob Position is the current value, which comes from bind:value in code.
export default {
  example: figma.code`<Slider bind:value${variant !== 'range' ? figma.code` variant="${variant}"` : ''}${variant === 'delta' ? ' defaultValue={50}' : ''}${variant === 'stepper' ? ' step={25}' : ''}${disabled ? ' disabled' : ''} />`,
  imports: ["import { Slider } from 'figma-ui3-kit-svelte'"],
  id: 'slider',
  metadata: { nestable: true },
}
