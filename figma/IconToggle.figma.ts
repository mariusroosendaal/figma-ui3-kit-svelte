// url=<UI3_FILE>?node-id=2324-46776
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

// "Button icon toggle": the icon swaps. The Highlighted variant has its own
// pair of icons and shows the selected fill while on.
const highlighted = instance.getEnum('👥 Variant', { 'Default': false, 'Highlighted': true })
const pressed = instance.getEnum('🎛️ On', { 'False': false, 'True': true })
const disabled = instance.getEnum('🎛️ Disabled', { 'False': false, 'True': true })

const off = instance.getInstanceSwap(highlighted ? '🎛️ Off Icon (Highlighted)' : '🎛️ Off Icon')
const on = instance.getInstanceSwap(highlighted ? '🎛️ On Icon (Highlighted)' : '🎛️ On Icon')
const offCode = off && off.type === 'INSTANCE' ? render(off) : undefined
const onCode = on && on.type === 'INSTANCE' ? render(on) : undefined

// 🐣 State (hover/focus/active) is runtime interaction state and isn't mapped.
export default {
  example: figma.code`<IconToggle bind:pressed${offCode ? figma.code` iconName={${offCode}}` : ''}${onCode ? figma.code` iconNameOn={${onCode}}` : ''}${highlighted ? ' highlighted' : ''}${disabled ? ' disabled' : ''} ariaLabel="" />`,
  imports,
  id: 'icon-toggle',
  metadata: { nestable: true, props: { imports, pressed } },
}
