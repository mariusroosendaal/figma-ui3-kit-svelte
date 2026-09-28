# Changelog

## [Unreleased]

### Added
- **Badge** — a `dot` takes the `danger`, `success` and `warning` variants' colors; any other variant stays brand
- **Dropdown**, **Menu** / **MenuItem** — `badge` takes a list for several badges, each a text or `{ text, variant?, strong? }`
- **NumericInput** — `invalid`: a red edge and `aria-invalid`, as Input has

### Fixed
- **Tooltip** — the label wraps inside the body wherever the trigger sits: it inherited the surrounding text layout, so in a `nowrap` table cell it ran past the body's edge
- `html`, `body` and `#app` fill the plugin window, and `#app` clips, so a layout's `height: 100%` holds and nothing can make the document scrollable: the content area scrolls and the footer stays at the bottom, where the whole window used to scroll past it
- **NumericInput** — a value the parent sets in answer to `change` shows at once, even while the field has focus, so arrow keys step from it
- **NumericInput**, **NumericInputMulti** — scrubbing the lead is steadier: the drag carries on once the pointer leaves the lead, where it could stop dead when the plugin's iframe dropped the pointer capture, and holds the scrub cursor with no text selection wherever it goes; it waits for 3px of drag, so a click that jiggles still focuses the field; pressing or letting go of Shift mid-drag changes the rate from there instead of rescaling the whole drag; and a single field held at `min` or `max` turns back at once. Scrubbing a focused NumericInput no longer snaps back to its typed text on blur

## [0.6.0] - 2026-09-21

### Added
- New components, each matching its UI3 counterpart:
  - **Avatar** — initial on a multiplayer color, photo or org image, overflow count; three sizes, circle or square
  - **Chit** — color swatch: solid, opacity split, gradient, image, multi-mode
  - **ColorInput** — chit, hex and opacity cell, system picker, bound-variable display
  - **IconToggle** — icon swap or a single icon on the selected fill; `aria-pressed`
  - **LinkTooltip** — interactive link tooltip: main action and further actions, or a URL field; anchors to an element or a selection rect
  - **NumericInput** — scrubbable lead, arrow-key steps, typed arithmetic, `min`/`max`/`precision`, unit, placeholder, presets (combo input), bound `variable` pill with detach
  - **NumericInputMulti** — several numbers behind one lead (radii, paddings), per-cell disabling
  - **SegmentedControl** / **Segment** — icon and label segments, disabled states, tooltips, arrow-key navigation
  - **SplitButton** — icon action with a chevron menu of alternatives
  - **ToggleButton** — labelled button that stays pressed, with lead icon, count badge, `secondary` variant and two sizes
  - **Tree** — nested list for browsing, single pick or tri-state checking, with the tree keyboard pattern
  - **VariablePill** — the pill for a value bound to a variable
- **Button** — `variant="figjam"`
- **Badge** — `count` and `count-inactive` variants, `size="large"`, `dot`
- **Checkbox**, **Switch** — `description`, linked with `aria-describedby`
- **Dropdown** — `size="large"`, `stroke={false}`, `searchable`, `badge`, `chit`, `label`, and the chosen item's icon or chit in the button
- **Menu** / **MenuItem** — `check`, `checkbox` and `toggle` items (incl. `mixed`), icons, chits, avatars, detail text, badges, disabled items, sections, search, footer (button or row), and overflow arrows for tall menus
- **Modal** / **ModalHeader** — navigation, tabs and custom headers
- **Radio** — `variant="button"`; **RadioGroup** — `direction="horizontal"`
- **Slider** — `hue` and `opacity` variants; a range slider marks `defaultValue`
- **Tabs** — per-tab `badge` counts
- Named icons `IconSwatchSmall`, `IconEyeSmall`, `IconHiddenSmall`, `IconLinkBroken`, `IconLinkConnected`, `IconStyles`, `IconPlay`
- Tokens: UI3's five elevations (`--elevation-100-canvas` … `-500-modal-window`, light and dark) and `--elevation-300-tooltip-filter` (the tooltip one as a filter, for shapes with an arrow), multiplayer colors, `--color-bg-menu-hover`, `--color-border-tooltip`
- `svelte.config.js` for the editor's Svelte language server

