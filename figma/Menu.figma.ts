// url=<UI3_FILE>?node-id=1027206-366
// source=src/components/Menu/index.svelte
// component=Menu
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Menu } from 'figma-ui3-kit-svelte'"]

// The kit's Menu is data-driven, so rows become menuItems, built from what each
// row template reports in metadata.props. Headings and dividers start a new
// group; a heading also labels it. Icon imports come up from the rows.
// A Menu row/Footer becomes footerLabel with footerVariant="row".
let footer = ''
const buildItems = (rows) => {
  const items = []
  let group = 'group-1'
  let groupCount = 1
  let labelNext = false
  let grouped = false
  rows.forEach((row) => {
    const props = row.executeTemplate().metadata.props || {}
    if (props.kind === 'footer') {
      footer = props.text
      return
    }
    if (props.kind === 'divider' || props.kind === 'heading') {
      grouped = true
      groupCount += 1
      group = props.kind === 'heading' ? props.text : `group-${groupCount}`
      labelNext = props.kind === 'heading'
      return
    }
    if (props.kind !== 'item') return
    const icons = props.iconImports || []
    icons.forEach((i) => imports.includes(i) || imports.push(i))
    items.push({ ...props, group, showHeading: labelNext })
    labelNext = false
  })
  return items.map((item) => {
    const fields = [`label: ${JSON.stringify(item.label)}`]
    if (grouped) fields.push(`group: ${JSON.stringify(item.group)}`)
    if (item.showHeading) fields.push('showHeading: true')
    if (item.type) fields.push(`type: '${item.type}'`)
    if (item.type && item.checked) fields.push(`checked: ${JSON.stringify(item.checked)}`)
    if (item.iconName) fields.push(`iconName: ${item.iconName}`)
    if (item.avatar) {
      const color = item.avatar.color ? `, color: '${item.avatar.color}'` : ''
      fields.push(`avatar: { name: ${JSON.stringify(item.avatar.name)}${color} }`)
    }
    if (item.detail) fields.push(`detail: ${JSON.stringify(item.detail)}`)
    if (item.badge) fields.push(`badge: ${JSON.stringify(item.badge)}`)
    if (item.disabled) fields.push('disabled: true')
    if (item.hasSubMenu) fields.push('subMenu: []')
    return `  { ${fields.join(', ')} },`
  })
}

const lines = buildItems(instance.findConnectedInstances(() => true, { path: ['Items slot'] }))

export default {
  example: figma.code`<Menu bind:isOpen${footer ? figma.code` footerLabel="${footer}" footerVariant="row" on:footer={handleFooter}` : ''} menuItems={[
${lines.join('\n')}
]} />`,
  imports,
  id: 'menu',
  metadata: { nestable: true, props: { imports } },
}
