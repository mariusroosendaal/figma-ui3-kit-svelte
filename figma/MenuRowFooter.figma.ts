// url=<UI3_FILE>?node-id=2327-96342
// source=src/components/Menu/index.svelte
// component=Menu
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Menu } from 'figma-ui3-kit-svelte'"]

// A "+ label" row at the end of a menu: Menu's footerLabel with footerVariant="row".
const text = instance.getString('🎛️ Text')

export default {
  example: figma.code`<Menu bind:isOpen menuItems={menuItems} footerLabel="${text}" footerVariant="row" on:footer={handleFooter} />`,
  imports,
  id: 'menu-row-footer',
  metadata: { nestable: true, props: { imports, kind: 'footer', text } },
}
