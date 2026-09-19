// url=<UI3_FILE>?node-id=2012-48557
// source=src/components/Button/index.svelte
// component=Button
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('🎛️ Label')

// The kit has no FigJam button; it renders closest to primary.
const variant = instance.getEnum('👥 Variant', {
  'Primary': 'primary',
  'Destructive': 'destructive',
  'Inverse': 'inverse',
  'Success': 'success',
  'FigJam': 'primary',
  'Secondary': 'secondary',
  'Secondary Destruct': 'secondary-destructive',
  'Link': 'link',
  'Link Danger': 'link-danger',
  'Ghost': 'ghost',
})

const size = instance.getEnum('👥 Size', {
  'Default': 'default',
  'Large': 'large',
  'Wide': 'wide',
})

const disabled = instance.getEnum('🎛️ Disabled', { 'False': false, 'True': true })

const iconLead = instance.getEnum('🎛️ Icon Lead', {
  'False': null,
  'Left-aligned': 'left',
  'Center-aligned': 'center',
})

let iconCode
if (iconLead) {
  const icon = instance.getInstanceSwap('↪ Icon')
  if (icon && icon.type === 'INSTANCE') {
    iconCode = icon.executeTemplate().example
  }
}

// 🐣 State (hover/focus/active) is runtime interaction state and 👁️ Hotkey has no
// code prop, so both are intentionally not mapped. Defaults are omitted for brevity.
export default {
  example: figma.code`<Button${variant !== 'primary' ? figma.code` variant="${variant}"` : ''}${size !== 'default' ? figma.code` size="${size}"` : ''}${iconCode ? figma.code` iconName={${iconCode}}` : ''}${iconCode && iconLead === 'center' ? ' iconLead="center"' : ''}${disabled ? ' disabled' : ''}>${label}</Button>`,
  imports: ["import { Button } from 'figma-ui3-kit-svelte'"],
  id: 'button',
  metadata: { nestable: true },
}
