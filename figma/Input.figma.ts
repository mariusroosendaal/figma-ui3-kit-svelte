// url=<UI3_FILE>?node-id=2028-79255
// source=src/components/Input/index.svelte
// component=Input
import figma from 'figma'
const instance = figma.selectedInstance

// Figma's "Text input" covers both kit components: Multi Line is a Textarea.
const variant = instance.getEnum('👥 Variant', {
  'Single Line': 'input',
  'Multi Line': 'textarea',
  'Quick Action': 'input',
})
const size = instance.getEnum('👥 Size', { 'Default': 'default', 'Large': 'large' })
const state = instance.getEnum('🐣 State', {
  'Default': 'filled',
  'Focus': 'filled',
  'Disabled': 'disabled',
  'Active': 'filled',
  'Variable': 'filled',
  'Empty': 'empty',
  'Active Empty': 'empty',
  'Active Filled': 'filled',
})
const iconLead = instance.getEnum('🎛️  Icon Lead', { 'True': true, 'False': false })
// 🎛️ Label only drives the Variable state's text, so read the visible layer instead.
let text = ''
for (const name of ['Value', 'Text']) {
  const layer = instance.findText(name)
  if (layer && layer.type === 'TEXT') {
    text = layer.textContent
    break
  }
}

let iconCode
if (iconLead && variant === 'input') {
  const [icon] = instance.findLayers((node) => node.type === 'INSTANCE' && node.name.startsWith('icon.'))
  if (icon && icon.type === 'INSTANCE') iconCode = icon.executeTemplate().example
}

// Empty states show placeholder text; every other state shows a value.
const textAttr = state === 'empty' ? figma.code` placeholder="${text}"` : figma.code` value="${text}"`
const disabled = state === 'disabled' ? ' disabled' : ''

// 🎛️ Dropdown, 👁️ Chip and ↪ Click Blinker have no code equivalent; Quick Action renders as Input.
export default {
  example:
    variant === 'textarea'
      ? figma.code`<Textarea${textAttr}${disabled} />`
      : figma.code`<Input${textAttr}${size !== 'default' ? figma.code` size="${size}"` : ''}${iconCode ? figma.code` iconName={${iconCode}}` : ''}${disabled} />`,
  imports: [
    variant === 'textarea'
      ? "import { Textarea } from 'figma-ui3-kit-svelte'"
      : "import { Input } from 'figma-ui3-kit-svelte'",
  ],
  id: 'input',
  metadata: { nestable: true },
}
