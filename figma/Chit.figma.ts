// url=<UI3_FILE>?node-id=2028-79673
// source=src/components/Chit/index.svelte
// component=Chit
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Chit } from 'figma-ui3-kit-svelte'"]

const shape = instance.getEnum('👥 Variant', { 'Square': 'square', 'Circle': 'circle' })
const type = instance.getEnum('🐣 Type', {
  'Fill': 'fill',
  'Opacity': 'opacity',
  'Image': 'image',
  'Gradient': 'gradient',
  'Instance': 'instance',
})

// Code Connect can't read a fill, so the colour is left to the code.
const source =
  type === 'image'
    ? figma.code` image={imageUrl}`
    : type === 'gradient'
      ? figma.code` color={gradient}`
      : type === 'opacity'
        ? figma.code` color={color} opacity={opacity}`
        : figma.code` color={color}`

// 🐣 Type Instance is a component thumbnail, not a colour, and has no equivalent.
export default {
  example: figma.code`<Chit${source}${shape === 'circle' ? ' shape="circle"' : ''} />`,
  imports,
  id: 'chit',
  metadata: { nestable: true, props: { imports } },
}
