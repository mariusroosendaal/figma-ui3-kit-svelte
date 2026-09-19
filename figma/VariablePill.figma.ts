// url=<UI3_FILE>?node-id=2028-79753
// source=src/components/VariablePill/index.svelte
// component=VariablePill
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { VariablePill } from 'figma-ui3-kit-svelte'"]

const state = instance.getEnum('🐣 State', {
  'Default': '',
  'Hover': '',
  'Selected': ' selected',
  'On Selected': ' onSelected',
  'Soft Deleted': ' muted',
  'Value Not Rendered': ' muted',
  'Disabled Secondary': ' disabled',
  'Disabled Tertiary': ' disabled',
})
let label = ''
const value = instance.findText('Value')
if (value && value.type === 'TEXT') label = value.textContent

// Hover is runtime state.
export default {
  example: figma.code`<VariablePill label="${label}"${state} />`,
  imports,
  id: 'variable-pill',
  metadata: { nestable: true, props: { imports, label } },
}
