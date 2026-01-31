# Figma Plugin UI3 Kit Svelte

A lightweight, modern Svelte component library for building Figma plugin interfaces that feel native to Figma's UI3 design system.

## Features

**Native Figma Design Language** – Components built to match Figma's UI3 specifications  
**Automatic Dark Mode** – Seamless light/dark theme support using Figma's CSS variables  
**Svelte-First** – Built with Svelte 4.x 

## Installation

```bash
npm install figma-ui3-kit-svelte
```

## Quick Start

```javascript
// Import the global CSS with Figma's design tokens
import { GlobalCSS } from 'figma-ui3-kit-svelte';

// Import the components you need
import { Button, Input, Modal, Text } from 'figma-ui3-kit-svelte';
```

```html
<Button variant="primary" on:click={handleClick}>
  Create Selection
</Button>

<Input 
  bind:value={searchQuery} 
  placeholder="Search layers..." 
/>

<Text variant="body-medium">
  Components that feel native to Figma
</Text>
```

### Enable Theme Support

To enable automatic dark mode in your plugin, pass `themeColors: true` when showing your UI:

```javascript
figma.showUI(__html__, { 
  themeColors: true,
  width: 400,
  height: 300
});
```

This enables Figma's native CSS variables that automatically adapt to the user's theme preference.

---

## Development

### Storybook

This project includes Storybook for component development and documentation:

```bash
# Start Storybook development server
npm run dev

# Build static Storybook for deployment
npm run build
```

Storybook opens at `http://localhost:6006` where you can browse, test, and document components.

**Online Documentation:**
The Storybook is automatically deployed to GitHub Pages on every push to `main`.

**Features:**
- Automatic light/dark theme switching based on OS preference
- Uses `figma-development-theme.css` for proper theming outside plugin context

---

## Components

_All components accept a `class` prop for custom styling and utility classes._

