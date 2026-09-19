// url=<UI3_FILE>?node-id=2015-24697
// source=src/components/Switch/index.svelte
// component=Switch
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Switch } from 'figma-ui3-kit-svelte'"]

const type = instance.getEnum('🐣 Type', { 'On': 'on', 'Off': 'off', 'Mixed': 'mixed' })
const disabled = instance.getEnum('🎛️ Disabled', { 'False': false, 'True': true })
const showLabel = instance.getBoolean('👁️ Label')

let label = ''
if (showLabel) {
  const value = instance.findText('Value')
  if (value && value.type === 'TEXT') label = value.textContent
}

const attrs = `${type === 'on' ? ' checked' : ''}${type === 'mixed' ? ' mixed' : ''}${disabled ? ' disabled' : ''}`

// 🐣 State (focus) is runtime state and 👁️ Description has no code prop; neither is mapped.
export default {
  example: label ? figma.code`<Switch${attrs}>${label}</Switch>` : figma.code`<Switch${attrs} />`,
  imports,
  id: 'switch',
  metadata: { nestable: true, props: { imports } },
}
