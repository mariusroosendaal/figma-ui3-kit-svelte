// url=<UI3_FILE>?node-id=2324-46817
// source=src/components/IconToggle/index.svelte
// component=IconToggle
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { IconToggle } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

// "Button icon dialog toggle": one icon on the selected fill while on.
const variant = instance.getEnum('👥 Variant', { 'Default': 'default', 'Secondary': 'secondary' })
const pressed = instance.getEnum('🎛️ On', { 'False': false, 'True': true })
const disabled = instance.getEnum('🎛️ Disabled', { 'False': false, 'True': true })

const icon = instance.getInstanceSwap('🎛️ Icon')
const iconCode = icon && icon.type === 'INSTANCE' ? render(icon) : undefined

// 🐣 State (hover/focus/active) is runtime interaction state and isn't mapped.
export default {
  example: figma.code`<IconToggle bind:pressed${iconCode ? figma.code` iconName={${iconCode}}` : ''}${variant !== 'default' ? figma.code` variant="${variant}"` : ''}${disabled ? ' disabled' : ''} ariaLabel="" />`,
  imports,
  id: 'icon-toggle-dialog',
  metadata: { nestable: true, props: { imports, pressed } },
}
