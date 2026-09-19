// url=<UI3_FILE>?node-id=2324-46757
// source=src/components/IconButton/index.svelte
// component=IconButton
import figma from 'figma'
const instance = figma.selectedInstance

const variant = instance.getEnum('👥 Variant', { 'Default': 'default', 'Secondary': 'secondary' })
const disabled = instance.getEnum('🎛️ Disabled', { 'False': false, 'True': true })

let iconCode
const icon = instance.getInstanceSwap('🎛️ Icon')
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

// 🐣 State (hover/focus/active) is runtime interaction state and isn't mapped.
export default {
  example: figma.code`<IconButton${iconCode ? figma.code` iconName={${iconCode}}` : ''}${variant !== 'default' ? figma.code` variant="${variant}"` : ''}${disabled ? ' disabled' : ''} />`,
  imports: ["import { IconButton } from 'figma-ui3-kit-svelte'"],
  id: 'icon-button',
  metadata: { nestable: true },
}
