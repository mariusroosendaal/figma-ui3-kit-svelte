// url=<UI3_FILE>?node-id=2327-96252
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
// The Dot variant marks a sub-menu holding the current choice: checked 'mixed'.
const dot = instance.getEnum('👥 Variant', { 'Check': false, 'Dot': true })
const on = instance.getBoolean('🎛️ On')
const checked = on ? (dot ? 'mixed' : true) : false
const selectedAttr = checked === 'mixed' ? ' selected="mixed"' : checked ? ' selected' : ''

// Inside a Menu this row becomes `{ type: 'check', checked }`.
export default {
  example: figma.code`<MenuItem variant="checkmark"${selectedAttr}${detail ? figma.code` detail="${detail}"` : ''}${disabled ? ' disabled' : ''}${hasSubMenu ? ' hasSubMenu' : ''}>${label}</MenuItem>`,
  imports,
  id: 'menu-item-checkmark',
  metadata: { nestable: true, props: { imports, kind: 'item', type: 'check', label, checked, disabled, detail, hasSubMenu } },
}
