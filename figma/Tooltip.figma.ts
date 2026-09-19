// url=<UI3_FILE>?node-id=2015-39095
// source=src/components/Tooltip/index.svelte
// component=Tooltip
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Tooltip } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const label = instance.getString('🎛️ Label')
const hotkey = instance.getBoolean('👁️ Hotkey')
const direction = instance.getEnum('🎛️ Direction', {
  'TopCenter': 'Top',
  'BottomCenter': 'Bottom',
  'BottomLeft': 'BottomLeft',
  'BottomRight': 'BottomRight',
  'TopLeft': 'TopLeft',
  'TopRight': 'TopRight',
  'Right': 'Right',
  'Left': 'Left',
})

let hotkeyText = ''
if (hotkey) {
  const text = instance.findText('Hotkey')
  if (text && text.type === 'TEXT') hotkeyText = text.textContent
}

// The tooltip wraps its trigger in code; 🎛️ Title isn't shown in the default variant.
export default {
  example: figma.code`<Tooltip label="${label}"${direction !== 'Top' ? figma.code` direction="${direction}"` : ''}${hotkey ? ' hotkey' : ''}${hotkeyText && hotkeyText !== '⌘V' ? figma.code` hotkeyText="${hotkeyText}"` : ''}>
  <!-- trigger element -->
</Tooltip>`,
  imports,
  id: 'tooltip',
  metadata: { nestable: true, props: { imports } },
}
