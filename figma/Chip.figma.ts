// url=<UI3_FILE>?node-id=1027205-88
// source=src/components/Chip/index.svelte
// component=Chip
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Chip } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const label = instance.getString('🎛️ Label')
const variant = instance.getEnum('👥 Variant', { 'Default': 'default', 'Component': 'component' })
const state = instance.getEnum('🐣 State', { 'Default': 'default', 'Focused': 'focused', 'Disabled': 'disabled' })
const closable = instance.getBoolean('👁️ Close')

let iconCode
if (instance.getBoolean('👁️ Icon')) {
  const icon = instance.getInstanceSwap('↪ Icon')
  if (icon && icon.type === 'INSTANCE') iconCode = render(icon)
}

export default {
  example: figma.code`<Chip label="${label}"${variant !== 'default' ? figma.code` variant="${variant}"` : ''}${iconCode ? figma.code` iconName={${iconCode}}` : ''}${closable ? ' closable' : ''}${state === 'focused' ? ' focused' : ''}${state === 'disabled' ? ' disabled' : ''} />`,
  imports,
  id: 'chip',
  metadata: { nestable: true, props: { imports } },
}
