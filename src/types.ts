// Types the components share, for plugins to import from the package root:
// `import type { MenuOption } from 'figma-ui3-kit-svelte'`.

/** A badge's text, or its text with a variant and weight */
export type BadgeSpec = string | { text: string; variant?: string; strong?: boolean };

/** Avatar's props, for a person or team lead in a menu row */
export interface AvatarSpec {
  name?: string;
  src?: string | null;
  color?: 'purple' | 'blue' | 'pink' | 'red' | 'yellow' | 'green' | 'grey' | null;
  shape?: 'circle' | 'square';
  count?: number | null;
  unread?: boolean;
  disabled?: boolean;
}

/** A row of Menu or Dropdown; Menu sets `checked` and `selected` as rows are picked */
export interface MenuOption {
  label: string;
  value?: unknown;
  /** Rows of one group sit together; a change draws a divider */
  group?: string;
  /** Separates dividers from headings: rows of one section share a divider */
  section?: string;
  /** Draws the group's heading; Menu's `showGroupLabels` sets it for all */
  showHeading?: boolean;
  disabled?: boolean;
  /** 'check' draws a leading checkmark and closes the menu; 'checkbox' and
   * 'toggle' draw a trailing checkbox or a leading switch and keep it open */
  type?: 'check' | 'checkbox' | 'toggle';
  checked?: boolean | 'mixed';
  /** The chosen row of a single-choice menu */
  selected?: boolean;
  /** SVG icon data */
  iconName?: string | null;
  chit?: string | string[] | null;
  avatar?: AvatarSpec | null;
  /** Right-aligned secondary text: a shortcut, a count, a value */
  detail?: string;
  badge?: BadgeSpec | BadgeSpec[];
  subMenu?: MenuOption[];
}

/** A row of Tree; a node with `children` is a parent */
export interface TreeNode {
  id: string;
  label: string;
  /** SVG icon data */
  iconName?: string | null;
  /** Right-aligned secondary text */
  detail?: string;
  disabled?: boolean;
  children?: TreeNode[];
}
