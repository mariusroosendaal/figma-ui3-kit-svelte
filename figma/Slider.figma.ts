// url=<UI3_FILE>?node-id=2015-23280
// source=src/components/Slider/index.svelte
// component=Slider
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Slider } from 'figma-ui3-kit-svelte'"]

// UI3's Slider variant fills from the centre (the kit's delta); Range is the plain
// left-filled slider. Color Range is the hue slider, Fill the opacity slider, and
// Corner Radius a range slider with a marker (defaultValue). Gradient is a
// gradient-stop editor, which the kit doesn't have; it renders as a range.
const variant = instance.getEnum('👥 Variant', {
  'Corner Radius': 'range',
  'Fill': 'opacity',
  'Gradient': 'range',
  'Range': 'range',
  'Stepper': 'stepper',
  'Slider': 'delta',
  'Color Range': 'hue',
  'Disabled': 'range',
})
const disabled = instance.getPropertyValue('👥 Variant') === 'Disabled'
const marker = instance.getPropertyValue('👥 Variant') === 'Corner Radius'

// 🐣 Knob Position is the current value, which comes from bind:value in code.
export default {
  example: figma.code`<Slider bind:value${variant !== 'range' ? figma.code` variant="${variant}"` : ''}${variant === 'delta' || marker ? ' defaultValue={50}' : ''}${variant === 'hue' ? ' max={360}' : ''}${variant === 'opacity' ? ' color={color}' : ''}${variant === 'stepper' ? ' step={25}' : ''}${disabled ? ' disabled' : ''} />`,
  imports,
  id: 'slider',
  metadata: { nestable: true, props: { imports } },
}