* [Badge](#badge) – Status and count indicators
* [Banner](#banner) – Informational banners
* [Button](#button) – Primary, secondary, and destructive actions
* [Checkbox](#checkbox) – Standard checkbox with label
* [Chip](#chip) – Removable tags
* [Disclosure](#disclosure) – Collapsible accordion panels
* [Dropdown](#dropdown) – Select dropdown
* [Icon](#icon) – Icon display with color control
* [Icon Button](#icon-button) – Clickable icon buttons
* [Input](#input) – Text input with icon support
* [Label](#labels) – Form labels
* [Menu](#menu) – Dropdown menus with items and dividers
* [Modal](#modal) – Dialogs and side panels
* [Radio](#radio-button) – Radio button groups
* [Slider](#slider) – Range slider with variants
* [Switch](#switch) – Toggle switch control
* [Tabs](#tabs) – Tab navigation
* [Text](#text) – UI3 typography component
* [Textarea](#textarea) – Multi-line text input
* [Tooltip](#tooltip) – Contextual help with hover tooltips

---

## Component Documentation

### Badge

Status and count indicators with multiple semantic variants.

```javascript
import { Badge } from 'figma-ui3-kit-svelte';
```

```html
<!-- Basic badges -->
<Badge>Default</Badge>
<Badge variant="brand">Brand</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="warning">Warning</Badge>

<!-- Strong variants (filled backgrounds) -->
<Badge variant="brand" strong>Brand Strong</Badge>
<Badge variant="success" strong>Success Strong</Badge>
<Badge variant="danger" strong>Danger Strong</Badge>

<!-- With icon (for specific variants) -->
<Badge variant="variable" iconName={IconVariable}>Variable</Badge>
<Badge variant="feedback" iconName={IconFeedback}>Feedback</Badge>
```

**Props**

| Prop       | Type    | Options/notes                                                    |
|:-----------|:--------|:-----------------------------------------------------------------|
| `variant`  | String  | Default: `"default"`, Options: `"brand"`, `"component"`, `"danger"`, `"success"`, `"warning"`, `"invert"`, `"selected"`, `"variable"`, `"variable-selected"`, `"feedback"`, `"merged"`, `"archived"`, `"menu"`, `"figjam"` |
| `strong`   | Boolean | Default: `false`; Use filled background instead of outline       |
| `iconName` | Var     | Optional icon (only for `variable`, `variable-selected`, `feedback`, `merged`, `archived` variants) |
| `text`     | String  | Badge text (can also use slot content)                           |

---

### Banner

Informational banners with automatic icons based on variant.

```javascript
import { Banner } from 'figma-ui3-kit-svelte';
```

```html
<Banner variant="danger">
  This action cannot be undone.
</Banner>

<Banner variant="warning">
  Please save your changes before continuing.
</Banner>

<Banner variant="info">
  Tip: You can use keyboard shortcuts for faster navigation.
</Banner>

<Banner variant="success">
  Your changes have been saved successfully.
</Banner>

<!-- Using message prop instead of slot -->
<Banner variant="info" message="This is an informational message." />
```

**Props**

| Prop      | Type   | Options/notes                                                    |
|:----------|:-------|:-----------------------------------------------------------------|
| `variant` | String | Default: `"danger"`, Options: `"danger"`, `"warning"`, `"info"`, `"success"` |
| `message` | String | Banner message (can also use slot content)                       |

---

### Button

The Button component provides multiple variants for different use cases.

```javascript
import { Button } from 'figma-ui3-kit-svelte';
```

```html
<Button on:click={handleSave}>Save Changes</Button>
<Button variant="secondary" on:click={handleCancel}>Cancel</Button>
<Button variant="destructive" on:click={handleDelete}>Delete</Button>
<Button variant="secondary-destructive" on:click={handleRemove}>Remove</Button>
<Button disabled>Disabled State</Button>
```

**Props**

| Prop          | Type    | Options/notes                                                   |
|:--------------|:--------|:----------------------------------------------------------------|
| `variant`     | String  | Default: `"primary"`, Options: `"secondary"`, `"destructive"`, `"secondary-destructive"`, `"inverse"`, `"success"`, `"link"`, `"link-danger"`, `"ghost"` |
| `size`        | String  | Default: `"default"`, Options: `"default"`, `"large"`, `"wide"` |
| `disabled`    | Boolean | Default: `false`                                                |
| `iconName`    | Var     | Optional icon to display in button                              |
| `iconLead`    | String  | Default: `"left"`, Options: `"left"`, `"center"` (only for `wide` size) |
| `label`       | String  | Button text (can also use slot content)                         |
| `on:click`    | Func    | Click handler. Ex: `on:click={handleClick}`                     |

---

### Checkbox

```javascript
import { Checkbox } from 'figma-ui3-kit-svelte';
```

```html
<Checkbox bind:checked={includeHidden}>
  Include hidden layers
</Checkbox>

<Checkbox checked on:change={handleChange}>
  Pre-checked option
</Checkbox>

<Checkbox disabled>
  Disabled option
</Checkbox>
```

**Props**

| Prop        | Type    | Options/notes                                                    |
|:------------|:--------|:-----------------------------------------------------------------|
| `checked`   | Boolean | Default: `false`; Bind with `bind:checked={variable}`           |
| `value`     | String  | Default: `""`; Form value when submitted                         |
| `disabled`  | Boolean | Default: `false`                                                 |
| `mixed`     | Boolean | Default: `false`; Indeterminate/mixed state                      |
| `muted`     | Boolean | Default: `false`; Secondary/muted styling                        |
| `ghost`     | Boolean | Default: `false`; Dark background variant                        |
| `tabindex`  | Number  | Default: `0`                                                     |
| `on:change` | Func    | Change handler. Ex: `on:change={handleChange}`                   |

---

### Chip

Removable tags for filtering and selection.

```javascript
import { Chip } from 'figma-ui3-kit-svelte';
```

```html
<!-- Basic chip -->
<Chip label="Tag name" />

<!-- Closable chip -->
<Chip label="Removable" closable on:close={handleRemove} />

<!-- With icon -->
<Chip label="With icon" iconName={IconTag} />

<!-- Component variant -->
<Chip label="Component" variant="component" />

<!-- States -->
<Chip label="Focused" focused />
<Chip label="Disabled" disabled />
```

**Props**

| Prop       | Type    | Options/notes                                                    |
|:-----------|:--------|:-----------------------------------------------------------------|
| `label`    | String  | Chip label text                                                  |
| `variant`  | String  | Default: `"default"`, Options: `"default"`, `"component"`        |
| `iconName` | Var     | Optional icon to display                                         |
| `closable` | Boolean | Default: `false`; Show close button                              |
| `focused`  | Boolean | Default: `false`; Focused/selected state                         |
| `disabled` | Boolean | Default: `false`                                                 |
| `on:close` | Func    | Close handler. Receives `{ label }` in event detail              |

---

### Disclosure

Collapsible panels for organizing content.

```javascript
import { Disclosure, DisclosureItem } from 'figma-ui3-kit-svelte';
```

```html
<!-- Accordion mode (default) - only one panel open at a time -->
<Disclosure>
  <DisclosureItem title="Export Settings" open>
    <Input placeholder="File name..." />
    <Checkbox>Include annotations</Checkbox>
  </DisclosureItem>
  
  <DisclosureItem title="Advanced Options">
    <Switch>Optimize for web</Switch>
  </DisclosureItem>
  
  <DisclosureItem title="History" section>
    <Text variant="body-small">Recent exports appear here</Text>
  </DisclosureItem>
</Disclosure>

<!-- Multiple mode - allows multiple panels open simultaneously -->
<Disclosure multiple>
  <DisclosureItem title="Panel 1" open>Content 1</DisclosureItem>
  <DisclosureItem title="Panel 2" open>Content 2</DisclosureItem>
</Disclosure>
```

**Disclosure Props**

| Prop       | Type    | Options/notes                                            |
|:-----------|:--------|:---------------------------------------------------------|
| `multiple` | Boolean | Default: `false`; When false, only one panel can be open (accordion). When true, multiple panels can be open. |

**DisclosureItem Props**

| Prop         | Type    | Options/notes                                            |
|:-------------|:--------|:---------------------------------------------------------|
| `title`      | String  | Panel title text                                         |
| `open`       | Boolean | Default: `false`; Initial open state                     |
| `expanded`   | Boolean | Default: `false`; Controlled expanded state              |
| `section`    | Boolean | Default: `false`; Bold section header styling            |
| `standalone` | Boolean | Default: `false`; Use outside of Disclosure wrapper      |

---

### Dropdown

Select dropdown for choosing from options.

```javascript
import { Dropdown } from 'figma-ui3-kit-svelte';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', group: 'Group 1' }
];

let selected = options[0];
```

```html
<Dropdown 
  bind:value={selected} 
  menuItems={options} 
  placeholder="Select an option" 
/>

<Dropdown 
  bind:value={selected} 
  menuItems={options} 
  disabled 
/>
```

**Props**

| Prop              | Type    | Options/notes                                                    |
|:------------------|:--------|:-----------------------------------------------------------------|
| `value`           | Object  | Selected item object. Bind with `bind:value={variable}`          |
| `menuItems`       | Array   | Array of objects `{ value, label, group, selected }`             |
| `placeholder`     | String  | Default: `"Please make a selection."`                            |
| `showGroupLabels` | Boolean | Default: `false`; Show group headers in menu                     |
| `disabled`        | Boolean | Default: `false`                                                 |
| `iconName`        | Var     | Optional icon to display in trigger                              |
| `on:change`       | Func    | Change handler                                                   |

---

### Icon

Display icons from the included icon set or your own custom SVG icons. The library includes 700+ icons in 16px and 24px sizes.

```javascript
import { Icon } from 'figma-ui3-kit-svelte';

// Import icons from the library (24px default)
import Icon24Eye from 'figma-ui3-kit-svelte/src/icons/24/icon.24.eye.small.svg';
import Icon24Search from 'figma-ui3-kit-svelte/src/icons/24/icon.24.search.small.svg';

// Or 16px icons for compact spaces
import Icon16Check from 'figma-ui3-kit-svelte/src/icons/16/icon.16.check.svg';

// Or use your own SVG
import CustomIcon from './assets/custom-icon.svg';
```

```html
<!-- Standard icon with color -->
<Icon iconName={Icon24Eye} color="--figma-color-icon" />

<!-- Loading spinner -->
<Icon iconName={Icon24Search} color="--figma-color-icon-brand" spin />

<!-- Text icon (useful for letter indicators) -->
<Icon iconText="W" color="--figma-color-text-brand" />

<!-- Custom icon -->
<Icon iconName={CustomIcon} color="--figma-color-icon-danger" />
```

**Props**

| Prop       | Type    | Options/notes                                                    |
|:-----------|:--------|:-----------------------------------------------------------------|
| `iconName` | Var     | Imported SVG icon. Ex: `iconName={Icon24Visible}`               |
| `iconText` | String  | Text character to display instead of icon. Ex: `iconText="W"`   |
| `color`    | String  | Default: `"--figma-color-icon"`; Figma color variable            |
| `size`     | Number  | Default: `24`; Icon size in pixels                               |
| `spin`     | Boolean | Default: `false`; Rotates icon continuously (for loaders)       |

**Icon Sizes**
- **24px icons** (default) – Use for most UI elements, found in `/icons/24/`
- **16px icons** (compact) – Use for tight spaces like checkboxes, found in `/icons/16/`

---

### Icon Button

Clickable icon buttons with hover states and variants.

```javascript
import { IconButton } from 'figma-ui3-kit-svelte';
import Icon24Eye from 'figma-ui3-kit-svelte/src/icons/24/icon.24.eye.small.svg';
```

```html
<IconButton 
  iconName={Icon24Eye} 
  on:click={toggleVisibility}
/>

<IconButton 
  iconName={Icon24Eye} 
  variant="secondary"
  on:click={toggleVisibility}
/>

<IconButton 
  iconText="@" 
  on:click={handleMention}
/>
```

**Props**

| Prop        | Type    | Options/notes                                                    |
|:------------|:--------|:-----------------------------------------------------------------|
| `iconName`  | Var     | Imported SVG icon                                                |
| `iconText`  | String  | Text character to display                                        |
| `variant`   | String  | Default: `"default"`; Options: `"default"`, `"secondary"`        |
| `disabled`  | Boolean | Default: `false`                                                 |
| `spin`      | Boolean | Default: `false`; Rotates icon continuously                      |
| `iconColor` | String  | Optional icon color override (e.g., `"--figma-color-icon-brand"`) |
| `tabindex`  | Number  | Default: `0`                                                     |
| `on:click`  | Func    | Click handler                                                    |

---

### Input

Text input field with optional icon support and various styling options.

```javascript
import { Input } from 'figma-ui3-kit-svelte';
import Icon24Search from 'figma-ui3-kit-svelte/src/icons/24/icon.24.search.small.svg';
```

```html
<!-- Basic input -->
<Input 
  bind:value={layerName} 
  placeholder="Layer name..." 
/>

<!-- With icon -->
<Input 
  bind:value={searchQuery}
  iconName={Icon24Search}
  placeholder="Search..."
/>

<!-- With validation error -->
<Input 
  bind:value={email}
  invalid
  errorMessage="Invalid email format"
/>

<!-- Large size -->
<Input value="Large input" size="large" />

<!-- Disabled -->
<Input value="Locked" disabled />
```

**Props**

| Prop           | Type    | Options/notes                                                    |
|:---------------|:--------|:-----------------------------------------------------------------|
| `value`        | String  | Input value. Bind with `bind:value={variable}`                   |
| `placeholder`  | String  | Default: `"Input something here..."`                             |
| `disabled`     | Boolean | Default: `false`                                                 |
| `iconName`     | Var     | Optional icon to display in input                                |
| `invalid`      | Boolean | Default: `false`; Shows error state                              |
| `errorMessage` | String  | Default: `"Error message"`; Shown when invalid                   |
| `size`         | String  | Default: `"default"`; Options: `"default"` (24px), `"large"` (32px) |
| `on:change`    | Func    | Change handler                                                   |
| `on:input`     | Func    | Input handler (fires on every keystroke)                         |

---

### Label

Semantic labels for form controls.

```javascript
import { Label } from 'figma-ui3-kit-svelte';
```

```html
<!-- Label with sizes -->
<Label>Default label (medium)</Label>
<Label size="medium">Medium label</Label>
<Label size="small">Small label</Label>

<!-- Label with form control -->
<Label>Layer name</Label>
<Input bind:value={name} />
```

**Props**

| Prop   | Type   | Options/notes                                      |
|:-------|:-------|:---------------------------------------------------|
| `size` | String | Default: `"medium"`, Options: `"medium"`, `"small"` |
| `text` | String | Label text (can also use slot content)             |

---

### Menu

Action-based dropdown menus with items, dividers, headings, and nested sub-menus.

```javascript
import { Menu, MenuItem, MenuDivider, MenuHeading } from 'figma-ui3-kit-svelte';
```

```html
<script>
  let menuOpen = false;
  let triggerElement;

  const menuItems = [
    { value: 'copy', label: 'Copy' },
    { value: 'paste', label: 'Paste' },
    { value: 'delete', label: 'Delete', group: 'Destructive' }
  ];

  function handleSelect(event) {
    console.log('Selected:', event.detail);
  }
</script>

<button bind:this={triggerElement} on:click={() => menuOpen = !menuOpen}>
  Open Menu
</button>

<Menu
  bind:isOpen={menuOpen}
  menuItems={menuItems}
  anchorElement={triggerElement}
  position="bottom-left"
  on:select={handleSelect}
/>
```

**Nested Menus:** Items can include a `subMenu` property for unlimited nesting levels. Sub-menus open on hover and support keyboard navigation.

```javascript
const menuItems = [
  { value: 'copy', label: 'Copy' },
  { 
    value: 'export', 
    label: 'Export', 
    subMenu: [
      { value: 'png', label: 'PNG' },
      { value: 'svg', label: 'SVG' }
    ]
  }
];
```

**Props**

| Prop              | Type    | Options/notes                                                    |
|:------------------|:--------|:-----------------------------------------------------------------|
| `isOpen`          | Boolean | Controls menu visibility. Bind with `bind:isOpen={variable}`     |
| `menuItems`       | Array   | Array of `{ value, label, group?, subMenu? }` objects            |
| `anchorElement`   | Element | DOM element to position menu relative to                         |
| `position`        | String  | Default: `"bottom-left"`, Options: `"bottom-left"`, `"bottom-right"`, `"top-left"`, `"top-right"` |
| `showGroupLabels` | Boolean | Default: `false`; Show group headers                             |
| `minWidth`        | String  | Optional minimum width (e.g., `"200px"`)                         |
| `itemVariant`     | String  | Default: `"default"`, Options: `"default"`, `"checkmark"`        |
| `nestingLevel`    | Number  | Default: `0`; Nesting level for z-index (0 = top-level)          |
| `on:select`       | Func    | Selection handler. Receives selected item in event detail        |
| `on:close`        | Func    | Close handler                                                    |

**Note:** Menu is action-based (not select-like). Use Dropdown for select behavior.

---

### Modal

Flexible modal dialogs with header, content area, and configurable footer layouts. Supports center positioning or side panels.

```javascript
import { Modal } from 'figma-ui3-kit-svelte';
```

```html
<!-- Basic modal with actions -->
<Modal bind:isOpen={showExportModal} title="Export Selection">
  <Text variant="body-medium">Choose your export format and settings.</Text>
  
  <svelte:fragment slot="footer-right">
    <Button variant="secondary" on:click={() => showExportModal = false}>
      Cancel
    </Button>
    <Button variant="primary" on:click={handleExport}>
      Export
    </Button>
  </svelte:fragment>
</Modal>

<!-- Modal with footer checkbox -->
<Modal bind:isOpen={showWarning} title="Delete Layers">
  <Text variant="body-medium">This action cannot be undone.</Text>
  
  <svelte:fragment slot="footer-left">
    <Checkbox bind:checked={dontAskAgain}>
      Don't ask again
    </Checkbox>
  </svelte:fragment>
  
  <svelte:fragment slot="footer-right">
    <Button variant="secondary" on:click={() => showWarning = false}>
      Cancel
    </Button>
    <Button variant="secondary-destructive" on:click={handleDelete}>
      Delete
    </Button>
  </svelte:fragment>
</Modal>

<!-- Modal with full-width action -->
<Modal bind:isOpen={showComplete} title="Complete Setup">
  <Text variant="body-medium">Setup is complete. Click below to get started.</Text>
  
  <svelte:fragment slot="footer-full">
    <Button variant="primary" on:click={handleStart}>
      Get Started
    </Button>
  </svelte:fragment>
</Modal>

<!-- Side panel modal -->
<Modal 
  bind:isOpen={showProperties} 
  title="Layer Properties" 
  position="right" 
  width="large"
>
  <Label>Opacity</Label>
  <Input type="number" bind:value={opacity} />
  
  <Label>Blend Mode</Label>
  <Dropdown bind:value={blendMode} menuItems={blendModes} />
  
  <svelte:fragment slot="footer-right">
    <Button variant="primary">Apply</Button>
  </svelte:fragment>
</Modal>
```

**Props**

| Prop                  | Type    | Options/notes                                                         |
|:----------------------|:--------|:----------------------------------------------------------------------|
| `isOpen`              | Boolean | Controls visibility. Use `bind:isOpen={variable}`                    |
| `title`               | String  | Modal header title                                                   |
| `width`               | String  | Default: `"medium"`; Options: `"small"` (240px), `"medium"` (320px), `"large"` (480px), or custom CSS value |
| `height`              | String  | Default: `"auto"`; Custom height value (e.g., `"50vh"`, `"400px"`)  |
| `position`            | String  | Default: `"center"`; Options: `"center"`, `"left"`, `"right"`, `"bottom"` |
| `overlayPadding`      | String  | Default: `"16px"`; Padding around modal viewport                     |
| `contentPadding`      | Boolean | Default: `true`; Add padding to content area                         |
| `showOverlay`         | Boolean | Default: `true`; Show backdrop overlay                               |
| `closeOnOverlayClick` | Boolean | Default: `true`; Close when clicking backdrop                        |
| `closeOnEscape`       | Boolean | Default: `true`; Close when pressing ESC                             |
| `onClose`             | Func    | Callback function when modal closes                                  |
| `headerVariant`       | String  | Default: `"default"`; Header styling variant                         |
| `footerVariant`       | String  | Default: `"default"`; Footer styling variant                         |
| `footerBorder`        | Boolean | Default: `true`; Show footer border                                  |
| `icon2`               | Boolean | Default: `false`; Show additional icon button in header              |
| `icon2Name`           | Var     | Icon for secondary header button                                     |
| `onIcon2Click`        | Func    | Click handler for secondary header button                            |

**Slots**

| Slot           | Description                                          |
|:---------------|:-----------------------------------------------------|
| `default`      | Main modal content area                              |
| `footer-left`  | Left side of footer (checkboxes, switches, etc.)     |
| `footer-right` | Right side of footer (action buttons)                |
| `footer-full`  | Full-width footer (single primary actions)           |

---

### Radio

Radio buttons for mutually exclusive selections.

```javascript
import { Radio } from 'figma-ui3-kit-svelte';

let exportFormat = 'png'; // Selected value
```

```html
<Radio bind:group={exportFormat} value="png">
  PNG
</Radio>

<Radio bind:group={exportFormat} value="jpg">
  JPG
</Radio>

<Radio bind:group={exportFormat} value="svg">
  SVG
</Radio>

<Radio bind:group={exportFormat} value="pdf" disabled>
  PDF (Coming Soon)
</Radio>
```

**Props**

| Prop        | Type    | Options/notes                                                    |
|:------------|:--------|:-----------------------------------------------------------------|
| `group`     | Var     | Bind to variable to track selected value. Ex: `bind:group={var}` |
| `value`     | String  | Value when this radio is selected                                |
| `disabled`  | Boolean | Default: `false`                                                 |
| `tabindex`  | Number  | Default: `0`                                                     |
| `on:change` | Func    | Change handler                                                   |

---

### Slider

The Slider component provides a range input with variants for different use cases. All variants use a single handle.

```javascript
import { Slider } from 'figma-ui3-kit-svelte';
```

```html
<!-- Delta: for adjusting from a default value (e.g., exposure) -->
<Slider bind:value={exposure} variant="delta" min={-100} max={100} defaultValue={0} />

<!-- Range: fill from start to handle -->
<Slider bind:value={opacity} variant="range" min={0} max={100} />

<!-- Stepper: with visible tick marks -->
<Slider bind:value={step} variant="stepper" min={0} max={100} step={10} />

<Slider bind:value={value} disabled />
```

**Props**

| Prop           | Type    | Options/notes                                                    |
|:---------------|:--------|:-----------------------------------------------------------------|
| `value`        | Number  | Current slider value; Bind with `bind:value={variable}`          |
| `variant`      | String  | Default: `"range"`, Options: `"delta"`, `"range"`, `"stepper"`  |
| `min`          | Number  | Default: `0`                                                     |
| `max`          | Number  | Default: `100`                                                   |
| `step`         | Number  | Default: `1` (used for stepper variant)                          |
| `defaultValue` | Number  | Default position for delta variant (defaults to midpoint if null) |
| `disabled`     | Boolean | Default: `false`                                                |
| `tabindex`     | Number  | Default: `0`                                                     |
| `class`        | String  | Custom CSS class                                                 |
| `on:change`    | Func    | Change handler. Ex: `on:change={handler}`                       |
| `on:input`     | Func    | Input handler (fires during drag)                                |
| `on:focus`     | Func    | Focus handler                                                    |
| `on:blur`      | Func    | Blur handler                                                     |

---

### Switch

Toggle switch for boolean settings.

```javascript
import { Switch } from 'figma-ui3-kit-svelte';
```

```html
<Switch bind:checked={autoSave}>
  Auto-save changes
</Switch>

<Switch bind:checked={notifications} on:change={handleNotificationToggle}>
  Enable notifications
</Switch>

<Switch checked disabled>
  Required setting
</Switch>
```

**Props**

| Prop        | Type    | Options/notes                                                    |
|:------------|:--------|:-----------------------------------------------------------------|
| `checked`   | Boolean | Default: `false`; Bind with `bind:checked={variable}`           |
| `value`     | String  | Default: `""`; Form value when submitted                         |
| `disabled`  | Boolean | Default: `false`                                                 |
| `mixed`     | Boolean | Default: `false`; Indeterminate/mixed state                      |
| `tabindex`  | Number  | Default: `0`                                                     |
| `on:change` | Func    | Change handler                                                   |

---

### Tabs

Tab navigation component for switching between views.

```javascript
import { Tabs } from 'figma-ui3-kit-svelte';
```

```html
<script>
  let selectedTab = 0;

  const tabs = [
    { label: 'Design' },
    { label: 'Prototype' },
    { label: 'Inspect' }
  ];

  // Or simple string array
  const simpleTabs = ['Design', 'Prototype', 'Inspect'];

  function handleTabChange(index) {
    console.log('Tab changed to:', index);
  }
</script>

<Tabs 
  tabs={tabs} 
  bind:selectedTab={selectedTab}
  onTabChange={handleTabChange}
/>

{#if selectedTab === 0}
  <div>Design content</div>
{:else if selectedTab === 1}
  <div>Prototype content</div>
{:else}
  <div>Inspect content</div>
{/if}
```

**Props**

| Prop          | Type   | Options/notes                                                    |
|:--------------|:-------|:-----------------------------------------------------------------|
| `tabs`        | Array  | Array of `{ label }` objects or strings                          |
| `selectedTab` | Number | Default: `0`; Index of selected tab. Bind with `bind:selectedTab` |
| `onTabChange` | Func   | Callback when tab changes. Receives tab index                    |

---

### Text

Modern typography component using Figma's UI3 design system. Provides semantic variants for headings and body text with consistent sizing, line height, and letter spacing.

```javascript
import { Text } from 'figma-ui3-kit-svelte';
```

```html
<!-- Headings -->
<Text variant="heading-large">Plugin Settings</Text>
<Text variant="heading-medium">Export Options</Text>
<Text variant="heading-small">Advanced</Text>

<!-- Body text -->
<Text variant="body-large">
  This is large body text, ideal for primary content and descriptions.
</Text>

<Text variant="body-large-strong">
  Large body text with strong weight for emphasis.
</Text>

<Text variant="body-medium">
  Default medium body text for most UI elements.
</Text>

<Text variant="body-medium-strong">
  Medium body text with strong weight.
</Text>

<Text variant="body-small">
  Small body text for secondary information.
</Text>

<!-- Additional styling -->
<Text variant="body-medium" align="center" block>
  Centered block text
</Text>

<Text variant="body-large" color="--figma-color-text-brand">
  Branded text color
</Text>

<Text variant="body-small" color="--figma-color-text-danger">
  Error message
</Text>
```

**Props**

| Prop      | Type    | Options/notes                                                                          |
|:----------|:--------|:---------------------------------------------------------------------------------------|
| `variant` | String  | Default: `"body-medium"`; Options: `"heading-large"`, `"heading-medium"`, `"heading-small"`, `"body-large"`, `"body-large-strong"`, `"body-medium"`, `"body-medium-strong"`, `"body-small"`, `"body-small-strong"` |
| `align`   | String  | Default: `"start"`; Options: `"start"`, `"center"`, `"end"`                          |
| `block`   | Boolean | Default: `false`; Display as block element                                            |
| `color`   | String  | Default: `"--figma-color-text"`; Any Figma color variable                             |
| `text`    | String  | Text content (can also use slot content)                                              |

**Typography Scale**

| Variant                | Size | Line Height | Weight | Usage                              |
|:-----------------------|:-----|:------------|:-------|:-----------------------------------|
| `heading-large`        | 24px | 32px        | 550    | Primary page titles                |
| `heading-medium`       | 15px | 25px        | 550    | Section headings                   |
| `heading-small`        | 13px | 22px        | 550    | Subsection headings                |
| `body-large`           | 13px | 22px        | 450    | Multiline text, descriptions       |
| `body-large-strong`    | 13px | 22px        | 550    | Emphasized multiline text          |
| `body-medium`          | 11px | 16px        | 450    | Default UI text (buttons, inputs)  |
| `body-medium-strong`   | 11px | 16px        | 550    | Emphasized UI text                 |
| `body-small`           | 9px  | 14px        | 450    | Small UI elements (badges, labels) |
| `body-small-strong`    | 9px  | 14px        | 550    | Emphasized small text              |

---

### Textarea

Multi-line text input for longer content.

```javascript
import { Textarea } from 'figma-ui3-kit-svelte';
```

```html
<Textarea 
  bind:value={description}
  placeholder="Enter description..." 
/>

<Textarea 
  bind:value={notes}
  rows={4}
  placeholder="Additional notes..."
/>

<Textarea 
  value="Read only content"
  disabled
/>
```

**Props**

| Prop           | Type    | Options/notes                                                    |
|:---------------|:--------|:-----------------------------------------------------------------|
| `value`        | String  | Textarea value. Bind with `bind:value={variable}`               |
| `placeholder`  | String  | Default: `"Input something here..."`                             |
| `rows`         | Number  | Default: `2`; Number of visible text rows (height)              |
| `disabled`     | Boolean | Default: `false`                                                 |
| `invalid`      | Boolean | Default: `false`; Shows error state                              |
| `errorMessage` | String  | Default: `"Error message"`; Shown when invalid                   |
| `on:change`    | Func    | Change handler                                                   |
| `on:input`     | Func    | Input handler (fires on every keystroke)                         |

---

### Tooltip

Contextual help tooltips that add hover functionality to any interactive element. Wrap any element to add tooltip behavior.

```javascript
import { Tooltip } from 'figma-ui3-kit-svelte';
```

```html
<!-- Basic tooltip -->
<Tooltip label="Cancel and discard changes">
  <Button variant="secondary">Cancel</Button>
</Tooltip>

<!-- With hotkey -->
<Tooltip label="Save your changes" hotkey={true} hotkeyText="⌘S">
  <Button variant="primary">Save</Button>
</Tooltip>

<!-- Different directions -->
<Tooltip label="Settings" direction="Bottom">
  <IconButton iconName={IconSettings} />
</Tooltip>

<Tooltip label="Previous page" direction="Left">
  <IconButton iconName={IconChevronRight} />
</Tooltip>

<!-- Custom elements -->
<Tooltip label="This is a custom div with a tooltip" direction="Top">
  <div style="padding: 8px 12px; background: var(--figma-color-bg-secondary); border-radius: 4px; cursor: pointer;">
    Hover me
  </div>
</Tooltip>
```

**Props**

| Prop         | Type    | Options/notes                                                         |
|:-------------|:--------|:----------------------------------------------------------------------|
| `label`      | String  | Default: `"Tooltip text"`; Tooltip content                            |
| `hotkey`     | Boolean | Default: `false`; Show hotkey text                                    |
| `hotkeyText` | String  | Default: `"⌘V"`; Hotkey to display (only shown when `hotkey={true}`)  |
| `direction`  | String  | Default: `"Top"`; Tooltip position relative to trigger (see below)   |
| `disabled`   | Boolean | Default: `false`; Disable tooltip functionality                       |

**Direction Options**
- `Top` – Tooltip appears above trigger, centered
- `TopLeft` – Tooltip appears above trigger, left-aligned
- `TopRight` – Tooltip appears above trigger, right-aligned
- `Bottom` – Tooltip appears below trigger, centered
- `BottomLeft` – Tooltip appears below trigger, left-aligned
- `BottomRight` – Tooltip appears below trigger, right-aligned
- `Left` – Tooltip appears to the left of trigger, centered
- `Right` – Tooltip appears to the right of trigger, centered

**Behavior**
- Tooltips appear on hover with a 500ms delay for the first tooltip shown
- Subsequent tooltips appear with a 50ms delay for better UX
- Tooltips automatically position themselves within viewport bounds
- Global state management ensures consistent behavior across all tooltip instances

---

## Design Tokens

The library uses Figma's native design tokens for consistency and automatic theme support. All tokens are available through CSS variables.

### Colors

Figma provides comprehensive color tokens that automatically adapt to light/dark themes:

**Text Colors**
- `--figma-color-text` – Primary text
- `--figma-color-text-secondary` – Secondary/dimmed text
- `--figma-color-text-brand` – Brand blue text
- `--figma-color-text-danger` – Error/destructive text
- `--figma-color-text-disabled` – Disabled state text
- `--figma-color-text-onbrand` – Text on brand backgrounds

**Background Colors**
- `--figma-color-bg` – Primary background
- `--figma-color-bg-secondary` – Secondary background
- `--figma-color-bg-brand` – Brand blue background
- `--figma-color-bg-danger` – Error/destructive background
- `--figma-color-bg-disabled` – Disabled state background

**Border Colors**
- `--figma-color-border` – Standard borders
- `--figma-color-border-selected` – Selected state borders
- `--figma-color-border-danger` – Error borders
- `--figma-color-border-disabled` – Disabled borders

**Icon Colors**
- `--figma-color-icon` – Standard icons
- `--figma-color-icon-brand` – Brand icons
- `--figma-color-icon-danger` – Error/warning icons
- `--figma-color-icon-onbrand` – Icons on brand backgrounds
- `--figma-color-icon-ondisabled` – Icons on disabled backgrounds

### Spacing

Use Figma's spacing scale for consistent layouts:

| Token               | Value | Common Usage                    |
|:--------------------|:------|:--------------------------------|
| `--size-xxxsmall`   | 4px   | Tight gaps, icon spacing        |
| `--size-xxsmall`    | 8px   | Button padding, small gaps      |
| `--size-xsmall`     | 16px  | Standard gaps, padding          |
| `--size-small`      | 24px  | Section spacing, icon button    |
| `--size-medium`     | 32px  | Large gaps, modal padding       |
| `--size-large`      | 40px  | Section padding                 |
| `--size-xlarge`     | 48px  | Page margins                    |
| `--size-xxlarge`    | 64px  | Hero spacing                    |
| `--size-huge`       | 80px  | Extra large spacing             |

### Border Radius

| Token                      | Value | Usage                          |
|:---------------------------|:------|:-------------------------------|
| `--border-radius-small`    | 2px   | Input borders, icon buttons    |
| `--border-radius-medium`   | 5px   | Cards, tooltips                |
| `--border-radius-large`    | 13px  | Buttons, modals                |

### Typography

The library uses semantic typography tokens that combine size, weight, line height, and letter spacing:

**Headings**
- `--heading-large-*` (24px/32px/550)
- `--heading-medium-*` (15px/25px/550)
- `--heading-small-*` (13px/22px/550)

**Body Text**
- `--body-large-*` (13px/22px/450)
- `--body-medium-*` (11px/16px/450) – Default UI text
- `--body-small-*` (9px/14px/450)

Each semantic token includes:
- `*-font-size`
- `*-line-height`
- `*-font-weight`
- `*-letter-spacing`

**Example Usage:**
```css
.custom-text {
  font-family: var(--font-stack);
  font-size: var(--body-medium-font-size);
  line-height: var(--body-medium-line-height);
  font-weight: var(--body-medium-font-weight);
  letter-spacing: var(--body-medium-letter-spacing);
  color: var(--figma-color-text);
}
```

### Shadows

- `--shadow-hud` – Menus, tooltips, toasts
- `--shadow-floating-window` – Modals, dialogs

---

## Building Your Plugin

### Project Structure

```
my-plugin/
├── src/
│   ├── main.js        # Main plugin code (runs in Figma sandbox)
│   ├── ui.html        # UI HTML
│   └── App.svelte     # Your Svelte app
├── package.json
└── manifest.json      # Figma plugin manifest
```

### Basic Setup

**manifest.json**
```json
{
  "name": "My Plugin",
  "id": "123456789",
  "api": "1.0.0",
  "main": "dist/main.js",
  "ui": "dist/ui.html",
  "editorType": ["figma"]
}
```

**main.js**
```javascript
figma.showUI(__html__, {
  themeColors: true,  // Enable automatic dark mode
  width: 400,
  height: 500
});

// Listen for messages from UI
figma.ui.onmessage = (msg) => {
  if (msg.type === 'create-rectangles') {
    const nodes = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
  
  figma.closePlugin();
};
```

**App.svelte**
```svelte
<script>
  import { GlobalCSS, Button, Input, Text } from 'figma-ui3-kit-svelte';
  
  let count = 5;
  
  function create() {
    parent.postMessage({
      pluginMessage: {
        type: 'create-rectangles',
        count: parseInt(count)
      }
    }, '*');
  }
</script>

<GlobalCSS />

<div class="plugin-container">
  <Text variant="heading-medium">Create Rectangles</Text>
  
  <Input 
    type="number" 
    bind:value={count} 
    placeholder="Number of rectangles..."
  />
  
  <Button variant="primary" on:click={create}>
    Create
  </Button>
</div>

<style>
  .plugin-container {
    padding: var(--size-xsmall);
    display: flex;
    flex-direction: column;
    gap: var(--size-xxsmall);
  }
</style>
```

---

## Best Practices

### Use Design Tokens

Always use Figma's CSS variables instead of hardcoding values:

```css
/* ✅ Good - uses design tokens */
.my-component {
  background: var(--figma-color-bg);
  color: var(--figma-color-text);
  padding: var(--size-xsmall);
  border-radius: var(--border-radius-medium);
}

/* ❌ Bad - hardcoded values break theme support */
.my-component {
  background: #ffffff;
  color: #000000;
  padding: 16px;
  border-radius: 5px;
}
```

### Choose the Right Icon Size

- Use **24px icons** for most UI elements (buttons, inputs, headers)
- Use **16px icons** for compact spaces (checkboxes, small buttons, list items)

### Typography Consistency

Use the Text component or semantic typography tokens for all text to maintain consistency:

```html
<!-- ✅ Good -->
<Text variant="body-medium">Consistent text</Text>

<!-- ❌ Avoid -->
<span style="font-size: 11px;">Inconsistent text</span>
```

### Responsive Layouts

Use Figma's spacing tokens with CSS Grid or Flexbox:

```css
.layout {
  display: flex;
  flex-direction: column;
  gap: var(--size-xsmall);
  padding: var(--size-xsmall);
}
```

---

## Browser Compatibility

This library is designed for modern Figma plugin environments, which use a recent Chromium-based webview. All modern CSS and JavaScript features are supported.

---

## Contributing

Contributions are welcome! If you find bugs or have feature requests, please open an issue on GitHub.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/mariusroosendaal/figma-ui3-kit-svelte.git

# Install dependencies
npm install

# Run Storybook development server
npm run dev

# Build Storybook for production
npm run build
```

The development server runs Storybook at http://localhost:6006 for component documentation and testing.

---

## License

MIT License – feel free to use in your projects.


---

Originally inspired by figma-plugin-ds-svelte by Thomas Lowry, but rebuilt for Figma's UI3 design system. 
