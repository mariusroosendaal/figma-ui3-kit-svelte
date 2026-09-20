// url=<UI3_FILE>?node-id=2015-27780
// source=src/components/Tabs/index.svelte
// component=Tabs
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Tabs } from 'figma-ui3-kit-svelte'"]

// Each tab is a nested (unpublished) _Tab instance; read its label and selection
// directly. 🐣 Tab Count is implied by the number of tabs found.
// Tab instances only: a tab's badge is an instance too.
const tabs = instance.findLayers((node) => node.type === 'INSTANCE' && /tab/i.test(node.name))

const labels = []
let selectedTab = 0
tabs.forEach((tab, i) => {
  if (tab.type !== 'INSTANCE') return
  // 🎛️ Badge shows a count in a nested "Badge small alt"
  let badge = ''
  let unread = false
  if (tab.getBoolean('🎛️ Badge')) {
    const [text] = tab.findLayers((node) => node.type === 'TEXT' && node.textContent !== tab.getString('Text'))
    if (text && text.type === 'TEXT') badge = text.textContent
    // _Tab swaps the counter between Count New and Count Inactive, and reaches
    // for Count New only on the selected tab — so read the swap, not the tab.
    const counter = tab.findInstance('Badge small alt', { traverseInstances: true })
    if (counter && counter.type === 'INSTANCE') {
      unread = counter.getEnum('👥 Variant', {
        'Default': false,
        'Count New': true,
        'Count Inactive': false,
        'Strong': false,
      })
    }
  }
  const fields = [`label: ${JSON.stringify(tab.getString('Text'))}`]
  if (badge) fields.push(`badge: ${/^\d+$/.test(badge) ? badge : JSON.stringify(badge)}`)
  if (badge && unread) fields.push('unread: true')
  labels.push(`{ ${fields.join(', ')} }`)
  if (tab.getEnum('🐣 Selected', { 'True': true, 'False': false })) selectedTab = i
})

export default {
  example: figma.code`<Tabs tabs={[${labels.join(', ')}]}${selectedTab ? ` selectedTab={${selectedTab}}` : ''} />`,
  imports,
  id: 'tabs',
  metadata: { nestable: true, props: { imports } },
}
