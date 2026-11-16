---
name: PrepHub
description: A card catalog for one engineer's interview loops. Oxblood reading-room rail, index-card white, one call-slip teal-blue.
colors:
  ground: "#eef0f2"
  card: "#ffffff"
  surface-2: "#e7eaed"
  surface-3: "#d9dde1"
  border: "#d2d7dc"
  border-strong: "#a8b0b8"
  ink: "#1b1918"
  ink-2: "#403b39"
  muted: "#6a6461"
  call-slip-blue: "#1f5f8b"
  call-slip-blue-strong: "#174a6d"
  head-rule-orange: "#d9822b"
  asked-amber: "#e7b23a"
  rail-oxblood: "#4a1f1c"
  rail-ink: "#f0e2de"
  dark-ground: "#141312"
  dark-card: "#1d1b1a"
  dark-ink: "#efebe8"
  dark-call-slip-blue: "#7fb8e0"
  dark-rail-oxblood: "#2e1513"
typography:
  display:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.6rem, 1.2rem + 1.4vw, 2rem)"
    fontWeight: 680
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "1.32rem"
    fontWeight: 650
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  call-number:
    fontFamily: "ui-monospace, 'SFMono-Regular', Menlo, monospace"
    fontSize: "11.5–12px"
    fontWeight: 500
    letterSpacing: "0.04–0.1em"
rounded:
  card: "4px"
  control: "6px"
  tab: "6px 6px 0 0"
  mark: "50%"
---

# Design System: PrepHub

## Overview

**Creative North Star: "The Card Catalog"**

The interview loop is a card-catalog drawer. Each round (OA, DSA, machine coding, system design, fundamentals + SQL, CTO/hiring manager) is a staggered tab. Behind each tab sit the cards you still have to pull, and Today opens on the thinnest drawer. It is a working screen first: the catalog lends type, palette, density and one signature move (staggered tabs pulling a card forward). The layout and controls stay standard.

The two targets, Motorq and remote India, carry equal weight. Each drawer says which target it serves.

## Colors

- **Rail Oxblood** (`rail-oxblood`): the desktop nav rail, like reading-room leather. On mobile it fills the active tab icon.
- **Index-card white / Ground**: cards on a cool, pale ground. It is never cream.
- **Call-slip Teal-blue**: the next action, links, focus, the call-number line of an open card. One blue action per view.
- **Head-rule Orange**: the 3px top rule on the open index card and on callouts. Structure, never a button.
- **Asked Amber**: only the "Asked at Motorq" tag and starred items.
- Dark mode is the same catalog at night: a deeper oxblood rail, warm near-black cards, a lightened teal-blue.

**One Pen Rule.** Blue means "the next action". **Amber Means Asked.** Orange is a rule line, not a state.

## Typography

System stack only. On Today, rank comes from weight and case, not from many sizes: one display sentence, one card title, then body text. **Call numbers** (`DSA·KOKO-EATING`, `OA·Q1`, `LEARN·01`) and counts are uppercase mono.

## Layout

- **Desktop:** a 232px oxblood rail with numbered drawers (Today 00 to Resources 05). The active drawer pulls out into the page ground. Content is capped at 900px on Today and 1020px elsewhere.
- **≤820px:** a bottom tab bar. The drawer tabs become a horizontal scroll strip, card rows stack the call number under the title, and actions go full width at 46px tall.
- Breakpoints are 1100/820/640/380. Safe areas are respected.

## Elevation

None. There are no shadows at rest or on hover. Structure is 1px hairlines, a 1px ink border on the open card and tab, and the red head rule.

## Components

- **Drawer tabs:** a tablist with arrow-key navigation. Tabs stagger by 0/5/10px, and the open tab joins its card. Each tab shows cards left, or "all pulled" struck through.
- **Index card:** call line, title of the next card, a note from the intel, rows of marks, then one blue action plus a ghost "Full round intel". It slides forward 8px when you switch tabs (disabled under reduced motion).
- **Marks:** state is a printed mark in a fixed cell. A hollow ring is open, a filled ring is done, and a done row's title is struck through. Checkboxes elsewhere use the same round mark.
- **Buttons:** 6px radius, 40px minimum height. Primary is ink, Signal is call-slip blue, Ghost is outlined.
- **Callouts:** 1px border with a 3px top rule in the callout's tone. No side stripes.

## Do's and Don'ts

- **Do** use the CSS variables so dark mode holds.
- **Do** give every pullable item a call number.
- **Don't** show streaks, rings or percentages on Today.
- **Don't** add shadows, gradients or texture to cards. The catalog is drawn in type and hairlines, not wood grain.
- **Don't** invent intel. Drawer contents come only from `src/data/companies.js`.
