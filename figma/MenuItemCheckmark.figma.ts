// url=<UI3_FILE>?node-id=2327-96252
// source=src/components/MenuItem/index.svelte
// component=MenuItem
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { MenuItem } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const label = instance.getString('🎛️ Text')
const disabled = instance.getEnum('🐣 State', { 'Default': false, 'Hover': false, 'Disabled': true })
const hasSubMenu = instance.getEnum('🎛️ Submenu', { 'False': false, 'True': true })
const shortcut = instance.getBoolean('👁️ hasShortcut') ? instance.getString('↪ Shortcut') : ''
// 👥 Variant Dot has no code equivalent; both render as the checkmark variant.
const selected = instance.getBoolean('🎛️ On')
const id = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') || 'item'

// Standalone snippet uses MenuItem; inside a Menu the parent template reads
// metadata.props to build menuItems (the kit's Menu is data-driven).
export default {
  example: figma.code`<MenuItem id="${id}" variant="checkmark"${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}${hasSubMenu ? ' hasSubMenu' : ''}>${label}${shortcut && !hasSubMenu ? figma.code`
  <svelte:fragment slot="trail">${shortcut}</svelte:fragment>
` : ''}</MenuItem>`,
  imports,
  id: 'menu-item-checkmark',
  metadata: { nestable: true, props: { imports, kind: 'item', label, selected: selected, checkmark: true, disabled, hasSubMenu } },
}
