// url=<UI3_FILE>?node-id=1027216-25160
// source=src/components/DisclosureItem/index.svelte
// component=DisclosureItem
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { DisclosureItem } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

// Render the slot's connected children inline; getSlot() is the fallback for
// unconnected content (it makes Dev Mode emit helper functions). Icons are
// skipped: they're chrome (e.g. the chevron), not slot content.
function slot(name, indent) {
  const children = instance.findConnectedInstances((node) => !(node.codeConnectId() || '').startsWith('icon.'))
  if (!children.length) return instance.getSlot(name)
  let code
  children.forEach((child) => {
    const example = render(child)
    code = code ? figma.code`${code}\n${indent}${example}` : example
  })
  return code
}

const title = instance.getString('🎛️ Title')
const open = instance.getEnum('🐣 Expanded', { 'False': false, 'True': true })
const section = instance.getEnum('🎛️ Section', { 'False': false, 'True': true })
const attrs = figma.code` title="${title}"${section ? ' section' : ''}${open ? ' open' : ''}`

// Collapsed items hide their content in Figma, so only expanded ones render it.
export default {
  example: open
    ? figma.code`<DisclosureItem${attrs}>
  ${slot('Content slot', '  ')}
</DisclosureItem>`
    : figma.code`<DisclosureItem${attrs} />`,
  imports,
  id: 'disclosure-item',
  metadata: { nestable: true, props: { imports } },
}
