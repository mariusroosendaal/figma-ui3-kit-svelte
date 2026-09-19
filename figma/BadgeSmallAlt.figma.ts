// url=<UI3_FILE>?node-id=2012-35077
// source=src/components/Badge/index.svelte
// component=Badge
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Badge } from 'figma-ui3-kit-svelte'"]

// Tab and list counts. Default is the filled grey badge, Strong the inverse one.
const [variant, strong] = instance.getEnum('👥 Variant', {
  'Default': ['default', true],
  'Count New': ['count', false],
  'Count Inactive': ['count-inactive', false],
  'Strong': ['invert', true],
})
const text = instance.getString('Text')

export default {
  example: figma.code`<Badge variant="${variant}"${strong ? ' strong' : ''} text="${text}" />`,
  imports,
  id: 'badge-small-alt',
  metadata: { nestable: true, props: { imports } },
}
