# Figma ↔ code

Links `figma-ui3-kit-svelte` to the UI3 Figma file (`6dJFbL7SDC7kkS1fu3AHH6`, set in `../figma.config.json` as `<UI3_FILE>`).

## Figma → code (Code Connect)

Each `*.figma.ts` file is a parserless Code Connect template that maps one Figma component set to its Svelte component. Once published, Dev Mode and the Figma MCP (`get_design_context`) return kit markup such as `<Button variant="secondary">Cancel</Button>` instead of generic HTML/CSS.

```bash
npm run figma:icons     # regenerate icon templates from the Figma Icons page
npm run figma:parse     # validate templates locally
npm run figma:publish   # regenerate icons, then publish to Figma
```

Icons are generated, not hand-written: `scripts/import-icons.mjs` fetches every `icon.16.*` / `icon.24.*` component and writes a template to `icons/` (gitignored) for each one with a matching SVG in `src/icons`. Nested icons then resolve to e.g. `iconName={Icon24StarSmall}` plus its SVG import.

Publishing reads `FIGMA_ACCESS_TOKEN` from the gitignored `.env` in the package root. The token needs the **Code Connect: write** and **File content: read** scopes.

## Code → Figma (mockups)

The templates double as the reverse mapping: to mock up a Svelte layout, create instances of the component sets below and set the Figma property that each code prop maps to.

