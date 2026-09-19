// url=<UI3_FILE>?node-id=2015-20960
// source=src/components/SegmentedControl/index.svelte
// component=SegmentedControl
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { SegmentedControl, Segment } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const variant = instance.getEnum('👥 Variant', { 'Icon': 'icon', 'Label': 'label' })
const disabled = instance.getEnum('🐣 State', { 'Default': false, 'Disabled': true })

const slug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') || 'option'

// Segments are nested (unpublished) _Segment instances; 👥 Tab Count is implied
// by how many are found. Values are derived from each segment's label, and
// 🐣 Active is the initial selection, which comes from bind:value in code.
const segments = instance.findLayers((node) => node.type === 'INSTANCE')
const seen = new Set()
let segmentsCode = figma.code``

segments.forEach((seg, i) => {
  if (seg.type !== 'INSTANCE') return
  const text = variant === 'label' ? seg.getString('🎛️ Label') : seg.getString('🎛️ Text')
  let value = slug(text)
  if (seen.has(value)) value = `${value}-${i + 1}`
  seen.add(value)

  let segment
  if (variant === 'icon') {
    const icon = seg.getInstanceSwap('🎛️ Icon')
    const iconCode = icon && icon.type === 'INSTANCE' ? render(icon) : undefined
    segment = figma.code`<Segment value="${value}"${iconCode ? figma.code` iconName={${iconCode}}` : ''} tooltip="${text}" />`
  } else {
    segment = figma.code`<Segment value="${value}">${text}</Segment>`
  }
  segmentsCode = figma.code`${segmentsCode}\n  ${segment}`
})

export default {
  example: figma.code`<SegmentedControl bind:value${disabled ? ' disabled' : ''}>${segmentsCode}\n</SegmentedControl>`,
  imports,
  id: 'segmented-control',
  metadata: { nestable: true, props: { imports } },
}
