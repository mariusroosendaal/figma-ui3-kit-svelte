// url=<UI3_FILE>?node-id=2028-79619
// source=src/components/NumericInputMulti/index.svelte
// component=NumericInputMulti
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { NumericInputMulti } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const disabled = instance.getEnum('🎛️ Disabled', { 'True': true, 'False': false })
const partial = instance.getEnum('👥 Variant', { 'Default': false, 'Partial Disable': true })
const empty = instance.getEnum('🐣 State', { 'Default': false, 'Focused': false, 'Empty': true })

const values = instance
  .findLayers((node) => node.type === 'TEXT')
  .filter((node) => node.type === 'TEXT' && /^-?\d+(\.\d+)?$/.test(node.textContent))
  .map((node) => (empty ? 'null' : node.textContent))

let iconCode
const icon = instance.getInstanceSwap('🎛️  Icon Lead')
if (icon && icon.type === 'INSTANCE') iconCode = render(icon)

// Partial Disable greys out the last cell only.
const disabledAttr = partial
  ? ` disabled={[${values.map((_, i) => i === values.length - 1).join(', ')}]}`
  : disabled
    ? ' disabled'
    : ''

export default {
  example: figma.code`<NumericInputMulti bind:values${iconCode ? figma.code` iconName={${iconCode}}` : ''}${disabledAttr} />`,
  imports,
  id: 'numeric-input-multi',
  metadata: { nestable: true, props: { imports, values } },
}
