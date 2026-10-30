# Theme colors

Import `registry/foundation.css` once. It imports `theme-colors.css`; the
`arc-foundation` registry item installs both files together. Do not import the
palette separately after your application overrides.

Set `data-theme="light"` or `data-theme="dark"` and `data-accent` on `<html>`.
The supported accents remain neutral, violet, blue, green, amber, orange, coral
and rose. Missing attributes use the neutral light theme.

## Shared roles

| Token | Role |
| --- | --- |
| `--primary` | Filled primary actions, selected controls, progress |
| `--primary-foreground` | Text and glyphs on primary, hover and active fills |
| `--primary-hover` | Hover fill for primary actions |
| `--primary-active` | Pressed/open fill for primary actions |
| `--primary-subtle` | Tinted selection backgrounds |
| `--primary-text` | Theme-colored text on neutral or subtle surfaces |

These roles belong to the whole library, not to individual components. Neutral
surfaces, text, borders, tooltip inversions, logos and explicit neutral variants
keep their existing tokens. Success, warning and danger keep their own meanings.
Switch and slider thumbs retain structural `--control-thumb*` tokens; they can
be customized independently from the selected fill.

## Custom brand

Import your app-owned CSS after foundation and override all six roles on the
same root. Include dark rules if the app supports dark mode. For example:

```css
:root[data-accent="brand"] {
  --primary: #0562ef;
  --primary-foreground: #fff;
  --primary-hover: #074db7;
  --primary-active: #063f96;
  --primary-subtle: rgb(5 98 239 / .12);
  --primary-text: #074db7;
}

:root[data-theme="dark"][data-accent="brand"] {
  --primary: #6ba3ff;
  --primary-foreground: #10203a;
  --primary-hover: #83b3ff;
  --primary-active: #9cc3ff;
  --primary-subtle: rgb(107 163 255 / .20);
  --primary-text: #a4c7ff;
}
```

Choose the filled color and foreground together; bright yellow/green fills need
dark text. `primary-text` is a separate surface text color, never a substitute
for hover/active fill. Check the same foreground against all three solid states.
Theme attributes and overrides currently target the document root; nested themed
regions are not part of this contract.

## Compatibility and upstream updates

Existing consumers continue through aliases in `theme-colors.css`:

| Existing token | Shared role |
| --- | --- |
| `accent`, `control-on`, `control-fill` | `primary` |
| `accent-foreground`, `control-glyph` | `primary-foreground` |
| `accent-strong` | `primary-text` |
| `accent-subtle`, `control-on-subtle` | `primary-subtle` |

Custom themes should now set the primary roles. Overriding only the legacy accent
tokens will not recolor components that consume primary directly.

Merge upstream changes normally. Review new primary actions for inverted
`foreground/background` fills and review `accent-strong` used as a solid fill;
neutral inverse surfaces can intentionally retain those colors. Keep theme values
in `theme-colors.css` to reduce conflicts with upstream foundation changes.

After editing source or merging upstream:

```sh
npm run build:registry
npm run check
```

Commit changed install payloads in `public/r` alongside their source. Internal registry dependencies resolve from `fishwithwater/arc-library`, so
installing this fork does not pull components from the upstream registry.
