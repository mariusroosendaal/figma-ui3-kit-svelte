// url=<UI3_FILE>?node-id=1027231-25918
// source=src/components/Dropdown/index.svelte
// component=Dropdown
import figma from 'figma';
const instance = figma.selectedInstance;

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Dropdown } from 'figma-ui3-kit-svelte'"];
const render = (handle) => {
  const result = handle.executeTemplate();
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports;
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i));
  return result.example;
};

// A Kit addition, not a UI3 component: UI3's Dropdown (node 2028-36589) carries
// neither a lead chit nor a badge. It follows UI3's own composition grammar —
// Menu row/Complex nests a Badge small behind a Trail enum, Color input nests a
// Chit 24 as its lead — so the Figma properties are named the same way, and both
// map onto props the one Svelte Dropdown already takes.
const lead = instance.getEnum('🎛️ Lead', { False: 'none', Icon: 'icon', Chit: 'chit' });
const trail = instance.getEnum('🎛️ Trail', { False: 'none', Badge: 'badge' });

let text = '';
const value = instance.findText('Value');
if (value && value.type === 'TEXT') text = value.textContent;

let iconCode;
if (lead === 'icon') {
  const icon = instance.getInstanceSwap('↪ Icon');
  if (icon && icon.type === 'INSTANCE') iconCode = render(icon);
}

// The chit renders through its own template, which reports the colour as code.
let chitCode;
if (lead === 'chit') {
  const chit = instance.findInstance('Chit 24');
  if (chit && chit.type === 'INSTANCE') chitCode = render(chit);
}

// Badge small exposes no text property in UI3, so the label is an instance
// override — read it off the layer rather than through getString.
let badgeText = '';
let badgeVariant = 'default';
if (trail === 'badge') {
  const badge = instance.findInstance('Badge small');
  if (badge && badge.type === 'INSTANCE') {
    badgeVariant = badge.getEnum('👥 Variant', {
      Default: 'default',
      Brand: 'brand',
      Component: 'component',
      Danger: 'danger',
      Feedback: 'feedback',
      FigJam: 'figjam',
      Invert: 'invert',
      Selected: 'selected',
      Success: 'success',
      Variable: 'variable',
      'Variable Selected': 'variable-selected',
      Warn: 'warning',
      Merged: 'merged',
      Archived: 'archived',
      Menu: 'menu',
    });
    const label = badge.findText('Badge', { traverseInstances: true });
    if (label && label.type === 'TEXT') badgeText = label.textContent;
  }
}

// Menu items come from code, so the trigger text becomes the placeholder.
export default {
  example: figma.code`<Dropdown menuItems={menuItems} bind:value placeholder="${text}"${
    iconCode ? figma.code` iconName={${iconCode}}` : ''
  }${chitCode ? figma.code` chit={${chitCode}}` : ''}${badgeText ? ` badge="${badgeText}"` : ''}${
    badgeText && badgeVariant !== 'default' ? ` badgeVariant="${badgeVariant}"` : ''
  } />`,
  imports,
  id: 'dropdown-badge',
  metadata: { nestable: true, props: { imports } },
};
