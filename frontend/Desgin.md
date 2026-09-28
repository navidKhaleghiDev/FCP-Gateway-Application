## Design Character

The application UI is operational, dense, and scannable. It favors quiet surfaces,
compact controls, clear table/list affordances, and small teal accents over
decorative layouts. Do not introduce marketing-style heroes, oversized display
type, ornamental gradients, or card-heavy page sections.

## Implementation Rules

- Use Tailwind utility classes and existing CVA style files for variants.
- Reuse component families before inventing new primitives.
- Do not edit atom components without explicit approval.
- Keep page-level feature text in `next-intl` locale files.
- Use `dark:` variants because dark mode is class-based.
- Use the custom `rtl:` and `ltr:` Tailwind variants for directional alignment.
- Prefer `BaseTypography`, `BaseIcon`, `BaseButton`, `BaseInput`,
  `SectionWrapper`, table components, modal components, and skeleton loaders.

## Color System

Use Tailwind color families as semantic roles:

- Primary/action: `teal-500` on light mode, with `teal-400` in dark mode.
- Primary hover/active: `teal-600` and `teal-700`; dark states step through
  `teal-500` and `teal-600`.
- Positive/success accents: `teal-50`, `teal-100`, `teal-500`, `teal-600`.
- Destructive/error: `red-500` and `red-600`; soft destructive buttons use
  `red-100` backgrounds and deepen on hover.
- Warning/pending/highlight: `yellow-100` or `amber-400` accents.
- Structure and text: gray/slate scales, mostly `gray-50` through `gray-900`
  and `slate-50`, `slate-700`, `slate-900`.
- Neutral surfaces: `white`, `gray-50`, `gray-100`, `gray-200`, `slate-50/90`.
- Dark surfaces: `gray-600`, `gray-700`, `gray-800`, `gray-900`, `slate-900`.

Avoid one-off hex colors in app UI. Hex values are acceptable inside SVG
illustrations and chart palettes that already use fixed drawing colors. Common
fixed palette values seen in charts/SVGs map back to Tailwind: `#14B8A6`
(`teal-500`), `#2DD4BF` (`teal-400`), `#EF4444` (`red-500`), `#F87171`
(`red-400`), `#E5E7EB` (`gray-200`), `#9CA3AF` (`gray-400`), `#6B7280`
(`gray-500`), `#4B5563` (`gray-600`), and `#374151` (`gray-700`).

## Typography

The app font is `kalameh`. Use `BaseTypography` for visible text.

Type scale:

- `h1`: `text-6xl`
- `h2`: `text-5xl`
- `h3`: `text-4xl`
- `h4`: `text-3xl`
- `body1`: `text-2xl`
- `body2`: `text-xl`
- `body3`: `text-lg`
- `body4`: `text-base`
- `body5`: `text-sm`
- `body6`: `text-xs`
- `caption`: `text-[0.625rem]`
- Bold variants use `font-medium`, not heavier ad hoc weights.

Use compact typography inside controls, tables, panels, and metadata. Reserve
large text for page-level headings only.

## Shape And Radius

Default radius is 8px:

- Controls: `rounded-lg`
- Icon buttons: `rounded-lg` or `rounded-3xl` for circular/pill variants.
- Small metadata cards: `rounded-md`
- Dropdown/menu rows: `rounded-md` to `rounded-lg`
- Section wrappers: `rounded-[1.5rem]`
- Tables: `rounded-3xl` for table containers and table header capsules.
- Expanded/collapsible table content: `rounded-2xl`
- Modal surfaces: `rounded-[1.25rem]` or component default.
- Full pills/badges: `rounded-full`

Do not add new arbitrary radii unless matching an existing component family.

## Borders

Borders are subtle and structural:

- Default light border: `border-gray-200`.
- Stronger neutral border: `border-gray-300` or `border-gray-400`.
- Dark borders: `dark:border-gray-500`, `dark:border-gray-600`, or
  `dark:border-gray-700`.
- Focus accent: `focus:border-teal-500` and `focus-within:ring-1
  focus-within:ring-teal-500`.
- Error border: `border-red-500`; dark error uses `dark:border-red-400`.
- Thin custom border width `border-[0.063rem]` exists on neutral buttons; prefer
  normal `border` unless matching that exact button style.

Use borders to separate dense operational content. Do not use thick decorative
borders except existing teal card-button selections (`border-2`).

## Shadows

Shadows are restrained:

