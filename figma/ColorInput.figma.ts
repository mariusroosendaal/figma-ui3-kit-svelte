// url=<UI3_FILE>?node-id=2028-79525
// source=src/components/ColorInput/index.svelte
// component=ColorInput
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { ColorInput } from 'figma-ui3-kit-svelte'"]

const type = instance.getEnum('🐣 Type', {
  'Fill': 'fill',
  'Opacity': 'fill',
  'Image': 'other',
  'Gradient': 'other',
  'Variable': 'variable',
})
const disabled = instance.getEnum('🐣 State', { 'Default': false, 'Focus': false, 'Disabled': true })

// Text layers are named after their sample content, so read them by shape: the
// hex is six hex digits, the opacity a number, a variable its name.
const texts = instance
  .findLayers((node) => node.type === 'TEXT')
  .filter((node) => node.type === 'TEXT')
  .map((node) => node.textContent.trim())
const hex = texts.find((t) => /^[0-9a-f]{6}$/i.test(t)) || ''
const opacity = texts.find((t) => /^\d{1,3}$/.test(t)) || ''
const name = texts.find((t) => t !== hex && t !== opacity && t !== '%') || ''

// Image and Gradient fills have no kit equivalent; they render as a color.
export default {
  example:
    type === 'variable'
      ? figma.code`<ColorInput value="#000000" variable="${name}" />`
      : figma.code`<ColorInput value="#${hex || '000000'}"${opacity ? figma.code` opacity={${opacity}}` : ''}${disabled ? ' disabled' : ''} />`,
  imports,
  id: 'color-input',
  metadata: { nestable: true, props: { imports } },
}
