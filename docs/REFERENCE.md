# figma-ui3-kit-svelte component reference

[figma-ui3-kit-svelte](https://github.com/mariusroosendaal/figma-ui3-kit-svelte) — 25+ Svelte 4 components matching Figma's UI3 design system, with light/dark theme support and 700+ icons.

If `$ARGUMENTS` names a specific component, show just that component's usage. Otherwise give the full reference.

## Installation

```bash
npm install figma-ui3-kit-svelte
```

Import components:

```javascript
import { Button, Input, Dropdown, Tabs, Text, Modal } from "figma-ui3-kit-svelte";
```

Enable Figma theme support in `code.ts`:

```typescript
figma.showUI(__html__, { themeColors: true, width: 300, height: 400 });
```

---

## Components

### Button

```svelte
<Button variant="primary" on:click={handler}>Create variants</Button>
<Button variant="secondary" on:click={handler}>Cancel</Button>
<Button variant="destructive" on:click={handler}>Delete</Button>
<Button variant="secondary-destructive" on:click={handler}>Remove</Button>
<Button variant="inverse">Inverse</Button>
<Button variant="success">Done</Button>
<Button variant="link" on:click={handler}>Learn more</Button>
<Button variant="link-danger" on:click={handler}>Delete account</Button>
<Button variant="ghost">Ghost</Button>
<Button size="large" variant="primary">Large</Button>
<Button size="wide" variant="primary">Full width</Button>
<Button variant="primary" iconName={IconCheck}>With icon</Button>
<Button disabled>Unavailable</Button>
```

Props: `variant` (`"primary"` | `"secondary"` | `"destructive"` | `"secondary-destructive"` | `"inverse"` | `"success"` | `"link"` | `"link-danger"` | `"ghost"`), `size` (`"default"` | `"large"` | `"wide"`), `iconName` (SVG import), `iconLead` (`"left"` | `"center"`, wide variant only), `label`, `disabled`, `ariaDisabled`.

`ariaDisabled` keeps the button in the tab order while blocking clicks and applying disabled styling — use it instead of `disabled` when a `<Tooltip>` needs to be keyboard-accessible (so users can focus the button and read why it's unavailable).

---

### Input

```svelte
<Input bind:value={text} placeholder="Layer name..." />
<Input bind:value={num} type="number" />
<Input bind:value={text} disabled />
```

Props: `value`, `placeholder`, `type`, `disabled`.

---

### Textarea

```svelte
<Textarea bind:value={content} placeholder="Paste JSON here..." rows={4} />
```

Props: `value`, `placeholder`, `rows`, `disabled`.

---

### Dropdown

```svelte
<script>
  const options = [
    { label: "Small", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" },
  ];
  let selected = options[0];
</script>

<Dropdown menuItems={options} bind:value={selected} placeholder="Select size" />
```

Props: `menuItems` (array of `{ label, value }`), `value`, `placeholder`, `disabled`.

---

### Tabs

```svelte
<script>
  const tabs = [{ label: "Settings" }, { label: "Preview" }, { label: "Export" }];
  let selectedTab = 0;
</script>

<Tabs {tabs} bind:selectedTab />

{#if selectedTab === 0}
  <!-- Settings panel -->
{:else if selectedTab === 1}
  <!-- Preview panel -->
{/if}
```

Props: `tabs` (array of `{ label }`), `selectedTab` (0-based index).

---

### Text

```svelte
<Text variant="heading-large">Title</Text>
<Text variant="heading-medium">Section</Text>
<Text variant="heading-small">Label</Text>
<Text variant="body-large">Body text</Text>
<Text variant="body-medium">Body text</Text>
<Text variant="body-small" color="secondary">Helper text</Text>
<Text variant="body-medium-strong">Bold body</Text>
```

Props: `variant` (see above), `color` (`"primary"` | `"secondary"` | `"brand"` | `"danger"` | `"disabled"`).

---

### Checkbox

```svelte
<Checkbox bind:checked={isEnabled}>Enable feature</Checkbox>
<Checkbox bind:checked={val} disabled>Unavailable</Checkbox>
```

Props: `checked`, `disabled`.

---

### Radio

```svelte
<script>
  let selected = "left";
</script>

<Radio bind:group={selected} value="left">Left</Radio>
<Radio bind:group={selected} value="center">Center</Radio>
<Radio bind:group={selected} value="right">Right</Radio>
```

Props: `group`, `value`, `disabled`.

---

### Switch

```svelte
<Switch bind:checked={isOn}>Dark mode</Switch>
```

Props: `checked`, `disabled`.

---

### Slider

```svelte
<Slider bind:value={opacity} min={0} max={100} step={1} />
```

Props: `value`, `min`, `max`, `step`, `disabled`.

---

### Badge

```svelte
<Badge>New</Badge>
<Badge variant="warning">Beta</Badge>
```

Props: `variant` (`"default"` | `"success"` | `"warning"` | `"danger"`).

---

### Banner

```svelte
<Banner variant="info">Select at least one frame to continue.</Banner>
<Banner variant="warning">This will overwrite existing variables.</Banner>
<Banner variant="danger">Plugin API unavailable.</Banner>
<Banner variant="success">Variables created.</Banner>
```

Props: `variant` (`"info"` | `"success"` | `"warning"` | `"danger"`).

---

### Chip

```svelte
<Chip>Tag</Chip>
<Chip active>Active tag</Chip>
<Chip on:click={handler}>Clickable</Chip>
```

Props: `active`, `disabled`.

---

### Label

```svelte
<Label>Collection name</Label>
```

---

### Tooltip

```svelte
<Tooltip label="This is a tooltip">
  <IconButton iconName={IconInfo} />
</Tooltip>

<Tooltip label="Undo" hotkey direction="Top">
  <IconButton iconName={IconUndo} />
</Tooltip>
```

Props: `label`, `direction` (`"Top"` | `"Bottom"` | `"Left"` | `"Right"`), `hotkey` (boolean, shows keyboard hint), `hotkeyText` (string, overrides auto-generated hotkey text).

---

### Modal

```svelte
<script>
  let isOpen = false;
</script>

<Button on:click={() => (isOpen = true)}>Open settings</Button>

<Modal bind:isOpen title="Settings">
  <!-- Modal content -->
  <svelte:fragment slot="footer">
    <Button variant="primary" on:click={() => (isOpen = false)}>Save</Button>
  </svelte:fragment>
</Modal>

<!-- Custom size and position -->
<Modal bind:isOpen title="Confirm" width="small" position="bottom" footerVariant="split">
  <p>Are you sure?</p>
  <svelte:fragment slot="footer">
    <Button variant="secondary" on:click={() => (isOpen = false)}>Cancel</Button>
    <Button variant="destructive" on:click={confirm}>Delete</Button>
  </svelte:fragment>
</Modal>
```

Key props: `isOpen`, `title`, `width` (`"small"` 240px | `"medium"` 320px | `"large"` 480px | custom string), `height` (`"auto"` | `"50vh"` | `"80vh"` | custom string), `position` (`"center"` | `"left"` | `"right"` | `"bottom"`), `headerVariant`, `footerVariant`, `footerBorder`, `showOverlay`, `closeOnOverlayClick`, `closeOnEscape`, `onClose`, `contentPadding`.

---

### Disclosure / DisclosureItem

```svelte
<Disclosure>
  <DisclosureItem title="Advanced options">
    <!-- Hidden content -->
  </DisclosureItem>
</Disclosure>
```

---

### Menu / MenuItem / MenuDivider / MenuHeading

```svelte
<Menu>
  <MenuHeading>Actions</MenuHeading>
  <MenuItem on:click={handleEdit}>Edit</MenuItem>
  <MenuItem on:click={handleDuplicate}>Duplicate</MenuItem>
  <MenuDivider />
  <MenuItem variant="destructive" on:click={handleDelete}>Delete</MenuItem>
</Menu>
```

---

### Icon

```svelte
<script>
  import { Icon } from "figma-ui3-kit-svelte";
  import Icon24Eye from "figma-ui3-kit-svelte/src/icons/24/icon.24.eye.small.svg";
  import Icon16Check from "figma-ui3-kit-svelte/src/icons/16/icon.16.check.svg";
</script>

<Icon iconName={Icon24Eye} color="--figma-color-icon" />
<Icon iconName={Icon24Eye} color="--figma-color-icon-brand" spin />
<Icon iconText="W" color="--figma-color-text-brand" />
```

Props: `iconName` (SVG import), `iconText` (text fallback), `color` (CSS variable name), `spin`.

Available sizes: `16/` and `24/`. Naming pattern: `icon.{size}.{name}.svg`.

---

### IconButton

```svelte
<script>
  import { IconButton } from "figma-ui3-kit-svelte";
  import IconMore from "figma-ui3-kit-svelte/src/icons/16/icon.16.more.svg";
</script>

<IconButton iconName={IconMore} on:click={handler} />
<IconButton iconName={IconMore} active />
```

Props: `iconName`, `active`, `disabled`.

---

## Design tokens

All tokens are CSS custom properties injected by Figma (requires `themeColors: true`).

### Spacing

| Token | Value |
|---|---|
| `--size-xxxsmall` | 4px |
| `--size-xxsmall` | 8px |
| `--size-xsmall` | 16px |
| `--size-small` | 24px |
| `--size-medium` | 32px |
| `--size-large` | 40px |

### Border radius

| Token | Value |
|---|---|
| `--border-radius-small` | 2px |
| `--border-radius-medium` | 5px |
| `--border-radius-large` | 13px |

### Typography scales

`heading-large`, `heading-medium`, `heading-small`, `body-large`, `body-medium`, `body-small` (plus `-strong` variants).

```css
.custom {
  font-family: var(--font-stack);
  font-size: var(--body-medium-font-size);
  line-height: var(--body-medium-line-height);
}
```

### Color tokens

```css
--figma-color-text              --figma-color-bg
--figma-color-text-secondary    --figma-color-bg-secondary
--figma-color-text-brand        --figma-color-bg-brand
--figma-color-text-danger       --figma-color-bg-danger
--figma-color-text-disabled
--figma-color-border
--figma-color-border-selected
--figma-color-icon
--figma-color-icon-brand
--figma-color-icon-danger
```
