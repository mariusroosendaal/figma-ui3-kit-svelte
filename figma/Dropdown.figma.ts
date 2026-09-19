// url=<UI3_FILE>?node-id=2028-36589
// source=src/components/Dropdown/index.svelte
// component=Dropdown
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Dropdown } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const disabled = instance.getEnum('🎛️ Disabled', { 'False': false, 'True': true })
const iconLead = instance.getEnum('🎛️ Icon Lead', { 'False': false, 'True': true })

let text = ''
const value = instance.findText('Value')
if (value && value.type === 'TEXT') text = value.textContent

let iconCode
if (iconLead) {
  const icon = instance.getInstanceSwap('↪ Icon')
  if (icon && icon.type === 'INSTANCE') iconCode = render(icon)
}

// Menu items come from code, so the trigger text becomes the placeholder.
// 👥 Size, 🎛️ Stroke and 🐣 State have no code props and aren't mapped.
export default {
  example: figma.code`<Dropdown menuItems={menuItems} bind:value placeholder="${text}"${iconCode ? figma.code` iconName={${iconCode}}` : ''}${disabled ? ' disabled' : ''} />`,
  imports,
  id: 'dropdown',
  metadata: { nestable: true, props: { imports } },
}
