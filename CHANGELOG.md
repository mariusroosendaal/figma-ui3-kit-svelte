# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