- Default cards and sections: `shadow-sm`.
- Menus, popovers, contextual overlays: `shadow-md`.
- Modals and raised drawers: `shadow-lg`.
- Avoid colored shadows except status/progress components that already use
  state shadows such as `shadow-teal-200`, `shadow-blue-200`,
  `shadow-amber-200`, or `shadow-red-200`.
- Avoid custom arbitrary box-shadow values unless a component family already
  defines them.

## Surfaces

Use surface levels consistently:

- App/page base: `bg-white` / `dark:bg-gray-800` or theme variables.
- Section surface: `bg-slate-50/90 dark:bg-slate-900`.
- Primary cards: `bg-white dark:bg-gray-600` or `dark:bg-gray-800`.
- Muted cards: `bg-gray-100`, `bg-gray-200`, or `dark:bg-gray-800`.
- Table header: `bg-gray-100 dark:bg-gray-600`; view mode uses `bg-gray-50
  dark:bg-gray-700`.
- Table body: `bg-white dark:bg-gray-800`.
- Collapse/detail row: `bg-gray-100 dark:bg-gray-900`.
- Teal attention surface: `bg-teal-50/80`, `bg-teal-100`, or `bg-teal-500/10`.

Do not nest cards for page grouping. Use `SectionWrapper` for grouped sections
and cards only for repeated list/card items.

## Spacing And Layout

The app uses compact spacing:

- Page layout stack: `flex flex-col gap-5`.
- Section header padding: `px-5 py-4`.
- Section content padding: `p-5`.
- Section content grid: `grid grid-cols-4 gap-4`.
- Repeated card/list grids: mobile `grid-cols-1`, then `md:grid-cols-2`,
  `xl:grid-cols-3` where useful.
- Table grid convention: `grid grid-cols-12`; column widths are controlled with
  `col-span-*` metadata.
- Common gaps: `gap-1` in controls, `gap-2` for small label/icon pairs,
  `gap-3` for rows/metadata, `gap-4` for section content, `gap-5` for page
  rhythm.

Use `min-w-0`, `truncate`, `overflow-hidden`, and stable dimensions in flex/grid
children that contain dynamic text.

## Control Sizing

Controls are compact and predictable:

- Standard button height: `h-10`.
- Button widths: `w-[5.94rem]`, `w-40`, `w-[11.88rem]`, or `w-full`.
- Standard icon button: `h-10 w-10`; small icon button: `h-7 w-7`.
- Standard input height: `h-10`.
- Input widths: `w-40`, `w-[15.94rem]`, `w-[21.88rem]`, or `w-full`.
- Modal widths use fixed responsive steps such as `w-[21.875rem]`,
  `sm:w-[27.813rem]`, `sm:w-[33.43rem]`, `lg:w-[39.68rem]`, or larger legacy
  modal widths.

Prefer these sizes over new arbitrary widths. Use full width when the parent
layout owns the sizing.

## Interaction States

Every interactive component should define normal, hover, active, disabled,
focus, and dark states where applicable.

- Primary buttons: teal background, white text, darker teal hover/active.
- Neutral buttons: white background, gray border/text, gray hover/active.
- Gray buttons: `bg-gray-100` with gray hover/active.
- Tertiary buttons: text-only gray states.
- Disabled controls use opacity (`opacity-40` or `opacity-30`) and keep the same
  semantic color family.
- Focus should be visible with teal border/ring, especially inside forms and
  sections.

## Forms

Use existing input components and their variants.

- Default input: white background, gray text, `h-10`, `p-2`, `rounded-lg`.
- Default border: `border-gray-300`, hover `border-gray-500`, focus
  `border-gray-900`.
- Teal input focus: `focus:border-teal-500 dark:focus:border-teal-400`.
- Natural-light input variant: `bg-gray-100`, hover `bg-gray-200`, focus
  `border-gray-500`.
- Labels are `text-xs`, gray by default, teal on focused teal variants, and red
  in error state.
- Placeholder alignment must respect `rtl:` and `ltr:`.

## Sections

Use `SectionWrapper` for detail/edit/create page sections.

Section anatomy:

- Outer wrapper spans responsive grid columns.
- Surface uses `rounded-[1.5rem] border bg-slate-50/90 shadow-sm`.
- Header is `px-5 py-4` with optional bottom border when expanded.
- Header icon sits in `h-11 w-11 rounded-2xl bg-teal-500/10 text-teal-600`.
- Collapse button is `h-8 w-8 rounded-xl` with gray hover states.
- Highlighted sections use amber border and ring.
- Metadata mode uses small white cards with `rounded-md border border-neutral-200`.

## Tables

