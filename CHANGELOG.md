# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
