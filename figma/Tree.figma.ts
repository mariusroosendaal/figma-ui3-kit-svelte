// url=<UI3_FILE>?node-id=1027222-26241
// source=src/components/Tree/index.svelte
// component=Tree
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Tree } from 'figma-ui3-kit-svelte'"]

// The kit's Tree is data-driven: rows in the Rows slot nest by their Depth.
const rows = instance
  .findConnectedInstances(() => true, { path: ['Rows slot'] })
  .map((row) => row.executeTemplate().metadata.props || {})
  .filter((props) => props.kind === 'tree-row')

rows.forEach((row) => (row.iconImports || []).forEach((i) => imports.includes(i) || imports.push(i)))

const roots = []
const stack = []
rows.forEach((row) => {
  const node = { row, children: [] }
  while (stack.length && stack[stack.length - 1].row.depth >= row.depth) stack.pop()
  if (stack.length) stack[stack.length - 1].children.push(node)
  else roots.push(node)
  stack.push(node)
})

const write = (node, indent) => {
  const r = node.row
  const fields = [`id: '${r.id}'`, `label: ${JSON.stringify(r.label)}`]
  if (r.iconName) fields.push(`iconName: ${r.iconName}`)
  if (r.detail) fields.push(`detail: ${JSON.stringify(r.detail)}`)
  if (node.children.length) {
    const kids = node.children.map((c) => write(c, indent + '  ')).join('\n')
    return `${indent}{ ${fields.join(', ')}, children: [\n${kids}\n${indent}] },`
  }
  return `${indent}{ ${fields.join(', ')} },`
}

const check = rows.some((r) => r.checked !== null && r.checked !== undefined)
const selected = rows.find((r) => r.selected)
// Parents drawn Closed mean only the Open ones start expanded.
const someClosed = rows.some((r) => r.twisty === 'closed')
const expanded = rows.filter((r) => r.twisty === 'open').map((r) => `'${r.id}'`)
// A parent's tick follows its leaves, so only leaves go into checked.
const isLeaf = (r, i) => !(rows[i + 1] && rows[i + 1].depth > r.depth)
const checked = rows.filter((r, i) => r.checked === true && isLeaf(r, i)).map((r) => `'${r.id}'`)

const attrs = [
  check ? ' mode="check"' : selected ? ` mode="single" selected="${selected.id}"` : '',
  someClosed ? ` expanded={[${expanded.join(', ')}]}` : '',
  check ? ` checked={[${checked.join(', ')}]}` : '',
].join('')

export default {
  example: figma.code`<Tree${attrs} nodes={[
${roots.map((n) => write(n, '  ')).join('\n')}
]} />`,
  imports,
  id: 'tree',
  metadata: { nestable: true, props: { imports } },
}
