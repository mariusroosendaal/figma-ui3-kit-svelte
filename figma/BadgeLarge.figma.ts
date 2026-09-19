// url=<UI3_FILE>?node-id=2012-35016
// source=src/components/Badge/index.svelte
// component=Badge
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Badge } from 'figma-ui3-kit-svelte'"]

const [variant, strong] = instance.getEnum('👥 Variant', {
  'Default': ['default', true],
  'Strong': ['invert', true],
  'Merged': ['merged', false],
  'Archived': ['archived', false],
})
// The label isn't a component property, so take the text layer.
let text = ''
const [layer] = instance.findLayers((node) => node.type === 'TEXT')
if (layer && layer.type === 'TEXT') text = layer.textContent

// Merged and Archived draw a leading dot icon; pass iconName in code if wanted.
export default {
  example: figma.code`<Badge size="large" variant="${variant}"${strong ? ' strong' : ''} text="${text}" />`,
  imports,
  id: 'badge-large',
  metadata: { nestable: true, props: { imports } },
}
