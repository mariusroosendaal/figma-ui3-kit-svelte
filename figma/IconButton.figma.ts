// url=<UI3_FILE>?node-id=2324-46757
// source=src/components/IconButton/index.svelte
// component=IconButton
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { IconButton } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const variant = instance.getEnum('👥 Variant', { 'Default': 'default', 'Secondary': 'secondary' })
const disabled = instance.getEnum('🎛️ Disabled', { 'False': false, 'True': true })

let iconCode
const icon = instance.getInstanceSwap('🎛️ Icon')
if (icon && icon.type === 'INSTANCE') {
  iconCode = render(icon)
}

// 🐣 State (hover/focus/active) is runtime interaction state and isn't mapped.
export default {
  example: figma.code`<IconButton${iconCode ? figma.code` iconName={${iconCode}}` : ''}${variant !== 'default' ? figma.code` variant="${variant}"` : ''}${disabled ? ' disabled' : ''} />`,
  imports,
  id: 'icon-button',
  metadata: { nestable: true, props: { imports } },
}
