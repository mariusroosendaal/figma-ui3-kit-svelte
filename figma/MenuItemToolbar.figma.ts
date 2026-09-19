// url=<UI3_FILE>?node-id=2327-96311
// source=src/components/MenuItem/index.svelte
// component=MenuItem
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { MenuItem } from 'figma-ui3-kit-svelte'"]
const iconImports = []
// An icon template's example is its identifier; its import names it too.
const iconOf = (handle) => {
  const result = handle.executeTemplate()
  const nested = (result.metadata && result.metadata.props && result.metadata.props.imports) || []
  nested.forEach((i) => imports.includes(i) || imports.push(i))
  nested.forEach((i) => iconImports.includes(i) || iconImports.push(i))
  const match = /^import (\w+)/.exec(nested[0] || '')
  return match ? match[1] : ''
}

// A tool row: checkmark, the tool's icon, its name and its shortcut.
const label = instance.getString('🎛️ Text')
const checked = instance.getBoolean('🎛️ On')
const disabled = instance.getEnum('🐣 State', { 'Default': false, 'Hover': false, 'Disabled': true })
const detail = instance.getBoolean('👁️ hasShortcut') ? instance.getString('↪ Shortcut') : ''

let iconName = ''
const icon = instance.getInstanceSwap('🎛️ Icon')
if (icon && icon.type === 'INSTANCE') iconName = iconOf(icon)

export default {
  example: figma.code`<MenuItem variant="checkmark"${checked ? ' selected' : ''}${iconName ? figma.code` iconName={${iconName}}` : ''}${detail ? figma.code` detail="${detail}"` : ''}${disabled ? ' disabled' : ''}>${label}</MenuItem>`,
  imports,
  id: 'menu-item-toolbar',
  metadata: { nestable: true, props: { imports, iconImports, kind: 'item', type: 'check', label, checked, iconName, detail, disabled } },
}
