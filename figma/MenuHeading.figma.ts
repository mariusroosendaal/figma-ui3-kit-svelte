// url=<UI3_FILE>?node-id=2327-96347
// source=src/components/MenuHeading/index.svelte
// component=MenuHeading
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { MenuHeading } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const text = instance.getString('🎛️ Text')
const alignment = instance.getEnum('🎛️ Alignment', { 'Default': 'default', 'Toggle': 'toggle' })

export default {
  example: figma.code`<MenuHeading text="${text}"${alignment === 'toggle' ? ' alignment="toggle"' : ''} />`,
  imports,
  id: 'menu-heading',
  metadata: { nestable: true, props: { imports, kind: 'heading', text } },
}
