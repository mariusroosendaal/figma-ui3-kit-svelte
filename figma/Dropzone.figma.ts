// url=<UI3_FILE>?node-id=1028012-479
// source=src/components/Dropzone/index.svelte
// component=Dropzone
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Dropzone } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const compact = instance.getEnum('👥 Size', { 'Default': false, 'Compact': true })
// Dragging is the drag-over look, which the component draws itself
const state = instance.getEnum('🐣 State', { 'Default': 'default', 'Dragging': 'default', 'Disabled': 'disabled', 'Invalid': 'invalid' })

// The button is an exposed UI3 Button; its label is the button's own property
let buttonLabel = 'Choose files'
const button = instance.findInstance('Button')
if (button && button.type === 'INSTANCE') buttonLabel = button.getString('🎛️ Label')

const hint = instance.getBoolean('👁️ Hint') ? instance.getString('🎛️ Hint') : ''
const errorMessage = state === 'invalid' ? instance.getString('🎛️ Error') : ''

// Compact has no illustration; otherwise a hidden icon is iconName={null}
let iconCode
let noIcon = false
if (!compact) {
  if (!instance.getBoolean('👁️ Icon')) noIcon = true
  else {
    const icon = instance.getInstanceSwap('↪ Icon')
    if (icon && icon.type === 'INSTANCE') iconCode = render(icon)
  }
}

export default {
  example: figma.code`<Dropzone${buttonLabel !== 'Choose files' ? figma.code` buttonLabel="${buttonLabel}"` : ''}${hint ? figma.code` hint="${hint}"` : ''}${iconCode ? figma.code` iconName={${iconCode}}` : ''}${noIcon ? ' iconName={null}' : ''}${compact ? ' compact' : ''}${state === 'disabled' ? ' disabled' : ''}${state === 'invalid' ? figma.code` invalid errorMessage="${errorMessage}"` : ''} />`,
  imports,
  id: 'dropzone',
  metadata: { nestable: true, props: { imports } },
}