| Component | Node | Notes |
|---|---|---|
| Button | `2012:48557` | Label is `🎛️ Label#32561:0`. Figma-only: `🐣 State`, `👁️ Hotkey`. `FigJam` renders as `primary` in code. |
| Badge small | `2012:35027` | Label is the first text layer (no text property). `warning` ↔ `Warn`. |
| Badge small alt | `2012:35077` | → `Badge`: Count New ↔ `variant="count"`, Count Inactive ↔ `count-inactive`, Default ↔ `default strong`, Strong ↔ `invert strong`. |
| Badge large, Badge Dot | `2012:35016`, `2012:35086` | → `Badge size="large"` (Default/Strong/Merged/Archived), `Badge dot`. |
| Avatar | `2012:32015` | Color variants ↔ `color` (initial as `name`), Photo/Org ↔ `src`, Overflow ↔ `count` (+ `unread`), Size, Shape, Disabled. `_Avatar status` isn't modelled. |
| Checkbox | `2012:55461` | Label is the `Value` text layer; `👁️ Description` ↔ `description` (its layer is `Description > Value`). Plain unchecked needs `🎛️ Muted=True` — no non-muted unchecked variant exists. |
| Switch | `2015:24697` | Label is the `Value` text layer; `👁️  Description` (two spaces) ↔ `description`. `🐣 Type`: On ↔ `checked`, Mixed ↔ `mixed`. |
| Radio button | `2015:20365` | Selection is `bind:group` in code. The Button variant ↔ `variant="button"` (its Active state is the chosen one); a RadioGroup of them gets `direction="horizontal"`. |
| Button icon | `2324:46757` | → `IconButton`. Icon is `🎛️ Icon` (instance swap). |
| Text input | `2028:79255` | Single Line/Quick Action → `Input`, Multi Line → `Textarea`. Empty states use the text as `placeholder`. |
| Dropdown | `2028:36589` | Trigger text → `placeholder`; menu items live in code. Size Large ↔ `size="large"`, Stroke False ↔ `stroke={false}`. |
| Tabs | `2015:27780` | One `_Tab` per tab: label is its `Text` property, `🐣 Selected` → `selectedTab`, `🎛️ Badge` → the tab's `badge` count. |
| Segmented control | `2015:20960` | One `_Segment` per segment: `🎛️ Label` (label variant) or `🎛️ Icon` + `🎛️ Text` tooltip (icon variant). |
| Slider | `2015:23280` | Slider (center fill) ↔ `delta`, Stepper ↔ `stepper`, Color Range ↔ `hue`, Fill ↔ `opacity`, Corner Radius ↔ `range` with `defaultValue` (the marker), Range ↔ `range`. Gradient (a gradient-stop editor) has no kit equivalent. Knob position is the value. |
| Tooltip | `2015:39095` | Center directions ↔ `Top`/`Bottom`, corners and sides map 1:1. Wraps a trigger in code. |
| Menu row/Simple, /Checkmark | `2327:96028`, `2327:96252` | → `MenuItem` (Checkmark ↔ `variant="checkmark"`, `🎛️ On` ↔ `selected`, Dot ↔ `selected="mixed"`). Shortcut → `detail`. In a Menu: `type: 'check'`. |
| Menu row/Complex | `2327:96049` | → `MenuItem`. Lead Icon ↔ `iconName`, Avatar ↔ `avatar` (initial and color); Trail Shortcut ↔ `detail`, Badge ↔ `badge`, Checkbox ↔ `variant="checkbox"`, Mixed ↔ both. |
| Menu row/Toggle, /Toolbar | `2327:96288`, `2327:96311` | → `MenuItem` `variant="toggle"` / `variant="checkmark"` with `iconName`. In a Menu: `type: 'toggle'` / `type: 'check'`. |
| Menu row/Heading, /Divider | `2327:96347`, `2327:96331` | → `MenuHeading`, `MenuDivider`. |
| Menu row/Footer | `2327:96342` | → Menu `footerLabel` with `footerVariant="row"`. Menu row/Expand is the overflow arrow, which Menu draws itself; it has no template. |
| Modal header | `2327:122026` | → Modal's header: Navigation ↔ `headerVariant="navigation"` + `onBack`, Tabs ↔ `headerVariant="tabs"` + `headerTabs`, Dropdown ↔ the `header` slot. |
| Menu multi-select | `2327:96387` | → `Menu searchable footerLabel`: the field's text is `searchPlaceholder`, the button's label `footerLabel`, the rows `menuItems`. |
| Numeric input | `2028:79190` | → `NumericInput`. An `icon.24.prop-text` lead is `label` (its letter); any other lead icon is `iconName`. Empty ↔ `placeholder`, Dropdown ↔ `options`, Var pill ↔ `variable` (the pill's text). Var icon isn't modelled. |
| Numeric input multi | `2028:79619` | → `NumericInputMulti`; the cells' numbers → `values`, Partial Disable ↔ `disabled` on the last cell. |
| Chip variable | `2028:79753` | → `VariablePill`: Selected ↔ `selected`, On Selected ↔ `onSelected`, Soft Deleted / Value Not Rendered ↔ `muted`, Disabled ↔ `disabled`. |
| Combo input | `2028:79408` | → `NumericInput` with `options`. |
| Color input | `2028:79525` | → `ColorInput`. Hex and opacity are read from the text layers; Variable ↔ `variable`. Image and Gradient render as a color. |
| Chit 24 | `2028:79673` | → `Chit`. Circle ↔ `shape="circle"`; Opacity ↔ `opacity`. Code Connect can't read fills, so the color stays a placeholder. |
| Button icon toggle | `2324:46776` | → `IconToggle` with `iconName` + `iconNameOn`; Highlighted ↔ `highlighted`. |
| Button icon dialog toggle | `2324:46817` | → `IconToggle` with one `iconName`; `🎛️ On` ↔ `pressed`. |
| Button icon split | `2324:46856` | → `SplitButton`; the menu's items live in code. |
| Sidebar row comment | `2012:63744` | → `SidebarRow`: `NumPage` ↔ `meta`, `Name` ↔ `title`, `Timestamp` ↔ `detail`, `Message` ↔ `message`, `Reply Count` ↔ `link` (when `🎛️  Replies`); `🎛️  Unread` ↔ `unread`, Selected ↔ `selected` (Hover is runtime). The avatars go in the `lead` slot, the hover icons in `actions` as IconButtons. |

Built on the **Kit additions** page, because UI3 has no equivalent or its API differs too much from the kit:

| Component | Node | Notes |
|---|---|---|
| Banner | `1027204:342` | `👥 Variant` ↔ `variant`. |
| Chip | `1027205:88` | Default/Component × Default/Focused/Disabled, `👁️ Icon` + `↪ Icon`, `👁️ Close` ↔ `closable`. UI3's `_Chit input` is private, so it can't be published. |
| Modal | `1027206:365` | Width Small/Medium/Large × Footer Split/Full/None. `Content slot` → default slot; footer slots → `footer-left` / `footer-right` / `footer-full`. |
| Text | `1027216:156` | Variant (heading/body sizes, `-strong`) × Color Default/Secondary/Tertiary. Use it instead of raw text so mockups round-trip. |
| Label | `1027216:161` | Medium/Small. |
| Radio group | `1027216:162` | Legend + `Radios slot` of UI3 Radio buttons. |
| Disclosure item | `1027216:25160` | Expanded × Section; `Content slot` renders only when expanded. |
| Disclosure | `1027216:25161` | `Items slot` of Disclosure items. |
| Tree row | `1027222:26144` | Depth 0–3 (indent) × Twisty None/Closed/Open × Selected; `🎛️ Label`, `👁️/🎛️ Detail`, `👁️/↪ Icon`, `👁️ Checkbox` (a UI3 Checkbox; its Type is the tick). |
| Tree | `1027222:26241` | `Rows slot` of Tree rows; the template nests them by Depth into `nodes`, and derives `mode`, `expanded`, `selected` and `checked`. |
| Menu | `1027206:366` | Fill `Items slot` with UI3 menu rows. The kit's Menu is data-driven, so rows become `menuItems` (with `type`, `checked`, `iconName`, `detail`, `badge` from each row); headings and dividers start groups. |
| Dropzone | `1028012:479` | Size Default/Compact ↔ `compact` × State Default/Dragging/Disabled/Invalid (Dragging is the drag-over look, drawn at runtime). `🎛️ Hint` (+ `👁️ Hint`) ↔ `hint`, `👁️ Icon` + `↪ Icon` ↔ `iconName` (hidden ↔ `{null}`; Compact has none), `🎛️ Error` ↔ `errorMessage` on Invalid. The button is an exposed UI3 Button; its label ↔ `buttonLabel`. `accept` and `multiple` live in code. |

## Adding a component

1. `get_context_for_code_connect` on the component set for its properties.
2. Write `Name.figma.ts` mapping every variant value (unmapped values render `undefined`). Follow the existing templates: render nested instances with `render(handle)` and export `imports` plus `metadata.props.imports` — Dev Mode only lifts imports one level, so parents merge their children's lists. A slot that places its children on indented lines passes each through `indented(render(child), indent)`, which indents every line of a child's code, not only the first.
3. `npm run figma:parse`, add a row above, publish.
