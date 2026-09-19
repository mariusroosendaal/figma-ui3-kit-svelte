// url=<UI3_FILE>?node-id=2015-20365
// source=src/components/Radio/index.svelte
// component=Radio
import figma from 'figma'
const instance = figma.selectedInstance

const showLabel = instance.getEnum('🎛️ Label', { 'True': true, 'False': false })
const disabled = instance.getEnum('🐣 State', {
  'Default': false,
  'Active': false,
  'Focused': false,
  'Disabled': true,
})

let label = ''
if (showLabel) {
  const value = instance.findText('Value')
  if (value && value.type === 'TEXT') label = value.textContent
}
const value = label ? label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : 'option'

// 🐣 On? is expressed through bind:group in code, and the Button variant has no
// code equivalent, so both render as a plain Radio.
export default {
  example: label
    ? figma.code`<Radio bind:group={selected} value="${value}"${disabled ? ' disabled' : ''}>${label}</Radio>`
    : figma.code`<Radio bind:group={selected} value="${value}"${disabled ? ' disabled' : ''} />`,
  imports: ["import { Radio } from 'figma-ui3-kit-svelte'"],
  id: 'radio',
  metadata: { nestable: true },
}
