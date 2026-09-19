// url=<UI3_FILE>?node-id=2015-23280
// source=src/components/Slider/index.svelte
// component=Slider
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Slider } from 'figma-ui3-kit-svelte'"]

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
  imports,
  id: 'slider',
  metadata: { nestable: true, props: { imports } },
}
