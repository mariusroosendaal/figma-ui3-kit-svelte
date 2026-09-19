// url=<UI3_FILE>?node-id=2327-96288
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

const label = instance.getString('🎛️ Text')
const checked = instance.getEnum('🐣 Toggle State', { 'On': true, 'Off': false })
const detail = instance.getBoolean('👁️ hasShortcut') ? instance.getString('↪ Shortcut') : ''
const hasIcon = instance.getEnum('👁️ hasIcon', { 'true': true, 'false': false })

let iconName = ''
if (hasIcon) {
  const icon = instance.getInstanceSwap('↪ Icon')
  if (icon && icon.type === 'INSTANCE') iconName = iconOf(icon)
}

// Inside a Menu this row becomes `{ type: 'toggle', checked }`, which keeps the menu open.
export default {
  example: figma.code`<MenuItem variant="toggle"${checked ? ' selected' : ''}${iconName ? figma.code` iconName={${iconName}}` : ''}${detail ? figma.code` detail="${detail}"` : ''}>${label}</MenuItem>`,
  imports,
  id: 'menu-item-toggle',
  metadata: { nestable: true, props: { imports, iconImports, kind: 'item', type: 'toggle', label, checked, iconName, detail } },
}