### Changed
- **Menu** — rebuilt on `aria-activedescendant`: one highlight for pointer and keyboard, disabled rows skipped, sub-menus on ArrowRight/ArrowLeft, focus back to the trigger after a keyboard pick; flips and scrolls when short of room, and closes when the page scrolls. Items no longer get an `id`
- **MenuItem** — `selected` only draws the check; the highlight is the separate `highlighted`
- **Menu**, **Modal** — shadows use the elevation tokens, so the dark theme gets UI3's edge highlight; the menu's 1px border is gone
- **Tooltip** — flips to the other side when short of room; the arrow keeps pointing at the trigger and shares the body's shadow; keyboard focus uses the short (200ms) delay
- **Dropdown** — the open menu gives the trigger a selected border; `aria-label` no longer falls back to `placeholder`
- **Badge** — renders a `<span>`; `default` with `strong` fills grey (UI3's "Badge small alt")

### Fixed
- **Button**, **Dropdown**, **Checkbox**, **Chip**, **Badge** — icon colors now update when `disabled` or `variant` change; they kept the color they were mounted with
- **Button** — disabled colors match UI3 (white on filled variants; the icon no longer vanishes on transparent ones); large pads 12px, not 16px; `secondary` uses the translucent border
- **Checkbox**, **Radio** — mixed and focus borders use `border-selected-strong` (was a different blue on dark); disabled unchecked is an outline, not a grey fill; `ghost` no longer turns white on dark
- **Switch** — focus ring on an on switch is `border-selected-strong`
- **Slider** — handles, fill, ticks and focus redrawn to match UI3's handle components, with no seams or fringes at the handle
- **Tooltip** — a second show timer could leave the tooltip up after the pointer left; `Left`/`Right` arrows sat half under the body
- **Textarea** — 4px vertical padding, as UI3's multi-line input
- **Badge** — a constant 1px border, so switching variants no longer shifts layout by 2px
- **Tabs** — unselected hover uses `bg-hover`
- **Modal** / **ModalHeader** — one dialog body instead of two copies; `icon2AriaLabel` and `backAriaLabel` name the header's buttons
- **Menu** — headings and dividers render inside `<li>`; footer button edge is white at 10%; check rows with an icon sit 4px further left, as UI3
- **global.css** — `body` sets a baseline text color; links use the defined `--figma-color-text-brand`
- **package.json** — `exports` declares the `svelte` condition, silencing vite-plugin-svelte's warning
- **docs** — Tooltip's four corner directions are documented

## [0.5.2] - 2026-05-13

### Changed
- Icon exports were moved from the package root to the dedicated `./icons` entrypoint. Use `import { IconBack } from "figma-ui3-kit-svelte/icons";` instead of importing named icons from the package root.
- Added `sideEffects: ["./src/index.js", "./src/global.css"]` to `package.json` so importing from the package root automatically includes shared UI3 CSS.
- Trimmed `src/global.css` to remove utility classes and keep only the shared UI3 design-system styles required by the package.

## [0.5.1] - 2026-05-12

### Added
- `ariaDisabled` prop to **Button** — keeps the button focusable and in the tab order while blocking clicks and applying disabled styling; use instead of `disabled` when a `<Tooltip>` needs to be keyboard-accessible
- `code` variant to **Textarea** — provides a monospace font and specific styling for code input

### Changed
- **Tooltip** — initial hover delay increased from 500 ms to 1000 ms; subsequent delay increased from 50 ms to 200 ms; idle reset window reduced from 3000 ms to 1000 ms

### Fixed
- **Tooltip** — no longer overflows the window on narrow plugin panels; `max-width` now clamps to `100vw - 16px` when the viewport is too narrow to fit 200px
- **Dropdown** — chevron icon no longer disappears in disabled state; it now renders with `--figma-color-icon-disabled` color
- **Dropdown** — optional `iconName` icon now uses disabled color instead of hardcoded `black3`
- **Dropdown** — removed hover styles that incorrectly hid the border on disabled state

## [0.5.0] - 2026-05-05

Comprehensive WCAG 2.2 AA accessibility audit and remediation across all 27 components.

### Added
- **RadioGroup** component — `<fieldset>`/`<legend>` wrapper for semantically grouping `Radio` buttons; exported from package index
- `type` prop (`'button' | 'submit' | 'reset'`) to **Button** and **IconButton** — prevents accidental form submission
- `ariaLabel` prop to **Checkbox**, **IconButton**, **Slider**, **Switch**, **Textarea** — provides accessible names for unlabelled controls
- `ariaLabelledBy` prop to **Input** and **Textarea** — supports label association via external element ID
- `ariaValueText` prop to **Slider** — allows human-readable value descriptions (e.g. "Low", "50%")
- `name` prop to **Radio** — required for AT to group radio buttons correctly
- `label` prop to **Disclosure** — `aria-label` on the `<ul>` so multiple accordion groups are distinguishable to AT
- `id` and `panelIds` props to **Tabs** — generates stable tab button IDs; `panelIds` wires `aria-controls` to tabpanel elements
- Arrow key navigation (Left/Right/Home/End) with roving tabindex to **Tabs**
- Focus trap (Tab/Shift+Tab cycles within dialog) to **Modal**
- Initial focus-on-open and focus-return-to-trigger to **Modal**
- Escape-to-dismiss to **Tooltip**
- `focusin`/`focusout` handlers to **Tooltip** — tooltip now appears on keyboard focus, not just hover
- Always-in-DOM `<span role="tooltip">` to **Tooltip** — `aria-describedby` resolves correctly at focus time; `onMount` wires the ID to the first focusable child automatically
- `role="alert"` / `aria-live="assertive"` for danger **Banner**; `role="status"` / `aria-live="polite"` for all others
- `aria-checked="mixed"` support to **Checkbox** and **Switch**
- `role="switch"` to **Switch** (non-mixed state); falls back to `role="checkbox"` when `mixed` is true
- Dev-mode `console.warn` to **IconButton**, **Label**, **Slider**, **Switch**, and **Textarea** when required accessible name props are absent

### Changed
- **Text**: heading variants (`heading-large`, `heading-medium`, `heading-small`) now render as `<h2>`, `<h3>`, `<h4>` by default instead of `<span>`; still overridable via the `as` prop
- **DisclosureItem**: disclosure toggle replaced `<div role="button">` with a native `<button>`; content panel now uses the `hidden` attribute instead of CSS `display:none` for AT-resilient show/hide
- **Modal**: keyboard handling moved to `<svelte:window>`; fixed no-overlay branch hardcoded `aria-labelledby="modal-title"` — now uses the generated unique ID
- **Dropdown**: removed incorrect `role="combobox"` (was wrong pattern for a menu button); `aria-controls` now correctly references the menu element by generated ID
- **Banner**: icon selection converted from a plain function to a reactive declaration — fixes icon not updating when `variant` prop changes in Storybook
- **IconButton**: `transition: all` narrowed to `transition: background-color` — prevents animated focus-ring flash (black → blue) on keyboard focus
- Multiple components: `:focus` CSS selectors changed to `:focus-visible` — focus rings now appear for keyboard navigation only, no visual change for mouse users (Button, Checkbox, Chip, DisclosureItem, Dropdown, Input, Radio, Switch, Tabs, Textarea)
- Multiple components: `on:click` blur anti-pattern removed from **Checkbox**, **Radio**, and **Switch** — keyboard users no longer lose focus position after activating a control; mouse-only blur preserved via `pointerType` detection on Switch

### Fixed
- **Menu**: removed duplicate `document.addEventListener('keydown')` alongside `<svelte:window on:keydown>` — was causing arrow-key navigation to skip two items per press
- **Menu**: selection highlight no longer persists across menu opens for non-checkmark menus
- **MenuItem**: replaced positive `tabindex` values with `tabindex="-1"` — was disrupting document tab order
- **Modal**: no-overlay branch now passes `titleId` to `ModalHeader` (was previously broken — `aria-labelledby` pointed to a non-existent element)
- **ModalHeader**: close button now has `ariaLabel="Close dialog"`

## [0.4.1] - 2026-02-17

### Changed
- Updated small label color to text-secondary

## [0.4.0] - 2026-01-31

### Added
- Storybook for component development and documentation
  - Interactive component examples with controls
  - Automatic light/dark theme switching
  - Accessibility panel (a11y addon)
  - Deployed to GitHub Pages on push to main
- ESLint and Prettier for code quality
- svelte-check for type checking
- Slider component with variants: delta, range, and stepper
  - Single handle slider for value selection
  - Delta variant: adjust from a default/reference point with vertical indicator
  - Range variant: fill from start to handle position
  - Stepper variant: slider with visible tick marks
  - Support for min, max, step, defaultValue, and disabled props

### Changed
- Development workflow now uses Storybook (`npm run dev`) instead of playground
- Simplified README to essentials, detailed docs now in Storybook
- Improved accessibility: added ARIA roles to Modal, Tooltip, and interactive components
- Refactored Button and Checkbox components for better accessibility

### Removed
- Playground (`/playground/`) - replaced by Storybook
- Rollup build tooling - no longer needed
- Section component (use Text component instead)

## [0.3.0] - 2025-01-01

### Added
- Nested menu support for Menu component with unlimited nesting levels
  - `subMenu` property on menu items for recursive nesting
  - Hover-based sub-menu opening with smart positioning and viewport boundary detection
  - Full keyboard navigation (Arrow keys, Enter, Escape)
  - Automatic chevron-right icon for items with sub-menus
  - Z-index layering for nested menus
- Storybook stories for Menu and Dropdown components

### Changed
- MenuItem removes right padding when trail icon is present
- Menu stories simplified to focus on action-based behavior (not select-like)
- Dropdown story simplified to a select-like example

## [0.2.0] - 2025-11-01

### Added
- Class passthrough (`class` prop) to Disclosure, DisclosureItem, MenuDivider, and MenuHeading components
- Label component now supports `size` prop with `"medium"` (default) and `"small"` options using body-small typography tokens

### Changed
- Fixed incorrect CSS variable `--color-icon-disabled` to `--figma-color-icon-disabled` in Dropdown component
- Alphabetized component exports in `src/index.js` for better organization
- Removed commented code blocks from Menu, Button, and Dropdown components

### Removed
- SelectMenu component (use Dropdown component instead) - breaking change
- Legacy icons directory (`src/icons/legacy/`) - all 65+ legacy icon files removed
- Commented-out debug code and unused CSS rules

### Fixed
- Missing class passthrough in 5 components now allows custom CSS classes

---

## Notes

This changelog was started after the UI3 migration. The library now fully supports Figma's UI3 design system with automatic light/dark mode theming via native Figma CSS variables.

For historical changes prior to this version, see the git commit history.

---

## Change Types Reference

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities
