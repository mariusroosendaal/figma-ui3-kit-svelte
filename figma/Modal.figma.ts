// url=<UI3_FILE>?node-id=1027206-365
// source=src/components/Modal/index.svelte
// component=Modal
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Modal } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

// Render a slot's connected children inline; getSlot() is the fallback for
// unconnected content (it makes Dev Mode emit helper functions). `path` must list
// every frame between the instance and the slot. Optional slots with no connected
// children are omitted instead.
function slot(path, indent, optional = false) {
  const children = instance.findConnectedInstances(() => true, { path })
  if (!children.length) return optional ? '' : instance.getSlot(path[path.length - 1])
  let code
  children.forEach((child) => {
    const example = render(child)
    code = code ? figma.code`${code}\n${indent}${example}` : example
  })
  return code
}

const title = instance.getString('🎛️ Title')
const width = instance.getEnum('👥 Width', { 'Small': 'small', 'Medium': 'medium', 'Large': 'large' })
const footer = instance.getEnum('👥 Footer', { 'Split': 'split', 'Full': 'full', 'None': 'none' })
const footerBorder = footer !== 'none' && instance.getBoolean('👁️ Footer border')

let icon2Code
if (instance.getBoolean('👁️ Icon 2')) {
  const button = instance.findInstance('Icon 2')
  if (button && button.type === 'INSTANCE') {
    const icon = button.getInstanceSwap('🎛️ Icon')
    if (icon && icon.type === 'INSTANCE') icon2Code = render(icon)
  }
}

const fragment = (name, content) =>
  content ? figma.code`
  <svelte:fragment slot="${name}">
    ${content}
  </svelte:fragment>` : ''

const content = slot(['Content slot'], '  ')
let footerCode = ''
if (footer === 'split') {
  footerCode = figma.code`${fragment('footer-left', slot(['Footer', 'Footer left slot'], '    ', true))}${fragment('footer-right', slot(['Footer', 'Footer right slot'], '    '))}`
} else if (footer === 'full') {
  footerCode = fragment('footer-full', slot(['Footer', 'Footer full slot'], '    '))
}

export default {
  example: figma.code`<Modal bind:isOpen title="${title}"${width !== 'medium' ? figma.code` width="${width}"` : ''}${icon2Code ? figma.code` icon2 icon2Name={${icon2Code}}` : ''}${footer !== 'none' && !footerBorder ? ' footerBorder={false}' : ''}>
  ${content}${footerCode}
</Modal>`,
  imports,
  id: 'modal',
  metadata: { nestable: true, props: { imports } },
}
