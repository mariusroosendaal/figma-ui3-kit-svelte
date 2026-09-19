// url=<UI3_FILE>?node-id=1027222-26144
// source=src/components/Tree/index.svelte
// component=Tree
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Tree } from 'figma-ui3-kit-svelte'"]
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

// One row. The kit's Tree is data-driven, so inside a Tree the parent template
// nests rows by Depth; alone, it renders as a one-node Tree.
const label = instance.getString('🎛️ Label')
const detail = instance.getBoolean('👁️ Detail') ? instance.getString('🎛️ Detail') : ''
const depth = Number(instance.getEnum('🎛️ Depth', { '0': '0', '1': '1', '2': '2', '3': '3' }))
const twisty = instance.getEnum('🐣 Twisty', { 'None': 'none', 'Closed': 'closed', 'Open': 'open' })
const selected = instance.getEnum('🐣 Selected', { 'False': false, 'True': true })

let iconName = ''
if (instance.getBoolean('👁️ Icon')) {
  const icon = instance.getInstanceSwap('↪ Icon')
  if (icon && icon.type === 'INSTANCE') iconName = iconOf(icon)
}

let checked = null
if (instance.getBoolean('👁️ Checkbox')) {
  const box = instance.findInstance('Checkbox')
  if (box && box.type === 'INSTANCE') {
    checked = box.getEnum('🐣 Type', { 'Checked': true, 'Unchecked': false, 'Mixed': 'mixed' }) || false
  }
}

const id = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') || 'node'
const fields = [`id: '${id}'`, `label: ${JSON.stringify(label)}`]
if (iconName) fields.push(`iconName: ${iconName}`)
if (detail) fields.push(`detail: ${JSON.stringify(detail)}`)

export default {
  example: figma.code`<Tree nodes={[{ ${fields.join(', ')} }]}${checked !== null ? ' mode="check"' : selected ? ` mode="single" selected="${id}"` : ''} />`,
  imports,
  id: 'tree-row',
  metadata: {
    nestable: true,
    props: { imports, iconImports, kind: 'tree-row', id, label, detail, iconName, depth, twisty, selected, checked },
  },
}
