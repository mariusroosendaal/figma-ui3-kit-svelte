// url=<UI3_FILE>?node-id=2327-96028
// source=src/components/MenuItem/index.svelte
// component=MenuItem
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { MenuItem } from 'figma-ui3-kit-svelte'"]

const label = instance.getString('🎛️ Text')
const disabled = instance.getEnum('🐣 State', { 'Default': false, 'Hover': false, 'Disabled': true })
const hasSubMenu = instance.getEnum('🎛️ Submenu', { 'False': false, 'True': true })
const detail = instance.getBoolean('👁️ hasShortcut') && !hasSubMenu ? instance.getString('↪ Shortcut') : ''

// Standalone snippet uses MenuItem; inside a Menu the parent template reads
// metadata.props to build menuItems (the kit's Menu is data-driven).
export default {
  example: figma.code`<MenuItem${detail ? figma.code` detail="${detail}"` : ''}${disabled ? ' disabled' : ''}${hasSubMenu ? ' hasSubMenu' : ''}>${label}</MenuItem>`,
  imports,
  id: 'menu-item',
  metadata: { nestable: true, props: { imports, kind: 'item', label, disabled, detail, hasSubMenu } },
}
