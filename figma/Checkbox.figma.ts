// url=<UI3_FILE>?node-id=2012-55461
// source=src/components/Checkbox/index.svelte
// component=Checkbox
import figma from 'figma'
const instance = figma.selectedInstance

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

// The Figma set has no plain unchecked variant — its default unchecked box is
// Muted=True — so Muted only maps to code for checked and mixed boxes.
const attrs = `${type === 'checked' ? ' checked' : ''}${type === 'mixed' ? ' mixed' : ''}${disabled ? ' disabled' : ''}${muted && type !== 'unchecked' ? ' muted' : ''}${ghost ? ' ghost' : ''}`

// 🐣 State (focus) is runtime state and 👁️ Description has no code prop; neither is mapped.
export default {
  example: label
    ? figma.code`<Checkbox${attrs}>${label}</Checkbox>`
    : figma.code`<Checkbox${attrs} />`,
  imports: ["import { Checkbox } from 'figma-ui3-kit-svelte'"],
  id: 'checkbox',
  metadata: { nestable: true },
}
