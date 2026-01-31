# Figma Plugin UI3 Kit Svelte

A lightweight, modern Svelte component library for building Figma plugin interfaces that feel native to Figma's UI3 design system.

## Features

- Light/dark theme support via Figma's CSS variables
- 25+ components matching Figma UI3
- 700+ icons (16px and 24px sizes)
- Svelte 4.x, no heavy dependencies

## Documentation

**[View Storybook](https://mariusroosendaal.github.io/figma-ui3-kit-svelte/)** – Interactive component documentation with live examples and props.

## Installation

```bash
npm install figma-ui3-kit-svelte
```

## Quick Start

```javascript
// Import the global CSS (required for design tokens)
import { GlobalCSS } from 'figma-ui3-kit-svelte';

// Import components
import { Button, Input, Modal, Text } from 'figma-ui3-kit-svelte';
```

```html
<Button variant="primary" on:click={handleClick}>
  Create Selection
</Button>

<Input bind:value={searchQuery} placeholder="Search layers..." />

<Text variant="body-medium">
  Components that feel native to Figma
</Text>
```

### Enable Theme Support

Pass `themeColors: true` when showing your UI:

```javascript
figma.showUI(__html__, { 
  themeColors: true,
  width: 400,
  height: 300
});
```

This enables Figma's native CSS variables that automatically adapt to the user's theme preference.

## Components

All components accept a `class` prop for custom styling.

- Badge
- Banner
- Button
- Checkbox
- Chip
- Disclosure / DisclosureItem
- Dropdown
- Icon
- IconButton
- Input
- Label
- Menu / MenuItem / MenuDivider / MenuHeading
- Modal
- Radio
- Slider
- Switch
- Tabs
- Text
- Textarea
- Tooltip

See the [Storybook](https://mariusroosendaal.github.io/figma-ui3-kit-svelte/) for detailed props, examples, and interactive demos.

## Icons

The library includes 700+ icons in two sizes. Import them as SVG:

```javascript
import { Icon } from 'figma-ui3-kit-svelte';

// 24px icons (default size)
import Icon24Eye from 'figma-ui3-kit-svelte/src/icons/24/icon.24.eye.small.svg';

// 16px icons (compact)
import Icon16Check from 'figma-ui3-kit-svelte/src/icons/16/icon.16.check.svg';
```

```html
<Icon iconName={Icon24Eye} color="--figma-color-icon" />
<Icon iconName={Icon24Eye} color="--figma-color-icon-brand" spin />
<Icon iconText="W" color="--figma-color-text-brand" />
```

## Design Tokens

The library uses Figma's native CSS variables for automatic theme support.

### Colors

```css
/* Text */
--figma-color-text
--figma-color-text-secondary
--figma-color-text-brand
--figma-color-text-danger
--figma-color-text-disabled

/* Backgrounds */
--figma-color-bg
--figma-color-bg-secondary
--figma-color-bg-brand
--figma-color-bg-danger

/* Borders */
--figma-color-border
--figma-color-border-selected
--figma-color-border-danger

/* Icons */
--figma-color-icon
--figma-color-icon-brand
--figma-color-icon-danger
```

### Spacing

| Token | Value |
|:------|:------|
| `--size-xxxsmall` | 4px |
| `--size-xxsmall` | 8px |
| `--size-xsmall` | 16px |
| `--size-small` | 24px |
| `--size-medium` | 32px |
| `--size-large` | 40px |

### Border Radius

| Token | Value |
|:------|:------|
| `--border-radius-small` | 2px |
| `--border-radius-medium` | 5px |
| `--border-radius-large` | 13px |

### Typography

Use semantic tokens for consistent text:

```css
.custom-text {
  font-family: var(--font-stack);
  font-size: var(--body-medium-font-size);
  line-height: var(--body-medium-line-height);
  font-weight: var(--body-medium-font-weight);
  letter-spacing: var(--body-medium-letter-spacing);
}
```

Available scales: `heading-large`, `heading-medium`, `heading-small`, `body-large`, `body-medium`, `body-small` (plus `-strong` variants).

## Development

```bash
# Start Storybook dev server
npm run dev

# Build Storybook
npm run build

# Lint and format
npm run lint
npm run format
```

Storybook runs at `http://localhost:6006`.

## License

MIT License

---

Originally inspired by figma-plugin-ds-svelte by Thomas Lowry, rebuilt for Figma's UI3 design system.
