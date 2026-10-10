// url=<UI3_FILE>?node-id=2012-63744
// source=src/components/SidebarRow/index.svelte
// component=SidebarRow
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { SidebarRow } from 'figma-ui3-kit-svelte'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const selected = instance.getEnum('🐣 State', { 'Default': false, 'Hover': false, 'Selected': true })
const unread = instance.getEnum('🎛️  Unread', { 'False': false, 'True': true })
const replies = instance.getEnum('🎛️  Replies', { 'False': false, 'True': true })

const attr = (name, value) => (value ? ` ${name}=${JSON.stringify(value)}` : '')
const props = [
  attr('meta', instance.getString('NumPage')),
  attr('title', instance.getString('Name')),
  attr('detail', instance.getString('Timestamp')),
  attr('message', instance.getString('Message')),
  replies ? attr('link', instance.getString('Reply Count')) : '',
  unread ? ' unread' : '',
  selected ? ' selected' : '',
].join('')

// The avatars are the lead; the icons, shown on hover, are the actions.
const lead = instance
  .findConnectedInstances(() => true, { path: ['Content', 'Avatar List'] })
  .map((avatar) => render(avatar))
const actions = instance
  .findConnectedInstances(() => true, { path: ['Content', 'Icons'] })
  .map((icon) => {
    const name = icon.name.replace(/^icon\.\d+\./, '')
    return figma.code`<IconButton iconName={${render(icon)}} ariaLabel="${name[0].toUpperCase()}${name.slice(1)}" />`
  })
if (actions.length) {
  const line = "import { IconButton } from 'figma-ui3-kit-svelte'"
  if (!imports.includes(line)) imports.push(line)
}

const snippet = (name, items) => {
  if (!items.length) return ''
  let code
  items.forEach((item) => {
    code = code ? figma.code`${code}\n    ${item}` : item
  })
  return figma.code`
  {#snippet ${name}()}
    ${code}
  {/snippet}`
}

const body = figma.code`${snippet('lead', lead)}${snippet('actions', actions)}`

export default {
  example: lead.length || actions.length
    ? figma.code`<SidebarRow${props} onclick={open}${replies ? ' onlink={openReplies}' : ''}>${body}
</SidebarRow>`
    : figma.code`<SidebarRow${props} onclick={open}${replies ? ' onlink={openReplies}' : ''} />`,
  imports,
  id: 'sidebar-row',
  metadata: { nestable: true, props: { imports } },
}
