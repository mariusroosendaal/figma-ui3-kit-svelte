// url=<UI3_FILE>?node-id=1027204-342
// source=src/components/Banner/index.svelte
// component=Banner
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Banner } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const variant = instance.getEnum('👥 Variant', {
  'Danger': 'danger',
  'Warning': 'warning',
  'Info': 'info',
  'Success': 'success',
})
const message = instance.getString('🎛️ Message')

export default {
  example: figma.code`<Banner variant="${variant}">${message}</Banner>`,
  imports,
  id: 'banner',
  metadata: { nestable: true, props: { imports } },
}
