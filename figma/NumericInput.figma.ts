// url=<UI3_FILE>?node-id=2028-79190
// source=src/components/NumericInput/index.svelte
// component=NumericInput
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { NumericInput } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const disabled = instance.getEnum('🎛️  Disabled', { 'True': true, 'False': false })
const empty = instance.getEnum('🐣 State', { 'Empty': true, 'Default': false, 'Hover': false, 'Focused': false, 'Focuse': false })
const dropdown = instance.getEnum('🐣 Dropdown', { 'True': true, 'False': false })
const varPill = instance.getEnum('🐣 Var pill', { 'True': true, 'False': false })

let text = ''
const value = instance.findText('Value')
if (value && value.type === 'TEXT') text = value.textContent

// The lead is a letter drawn as an icon (icon.24.prop-text) or a real icon.
let label = ''
let iconCode
const lead = instance.getInstanceSwap('🎛️ Icon Lead')
if (lead && lead.type === 'INSTANCE') {
  if (lead.name === 'icon.24.prop-text') {
    const glyph = lead.findText('Icon')
    if (glyph && glyph.type === 'TEXT') label = glyph.textContent
  } else {
    iconCode = render(lead)
  }
}

// Var pill: the value is bound; the pill's text names the variable.
let variable = ''
if (varPill) {
  const pill = instance.findInstance('_Chip variable')
  if (pill && pill.type === 'INSTANCE') {
    const name = pill.findText('Value')
    if (name && name.type === 'TEXT') variable = name.textContent
  }
}

const valueAttr = variable
  ? figma.code` value={value} variable="${variable}" on:detach`
  : empty
    ? figma.code` placeholder="${text}"`
    : figma.code` value={${text}}`

// 🐣 Var icon (the bind-variable affordance) has no code prop; 🐣 Dropdown becomes
// `options` (presets live in code).
export default {
  example: figma.code`<NumericInput${valueAttr}${label ? figma.code` label="${label}"` : ''}${iconCode ? figma.code` iconName={${iconCode}}` : ''}${dropdown ? ' options={[]}' : ''}${disabled ? ' disabled' : ''} />`,
  imports,
  id: 'numeric-input',
  metadata: { nestable: true, props: { imports } },
}
