// url=<UI3_FILE>?node-id=2012-35086
// source=src/components/Badge/index.svelte
// component=Badge
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Badge } from 'figma-ui3-kit-svelte'"]

export default {
  example: figma.code`<Badge dot ariaLabel="Unread" />`,
  imports,
  id: 'badge-dot',
  metadata: { nestable: true, props: { imports } },
}
