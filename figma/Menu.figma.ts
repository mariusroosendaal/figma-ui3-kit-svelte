// url=<UI3_FILE>?node-id=1027206-366
// source=src/components/Menu/index.svelte
// component=Menu
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Menu } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

// The kit's Menu is data-driven, so rows in the Items slot become menuItems.
// Headings and dividers start a new group; a heading also labels it.
const rows = instance.findConnectedInstances(() => true, { path: ['Items slot'] })
const items = []
let group = 'group-1'
let groupCount = 1
let labelNext = false
let grouped = false
let checkmark = false

rows.forEach((row) => {
  const props = row.executeTemplate().metadata.props || {}
  if (props.kind === 'divider' || props.kind === 'heading') {
    grouped = true
    groupCount += 1
    group = props.kind === 'heading' ? props.text : `group-${groupCount}`
    labelNext = props.kind === 'heading'
    return
  }
  if (props.kind !== 'item') return
  items.push({ label: props.label, group, showHeading: labelNext, selected: props.selected, subMenu: props.hasSubMenu })
  if (props.checkmark) checkmark = true
  labelNext = false
})

const lines = items.map((item) => {
  const fields = [`label: ${JSON.stringify(item.label)}`]
  if (grouped) fields.push(`group: ${JSON.stringify(item.group)}`)
  if (item.showHeading) fields.push('showHeading: true')
  if (item.selected) fields.push('selected: true')
  if (item.subMenu) fields.push('subMenu: []')
  return `  { ${fields.join(', ')} },`
})

export default {
  example: figma.code`<Menu bind:isOpen${checkmark ? ' itemVariant="checkmark"' : ''} menuItems={[
${lines.join('\n')}
]} />`,
  imports,
  id: 'menu',
  metadata: { nestable: true, props: { imports } },
}
