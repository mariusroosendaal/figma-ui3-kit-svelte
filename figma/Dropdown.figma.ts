// url=<UI3_FILE>?node-id=2028-36589
// source=src/components/Dropdown/index.svelte
// component=Dropdown
import figma from 'figma'
const instance = figma.selectedInstance

const disabled = instance.getEnum('🎛️ Disabled', { 'False': false, 'True': true })
const iconLead = instance.getEnum('🎛️ Icon Lead', { 'False': false, 'True': true })

let text = ''
const value = instance.findText('Value')
if (value && value.type === 'TEXT') text = value.textContent

let iconCode
if (iconLead) {
  const icon = instance.getInstanceSwap('↪ Icon')
  if (icon && icon.type === 'INSTANCE') iconCode = icon.executeTemplate().example
}

// Menu items come from code, so the trigger text becomes the placeholder.
// 👥 Size, 🎛️ Stroke and 🐣 State have no code props and aren't mapped.
export default {
  example: figma.code`<Dropdown menuItems={menuItems} bind:value placeholder="${text}"${iconCode ? figma.code` iconName={${iconCode}}` : ''}${disabled ? ' disabled' : ''} />`,
  imports: ["import { Dropdown } from 'figma-ui3-kit-svelte'"],
  id: 'dropdown',
  metadata: { nestable: true },
}
