// url=<UI3_FILE>?node-id=2012-35027
// source=src/components/Badge/index.svelte
// component=Badge
import figma from 'figma'
const instance = figma.selectedInstance

const variant = instance.getEnum('👥 Variant', {
  'Default': 'default',
  'Brand': 'brand',
  'Component': 'component',
  'Danger': 'danger',
  'Feedback': 'feedback',
  'FigJam': 'figjam',
  'Invert': 'invert',
  'Selected': 'selected',
  'Success': 'success',
  'Variable': 'variable',
  'Variable Selected': 'variable-selected',
  'Warn': 'warning',
  'Merged': 'merged',
  'Archived': 'archived',
  'Menu': 'menu',
})

const strong = instance.getEnum('🐣 Strong', { 'False': false, 'True': true })

// The label isn't a component property and its layer name differs per variant,
// so take the first text layer. The icon (🎛️ Icon Lead, or Feedback's trailing
// icon) is a nested instance without a swap property.
let text = ''
let iconCode
instance.findLayers((node) => {
  if (node.type === 'TEXT' && !text) text = node.textContent
  if (node.type === 'INSTANCE' && !iconCode) iconCode = node.executeTemplate().example
  return false
})

export default {
  example: figma.code`<Badge${variant !== 'default' ? figma.code` variant="${variant}"` : ''}${strong ? ' strong' : ''}${iconCode ? figma.code` iconName={${iconCode}}` : ''}>${text}</Badge>`,
  imports: ["import { Badge } from 'figma-ui3-kit-svelte'"],
  id: 'badge',
  metadata: { nestable: true },
}
