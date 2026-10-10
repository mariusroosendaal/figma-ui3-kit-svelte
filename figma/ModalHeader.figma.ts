// url=<UI3_FILE>?node-id=2327-122026
// source=src/components/ModalHeader/index.svelte
// component=ModalHeader
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Modal } from 'figma-ui3-kit-svelte'"]

// Plugins set the header through Modal's props: headerVariant, onback, headerTabs,
// or the header snippet for the Dropdown variant.
const variant = instance.getEnum('👥 Variant', {
  'Default': 'default',
  'Navigation': 'navigation',
  'Tabs': 'tabs',
  'Dropdown': 'dropdown',
})
const title = instance.getString('Title')
const icon2 = instance.getBoolean('👁️ Icon 2')

const tabs = instance
  .findLayers((node) => node.type === 'INSTANCE' && /tab/i.test(node.name) && node.name !== 'Tabs')
  .filter((node) => node.type === 'INSTANCE')
  .map((tab) => JSON.stringify(tab.getString('Text')))

let dropdownText = ''
if (variant === 'dropdown') {
  const texts = instance.findLayers((node) => node.type === 'TEXT').filter((node) => node.type === 'TEXT')
  if (texts[0]) dropdownText = texts[0].textContent
}

const head =
  variant === 'navigation'
    ? figma.code` headerVariant="navigation" onback={goBack}`
    : variant === 'tabs'
      ? figma.code` headerVariant="tabs" headerTabs={[${tabs.join(', ')}]} bind:selectedTab`
      : ''

// 👁️ Link (Copy link) has no code prop.
export default {
  example:
    variant === 'dropdown'
      ? figma.code`<Modal bind:isOpen title="${title}"${icon2 ? ' icon2 icon2Name={icon}' : ''}>
  {#snippet header()}
    <Dropdown menuItems={menuItems} bind:value placeholder="${dropdownText}" />
  {/snippet}
</Modal>`
      : figma.code`<Modal bind:isOpen title="${title}"${head}${icon2 ? ' icon2 icon2Name={icon}' : ''}>…</Modal>`,
  imports:
    variant === 'dropdown'
      ? [...imports, "import { Dropdown } from 'figma-ui3-kit-svelte'"]
      : imports,
  id: 'modal-header',
  metadata: { nestable: true, props: { imports } },
}
