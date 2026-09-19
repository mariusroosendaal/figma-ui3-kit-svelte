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
| Checkbox | `2012:55461` | Label is the `Value` text layer. Plain unchecked needs `🎛️ Muted=True` — no non-muted unchecked variant exists. |

## Adding a component

1. `get_context_for_code_connect` on the component set for its properties.
2. Write `Name.figma.ts` mapping every variant value (unmapped values render `undefined`).
3. `npm run figma:parse`, add a row above, publish.
