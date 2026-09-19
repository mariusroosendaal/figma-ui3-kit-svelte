// url=<UI3_FILE>?node-id=2012-55461
// source=src/components/Checkbox/index.svelte
// component=Checkbox
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Checkbox } from 'figma-ui3-kit-svelte'"]

const type = instance.getEnum('🐣 Type', {
  'Checked': 'checked',
  'Unchecked': 'unchecked',
  'Mixed': 'mixed',
})
const disabled = instance.getEnum('🎛️ Disabled', { 'False': false, 'True': true })
const muted = instance.getEnum('🎛️ Muted', { 'False': false, 'True': true })
const ghost = instance.getEnum('🎛️ Ghost', { 'False': false, 'True': true })
const showLabel = instance.getBoolean('👁️ Label')

let label = ''
if (showLabel) {
  const value = instance.findText('Value')
  if (value && value.type === 'TEXT') label = value.textContent
}

// The description line
let description = ''
if (instance.getBoolean('👁️ Description')) {
  // The description's layer is named "Value" too, inside the Description frame.
  const text = instance.findText('Value', { path: ['Description'] })
  if (text && text.type === 'TEXT') description = text.textContent
}
const descriptionAttr = description ? figma.code` description="${description}"` : ''

// The Figma set has no plain unchecked variant — its default unchecked box is
// Muted=True — so Muted only maps to code for checked and mixed boxes.
const attrs = `${type === 'checked' ? ' checked' : ''}${type === 'mixed' ? ' mixed' : ''}${disabled ? ' disabled' : ''}${muted && type !== 'unchecked' ? ' muted' : ''}${ghost ? ' ghost' : ''}`

// 🐣 State (focus) is runtime state and isn't mapped.
export default {
  example: label
    ? figma.code`<Checkbox${attrs}${descriptionAttr}>${label}</Checkbox>`
    : figma.code`<Checkbox${attrs}${descriptionAttr} />`,
  imports,
  id: 'checkbox',
  metadata: { nestable: true, props: { imports } },
}
