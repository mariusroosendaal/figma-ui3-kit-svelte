// url=<UI3_FILE>?node-id=2327-96049
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
const lead = instance.getEnum('🎛️ Lead', { 'False': 'none', 'Avatar': 'avatar', 'Icon': 'icon' })
const trail = instance.getEnum('🎛️ Trail', {
  'False': 'none',
  'Shortcut': 'detail',
  'Badge': 'badge',
  'Checkbox': 'checkbox',
  'Mixed': 'detail+checkbox',
})

// An avatar lead: its initial and colour (the Avatar template reports both).
let avatar = null
if (lead === 'avatar') {
  const person = instance.findInstance('Avatar')
  if (person && person.type === 'INSTANCE') {
    const props = person.executeTemplate().metadata.props || {}
    avatar = props.color === 'photo' ? { name: '' } : { name: props.text || '', color: props.color }
  }
}
const avatarCode = avatar ? ` avatar={{ name: ${JSON.stringify(avatar.name)}${avatar.color ? `, color: '${avatar.color}'` : ''} }}` : ''

let iconName = ''
if (lead === 'icon') {
  const [icon] = instance.findLayers((node) => node.type === 'INSTANCE' && node.name.startsWith('icon.'))
  if (icon && icon.type === 'INSTANCE') iconName = iconOf(icon)
}

const detail = trail === 'detail' || trail === 'detail+checkbox' ? instance.getString('🎛️ Shortcut') : ''

let badge = ''
if (trail === 'badge') {
  const badgeInstance = instance.findInstance('Badge small')
  if (badgeInstance && badgeInstance.type === 'INSTANCE') {
    const [text] = badgeInstance.findLayers((node) => node.type === 'TEXT')
    if (text && text.type === 'TEXT') badge = text.textContent
  }
}

let checked = false
const checkbox = trail === 'checkbox' || trail === 'detail+checkbox'
if (checkbox) {
  const box = instance.findInstance('Checkbox')
  if (box && box.type === 'INSTANCE') {
    checked = box.getEnum('🐣 Type', { 'Checked': true, 'Unchecked': false, 'Mixed': 'mixed' }) || false
  }
}

const attrs = [
  checkbox ? ' variant="checkbox"' : '',
  checked === 'mixed' ? ' selected="mixed"' : checked ? ' selected' : '',
].join('')

// Inside a Menu this row becomes `{ type: 'checkbox', checked, iconName, detail, badge }`.
export default {
  example: figma.code`<MenuItem${attrs}${avatarCode}${iconName ? figma.code` iconName={${iconName}}` : ''}${detail ? figma.code` detail="${detail}"` : ''}${badge ? figma.code` badge="${badge}"` : ''}>${label}</MenuItem>`,
  imports,
  id: 'menu-item-complex',
  metadata: {
    nestable: true,
    props: { imports, iconImports, kind: 'item', type: checkbox ? 'checkbox' : undefined, label, checked, iconName, avatar, detail, badge },
  },
}
