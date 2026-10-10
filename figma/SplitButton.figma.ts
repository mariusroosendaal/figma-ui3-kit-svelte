// url=<UI3_FILE>?node-id=2324-46856
// source=src/components/SplitButton/index.svelte
// component=SplitButton
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { SplitButton } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const size = instance.getEnum('👥 Size', { 'Small': 'small', 'Large': 'large' })
const disabled = instance.getEnum('🐣 State', {
  'Default': false,
  'Hover': false,
  'Primary Focus': false,
  'Secondary Focus': false,
  'Primary Active': false,
  'Secondary Active': false,
  'Disabled': true,
})
const icon = instance.getInstanceSwap('🎛️ Icon')
const iconCode = icon && icon.type === 'INSTANCE' ? render(icon) : undefined

// The menu's items live in code.
export default {
  example: figma.code`<SplitButton${iconCode ? figma.code` iconName={${iconCode}}` : ''}${size !== 'small' ? figma.code` size="${size}"` : ''}${disabled ? ' disabled' : ''} ariaLabel="" menuItems={[]} onclick={run} onselect={choose} />`,
  imports,
  id: 'split-button',
  metadata: { nestable: true, props: { imports } },
}
