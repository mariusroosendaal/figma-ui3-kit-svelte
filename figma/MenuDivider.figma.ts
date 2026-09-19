// url=<UI3_FILE>?node-id=2327-96331
// source=src/components/MenuDivider/index.svelte
// component=MenuDivider
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { MenuDivider } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

export default {
  example: figma.code`<MenuDivider />`,
  imports,
  id: 'menu-divider',
  metadata: { nestable: true, props: { imports, kind: 'divider' } },
}
