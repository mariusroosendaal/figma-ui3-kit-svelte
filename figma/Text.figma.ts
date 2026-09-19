// url=<UI3_FILE>?node-id=1027216-156
// source=src/components/Text/index.svelte
// component=Text
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Text } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const text = instance.getString('🎛️ Text')
const variant = instance.getEnum('👥 Variant', {
  'heading-large': 'heading-large',
  'heading-medium': 'heading-medium',
  'heading-small': 'heading-small',
  'body-large': 'body-large',
  'body-large-strong': 'body-large-strong',
  'body-medium': 'body-medium',
  'body-medium-strong': 'body-medium-strong',
  'body-small': 'body-small',
  'body-small-strong': 'body-small-strong',
})
const color = instance.getEnum('🎛️ Color', {
  'Default': '',
  'Secondary': '--figma-color-text-secondary',
  'Tertiary': '--figma-color-text-tertiary',
})

export default {
  example: figma.code`<Text${variant !== 'body-medium' ? figma.code` variant="${variant}"` : ''}${color ? figma.code` color="${color}"` : ''}>${text}</Text>`,
  imports,
  id: 'text',
  metadata: { nestable: true, props: { imports } },
}