Tables are 12-column, rounded, and dense.

- Table wrapper: `flex flex-col w-full gap-[0.625rem]`.
- Header: `rounded-3xl bg-gray-100 px-[1.25rem] py-[0.675rem] text-xs
  text-gray-500`.
- Header row and body rows: `grid grid-cols-12 place-items-center`.
- Body container: `rounded-3xl border border-gray-200 bg-white`.
- Rows: `p-5`, `border-b`, hover `bg-gray-100`, first/last rounded corners.
- Dark table body: `dark:bg-gray-800`, `dark:border-gray-500`, hover
  `dark:bg-gray-700`.
- Context menus: fixed overlay, `z-[800]`, `rounded-lg`, `border-gray-200`,
  `bg-white`, `p-1`, `shadow-md`.

### Column budget (`col-span` rule)

The row grid has 12 columns, but the trailing actions/expander cell is
pinned to `col-start-12`. That reserves the 12th column, so **every other
`col-span-*` in the `columns` array passed to `PageLayout.PageTable` must
sum to 11** — including the leading `rowNumberColumn()`, which defaults to
`col-span-1`.

- Sum every `meta.className`'s `col-span-N` across the array (row-number
  column included, the `type: "more"` actions column excluded — it has no
  `col-span` of its own).
- Going over 11 pushes the actions cell off the row's grid track entirely,
  which renders as the row's controls dropping onto their own line below
  the data — a real layout bug, not just a visual nit.
- Going under 11 just leaves dead space in the row.
- When adding, removing, or resizing a column, recompute the total by hand
  before shipping.

## Navigation

Sidebar and navigation items use 40px row height:

- Menu item: `h-10 px-3 rounded-lg whitespace-nowrap`.
- Default text/icon: `text-gray-500 dark:text-gray-400`.
- Hover: `hover:bg-gray-100 dark:hover:bg-gray-900`.
- Active: `bg-teal-50 text-teal-500`; dark active uses `dark:bg-teal-400`
  with opacity and light teal text.
- Child active states use neutral gray backgrounds, not teal.

## Modals And Overlays

Use existing modal components.

- Modal widths follow existing responsive fixed steps.
- Standard overlay/card shadow is `shadow-lg`; supporting elevated surfaces may
  use `shadow-md`.
- Modal header icons use halo backgrounds: red for error, teal for success, gray
  for info, yellow for warning.
- Keep action buttons at standard `h-10` sizes and use semantic button variants.

## Badges, Chips, And Status

- Badges are circular: `rounded-full`, absolute positioned, `z-20`, centered.
- Badge colors: teal, red, neutral gray.
- Red badge text is white.
- Status/progress UI may use teal, blue, amber, and red as state colors, but
  keep status meaning consistent within the feature.
- Use small sizes (`size-2`, `size-3`, `size-4`, `size-5`) instead of custom
  badge dimensions.

## Loading And Empty States

- Prefer skeletons from `src/ui/components/molecules/Loading/LoadingSkeleton.tsx`.
- Use spinner-only states only where the existing component family already does.
- Empty/error illustrations live in SVG atoms and commonly use teal and gray
  fixed fills; reuse them instead of creating new empty-state art.

## Dark Mode

Every new surface and state needs a dark equivalent:

- Light white surfaces generally map to `dark:bg-gray-600` or `dark:bg-gray-800`.
- Muted light gray surfaces map to `dark:bg-gray-700`, `dark:bg-gray-800`, or
  `dark:bg-gray-900`.
- Primary teal actions map from `teal-500` to `dark:bg-teal-400`.
- Text maps from gray/black to `dark:text-gray-100`, `dark:text-gray-200`, or
  `dark:text-white`.
- Borders map to `dark:border-gray-500`, `dark:border-gray-600`, or
  `dark:border-gray-700`.

## RTL And Localization

The UI supports RTL and Persian text.

- Use `rtl:` and `ltr:` Tailwind variants for directional text alignment.
- Inputs should use `rtl:placeholder:text-right` and
  `ltr:placeholder:text-left`.
- Toast containers and text alignment already account for RTL; match those
  patterns in new overlays.
- Do not hardcode visible labels; add translations to locale files.

## Do Not Introduce

- New raw color systems or unexplained hex colors in component UI.
- Decorative gradients, background blobs, or hero-like marketing sections in CRM
  screens.
- New arbitrary radii, shadows, or control dimensions without matching an
  existing family.
- Nested cards for page sections.
- Raw `fetch`/Axios or data-loading UI patterns inside design components.
- Hardcoded UI text.
