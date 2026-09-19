// url=<UI3_FILE>?node-id=2028-79408
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

// A value with a chevron of presets: NumericInput with `options`.
const iconLead = instance.getEnum('🎛️  Icon Lead', { 'True': true, 'False': false })

let text = ''
const value = instance.findText('Value')
if (value && value.type === 'TEXT') text = value.textContent

let iconCode
if (iconLead) {
  const [icon] = instance.findLayers(
    (node) => node.type === 'INSTANCE' && node.name.startsWith('icon.') && !node.name.includes('chevron')
  )
  if (icon && icon.type === 'INSTANCE') iconCode = render(icon)
}

// 🐣 Variable (a bound variable chip) has no kit equivalent.
export default {
  example: figma.code`<NumericInput value={${text}}${iconCode ? figma.code` iconName={${iconCode}}` : ''} options={[]} />`,
  imports,
  id: 'combo-input',
  metadata: { nestable: true, props: { imports } },
}
