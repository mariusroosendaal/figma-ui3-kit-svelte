// url=<UI3_FILE>?node-id=2015-20365
// source=src/components/Radio/index.svelte
// component=Radio
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Radio } from 'figma-ui3-kit-svelte'"]

const showLabel = instance.getEnum('🎛️ Label', { 'True': true, 'False': false })
const button = instance.getEnum('👥 Variant', { 'Input': false, 'Button': true })
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

// 🐣 On? (and the Button variant's Active state) is bind:group in code. A row of
// Button radios sits in <RadioGroup direction="horizontal">.
export default {
  example: label
    ? figma.code`<Radio bind:group={selected} value="${value}"${button ? ' variant="button"' : ''}${disabled ? ' disabled' : ''}>${label}</Radio>`
    : figma.code`<Radio bind:group={selected} value="${value}"${button ? ' variant="button"' : ''}${disabled ? ' disabled' : ''} />`,
  imports,
  id: 'radio',
  metadata: { nestable: true, props: { imports } },
}
