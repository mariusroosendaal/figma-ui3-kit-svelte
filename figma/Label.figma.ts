// url=<UI3_FILE>?node-id=1027216-161
// source=src/components/Label/index.svelte
// component=Label
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Label } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const text = instance.getString('🎛️ Label')
const size = instance.getEnum('👥 Size', { 'Medium': 'medium', 'Small': 'small' })

export default {
  example: figma.code`<Label${size === 'small' ? ' size="small"' : ''}>${text}</Label>`,
  imports,
  id: 'label',
  metadata: { nestable: true, props: { imports } },
}
