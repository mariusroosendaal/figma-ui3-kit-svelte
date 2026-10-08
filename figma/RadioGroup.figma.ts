// url=<UI3_FILE>?node-id=1027216-162
// source=src/components/RadioGroup/index.svelte
// component=RadioGroup
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { RadioGroup } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}
// A nested child's code can span lines; indent each, not only the first.
const indented = (sections, indent) =>
  sections.map((s) =>
    s.type === 'CODE'
      ? { ...s, code: s.code.replace(/\n/g, `\n${indent}`) }
      : s.type === 'INSTANCE' && s.resultSections
        ? { ...s, resultSections: indented(s.resultSections, indent) }
        : s,
  )

// Render the slot's connected children inline; getSlot() is the fallback for
// unconnected content (it makes Dev Mode emit helper functions). Icons are
// skipped: they're chrome (e.g. the chevron), not slot content.
function slot(name, indent) {
  const children = instance.findConnectedInstances((node) => !(node.codeConnectId() || '').startsWith('icon.'))
  if (!children.length) return instance.getSlot(name)
  let code
  children.forEach((child) => {
    const example = indented(render(child), indent)
    code = code ? figma.code`${code}\n${indent}${example}` : example
  })
  return code
}

const legend = instance.getBoolean('👁️ Legend') ? instance.getString('🎛️ Legend') : ''
// Button radios sit in a row
const buttons = instance
  .findConnectedInstances((node) => node.codeConnectId() === 'radio')
  .some((node) => node.type === 'INSTANCE' && node.getPropertyValue('👥 Variant') === 'Button')
const radios = slot('Radios slot', '  ')

export default {
  example: figma.code`<RadioGroup${legend ? figma.code` legend="${legend}"` : ''}${buttons ? ' direction="horizontal"' : ''}>
  ${radios}
</RadioGroup>`,
  imports,
  id: 'radio-group',
  metadata: { nestable: true, props: { imports } },
}
