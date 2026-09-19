// url=<UI3_FILE>?node-id=2015-27780
// source=src/components/Tabs/index.svelte
// component=Tabs
import figma from 'figma'
const instance = figma.selectedInstance

// Each tab is a nested (unpublished) _Tab instance; read its label and selection
// directly. 🐣 Tab Count is implied by the number of tabs found.
const tabs = instance.findLayers((node) => node.type === 'INSTANCE')

const labels = []
let selectedTab = 0
tabs.forEach((tab, i) => {
  if (tab.type !== 'INSTANCE') return
  labels.push(`{ label: ${JSON.stringify(tab.getString('Text'))} }`)
  if (tab.getEnum('🐣 Selected', { 'True': true, 'False': false })) selectedTab = i
})

export default {
  example: figma.code`<Tabs tabs={[${labels.join(', ')}]}${selectedTab ? ` selectedTab={${selectedTab}}` : ''} />`,
  imports: ["import { Tabs } from 'figma-ui3-kit-svelte'"],
  id: 'tabs',
  metadata: { nestable: true },
}
