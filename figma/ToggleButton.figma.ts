// url=<UI3_FILE>?node-id=1027239-26209
// source=src/components/ToggleButton/index.svelte
// component=ToggleButton
import figma from 'figma';
const instance = figma.selectedInstance;

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { ToggleButton } from 'figma-ui3-kit-svelte'"];
const render = (handle) => {
  const result = handle.executeTemplate();
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports;
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i));
  return result.example;
};

// A Kit addition, not a UI3 component: UI3 toggles only icons ("Button icon
// dialog toggle", node 2324-46817). This is that toggle with a label, so it
// borrows its On look — the selected fill, text and icon unchanged — and UI3's
// own composition grammar for the lead and trailing badge.
const pressed = instance.getEnum('🎛️ On', { False: false, True: true });
const lead = instance.getEnum('🎛️ Lead', { False: 'none', Icon: 'icon' });
const trail = instance.getEnum('🎛️ Trail', { False: 'none', Badge: 'badge' });

let label = '';
const labelNode = instance.findText('Label');
if (labelNode && labelNode.type === 'TEXT') label = labelNode.textContent;

let iconCode;
if (lead === 'icon') {
  const icon = instance.getInstanceSwap('↪ Icon');
  if (icon && icon.type === 'INSTANCE') iconCode = render(icon);
}

// Badge small alt exposes no text property in UI3, so the label is an instance
// override — read it off the layer rather than through getString. Count Inactive
// is what the button carries, and the On variants only override its fill, so the
// color comes from `pressed` in code rather than from a badgeVariant here.
let badgeText = '';
let badgeVariant = 'default';
if (trail === 'badge') {
  const badge = instance.findInstance('Badge small alt');
  if (badge && badge.type === 'INSTANCE') {
    badgeVariant = badge.getEnum('👥 Variant', {
      Default: 'default',
      'Count Inactive': 'default',
      'Count New': 'count',
      Strong: 'invert',
    });
    const text = badge.findText('Badge', { traverseInstances: true });
    if (text && text.type === 'TEXT') badgeText = text.textContent;
  }
}

// 🐣 State (hover/focus/active) is runtime interaction state and isn't mapped.
export default {
  example: figma.code`<ToggleButton bind:pressed label="${label}"${
    iconCode ? figma.code` iconName={${iconCode}}` : ''
  }${badgeText ? ` badge="${badgeText}"` : ''}${
    badgeText && badgeVariant !== 'default' ? ` badgeVariant="${badgeVariant}"` : ''
  } />`,
  imports,
  id: 'toggle-button',
  metadata: { nestable: true, props: { imports, pressed } },
};
