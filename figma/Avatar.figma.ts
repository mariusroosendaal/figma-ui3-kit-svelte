// url=<UI3_FILE>?node-id=2012-32015
// source=src/components/Avatar/index.svelte
// component=Avatar
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Avatar } from 'figma-ui3-kit-svelte'"]

const variant = instance.getEnum('👥 Variant', {
  'Photo': 'photo',
  'Org': 'photo',
  'Purple': 'purple',
  'Blue': 'blue',
  'Pink': 'pink',
  'Red': 'red',
  'Yellow': 'yellow',
  'Green': 'green',
  'Grey': 'grey',
  'Overflow Unread': 'overflow-unread',
  'Overflow Read': 'overflow',
})
const size = instance.getEnum('👥 Size', { 'Default': 'default', 'Small': 'small', 'Large': 'large' })
const shape = instance.getEnum('👥 Shape', { 'Circle': 'circle', 'Square': 'square' })
const disabled = instance.getEnum('🐣 State', { 'Default': false, 'Disabled': true })

// The initial (or the overflow count) is a text layer.
let text = ''
const [layer] = instance.findLayers((node) => node.type === 'TEXT')
if (layer && layer.type === 'TEXT') text = layer.textContent

const who =
  variant === 'photo'
    ? ' name={name} src={photoUrl}'
    : variant.startsWith('overflow')
      ? ` count={${text || 0}}${variant === 'overflow-unread' ? ' unread' : ''}`
      : ` name="${text}" color="${variant}"`

export default {
  example: figma.code`<Avatar${who}${size !== 'default' ? ` size="${size}"` : ''}${shape === 'square' ? ' shape="square"' : ''}${disabled ? ' disabled' : ''} />`,
  imports,
  id: 'avatar',
  metadata: { nestable: true, props: { imports, text, color: variant } },
}
