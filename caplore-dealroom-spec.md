# Caplore Deal Room — Detailed Specification

## 1. Document purpose

This document specifies the current design, content, layout, component behavior, and technical constraints of `caplore-dealroom.html`. It is intended to serve as:

- a design handoff for recreating the page;
- a functional reference for converting the prototype into an application;
- a QA checklist for checking visual and behavioral parity;
- a record of current prototype limitations that require production implementation.

The source page is a self-contained, desktop-first HTML prototype for a pre-IPO investment opportunity on the Caplore investor platform.

## 2. Page identity

| Property | Value |
|---|---|
| Product | Caplore Investor Network |
| Page type | Pre-IPO deal room / opportunity detail |
| Example company | ABC Engineering Ltd. |
| Browser title | `ABC Engineering Ltd. — Pre-IPO Deal Room · Caplore` |
| Language | English |
| Source file | `caplore-dealroom.html` |
| Source structure | One HTML file with embedded CSS and JavaScript |
| Primary user | Logged-in premium investor |
| Primary task | Review the opportunity and express investment interest |
| Secondary tasks | Inspect financials, promoters, risks, comparables, documents, and IPO timeline |

All company, transaction, financial, investor, and timeline information in this prototype should be treated as static sample content, not live investment data.

## 3. Experience summary

The page uses a fixed dark navigation sidebar, a compact top bar, and a vertically scrollable content area. The deal itself is introduced through a dark hero banner containing:

- company identity and positioning;
- deal-status and risk badges;
- target raise and minimum ticket;
- a primary expression-of-interest action;
- six key financial and transaction metrics.

Below the hero is a seven-item tab bar. Tab selection replaces the content in the main left column. A 300 px right rail stays visible within the page flow and contains the investment form, transaction details, and raise progress.

The initial and only fully populated default view is **Overview**. All other tab panels are present in the DOM but hidden with inline `display:none` until selected.

## 4. Information architecture

```text
Viewport
├── Fixed sidebar (216 px)
│   ├── Caplore logo
│   ├── Primary navigation
│   ├── Community navigation
│   ├── Premium navigation
│   ├── Tools navigation
│   └── Refer & Earn card
└── Main shell
    ├── Top bar (54 px)
    │   ├── Breadcrumb
    │   ├── Share
    │   ├── Save
    │   ├── Notifications
    │   └── User chip
    └── Scrollable content
        ├── Deal hero
        │   ├── Company summary
        │   ├── Raise call to action
        │   └── Six-stat strip
        ├── Deal tabs
        └── Two-column deal body
            ├── Main tab content
            │   ├── Overview
            │   ├── Financials
            │   ├── Promoters
            │   ├── Risks & Strengths
            │   ├── Comparables
            │   ├── Documents
            │   └── IPO Timeline
            └── Persistent side rail
                ├── Express Interest
                ├── Deal Details
                └── Raise Progress
```

## 5. Global layout

### 5.1 Viewport behavior

- `html` and `body` occupy 100% height and set `overflow:hidden`.
- The body is a horizontal flex container.
- The sidebar is fixed to the left edge and occupies the full viewport height.
- The main shell starts after the sidebar using a 216 px left margin.
- The main shell is capped at `100vh` and does not scroll as a whole.
- Only `.content` scrolls vertically.
- Content receives 20 px padding on all sides.
- The content scrollbar is thin, with a 4 px WebKit thumb and `D1D5DB` coloring.

### 5.2 Primary dimensions

| Element | Specification |
|---|---|
| Sidebar width | 216 px |
| Top bar height | 54 px |
| Content padding | 20 px |
| Hero bottom margin | 16 px |
| Main body top margin | 14 px |
| Main body columns | Flexible main column + fixed 300 px side rail |
| Main body gap | 14 px |
| Panel stack gap | 14 px |
| Hero radius | 20 px |
| Panel radius | 20 px |

### 5.3 Responsive behavior

The current page contains no media queries and is designed for desktop widths.

- The fixed 216 px sidebar always remains present.
- The six hero stats always render in six equal columns.
- The main content always attempts to preserve a 300 px side rail.
- The tab row does not define horizontal scrolling.
- Financial and comparable tables do define local horizontal scrolling.
- On narrow screens, hero content, tabs, and the two-column body can become compressed or overflow.

A production implementation should define explicit tablet and mobile layouts rather than treating the current desktop behavior as responsive.

## 6. Visual design system

### 6.1 Typography

- Primary typeface: **Inter**.
- Font source: Google Fonts.
- Imported weights: 400, 500, 600, 700, and 800.
- Body fallback: `sans-serif`.
- Base body size: 13 px.
- Base line-height: 1.5.
- Most metadata and labels use 9–12.5 px sizes.
- Main deal title: 22 px / weight 800.
- Raise amount: 28 px / weight 800.
- Strong card metrics: generally 14–20 px / weight 700 or 800.

The page depends on an external font request. If it fails, the browser uses its default sans-serif font and text measurements may shift.

### 6.2 Color tokens

| Token | Hex | Usage |
|---|---|---|
| `--navy` | `#0A0F1E` | Sidebar, hero, primary text |
| `--blue` | `#1E5EFF` | Primary actions, active navigation, links, score |
| `--blue-light` | `#EEF3FF` | Blue-tinted backgrounds |
| `--blue-mid` | `#D0DEFF` | Supporting blue border/tint |
| `--green` | `#059669` | Positive status and metrics |
| `--green-light` | `#ECFDF5` | Positive status backgrounds |
| `--amber` | `#F59E0B` | Moderate risk and warning states |
| `--amber-light` | `#FFFBEB` | Warning backgrounds |
| `--red` | `#DC2626` | High risk and notification count |
| `--red-light` | `#FEF2F2` | High-risk background |
| `--purple` | `#7C3AED` | Supporting accent/avatar |
| `--purple-light` | `#F5F3FF` | Supporting accent background |
| `--text-primary` | `#0A0F1E` | Titles and values |
| `--text-secondary` | `#4B5563` | Body and supporting copy |
| `--text-muted` | `#9CA3AF` | Labels and metadata |
| `--border` | `#E5E7EB` | Default dividers and borders |
| `--border-strong` | `#D1D5DB` | Strong dividers and scrollbar |
| `--surface` | `#FFFFFF` | Cards, top bar, tabs |
| `--surface-2` | `#F9FAFB` | App background and inset items |
| `--surface-3` | `#F3F4F6` | Progress tracks and neutral fills |

### 6.3 Radius tokens

| Token | Value | Typical usage |
|---|---|---|
| `--r` | 8 px | Small controls and icons |
| `--r-lg` | 12 px | Buttons, fields, list items |
| `--r-xl` | 16 px | Tab container and medium cards |
| `--r-2xl` | 20 px | Hero and major panels |

### 6.4 General visual rules

- The app background is light gray (`surface-2`).
- Major panels are white with a 1 px neutral border.
- Panels use borders and color blocking instead of drop shadows.
- The sidebar and hero use the same dark navy foundation.
- Active and actionable elements consistently use the primary blue.
- Positive information uses green; warnings use amber; high-risk information uses red.
- Most controls have 120–150 ms hover transitions.
- SVG icons use strokes with rounded line caps and joins.

## 7. Persistent sidebar

### 7.1 Container

- Fixed at top-left.
- Width: 216 px.
- Height: `100vh`.
- Background: navy.
- Z-index: 200.
- Vertically scrollable with its scrollbar visually hidden.
- Uses a column layout so navigation fills available space and the referral card remains at the bottom.

### 7.2 Brand block

- Padding: 18 px top, 16 px horizontal, 14 px bottom.
- Bottom divider: semi-transparent white.
- Logo mark: blue 30 × 30 px rounded square containing a white `C`.
- Brand: `Caplore`, 14 px, weight 800.
- Descriptor: `Investor Network`, uppercase, 9 px, expanded tracking.

### 7.3 Navigation content

| Group | Item | State/badge |
|---|---|---|
| Primary | Dashboard | Links to `caplore-dashboard.html` |
| Primary | Opportunities | Active; badge `42` |
| Primary | My Portfolio | Inactive |
| Primary | Research & Insights | Inactive |
| Primary | Sector Intelligence | Inactive |
| Primary | CAPLORE Signals | Inactive |
| Community | Community | Inactive |
| Community | Events & Webinars | Inactive |
| Premium | CAPLORE+ | Green badge `New` |
| Premium | Deal Rooms | Inactive |
| Premium | Documents | Inactive |
| Tools | AI Research | Inactive |
| Tools | Watchlist | Inactive |

Navigation items:

- use 8 px vertical and 10 px horizontal padding;
- use a 12 px radius;
- have a 9 px icon-to-label gap;
- use 12.5 px medium text;
- transition to a translucent white background on hover;
- use solid blue with white content when active.

Except for Dashboard, the prototype navigation targets `#` and does not route to implemented pages.

### 7.4 Referral card

- Located in a bordered, translucent block at the bottom.
- Title: `Refer & Earn 🎁`.
- Supporting copy: `Invite investors and earn rewards`.
- Full-width blue `Refer Now` button.
- The button has no implemented action.

## 8. Top bar

### 8.1 Container

- Height: 54 px.
- White background with a bottom border.
- Horizontal padding: 20 px.
- Uses a 12 px primary gap.
- Does not scroll with the content region.

### 8.2 Breadcrumb

Sequence:

1. `Dashboard` — links to `caplore-dashboard.html`.
2. `/`
3. `Opportunities` — links to `#`.
4. `/`
5. `ABC Engineering Ltd.` — current page, weight 600.

Breadcrumb links are muted by default and blue on hover.

### 8.3 Actions

| Action | Presentation | Current behavior |
|---|---|---|
| Share | 34 × 34 px icon button | None |
| Save | 34 × 34 px icon button | None |
| Notifications | 34 × 34 px icon button with red `12` badge | None |
| User menu | User chip with avatar, name, membership, chevron | None |

User details:

- Avatar initials: `DR`.
- Name: `Dinesh R.`
- Membership: `Premium Investor`.

The three standalone actions are `div` elements, not semantic buttons.

## 9. Deal hero

### 9.1 Container and background

- Navy background.
- 20 px corner radius.
- Padding: 28 px horizontal and top; stat strip provides bottom height.
- Contains two layered radial gradients:
  - a blue glow from the right;
  - a subtle purple glow from the upper left.
- Overflow is clipped to the rounded boundary.

### 9.2 Main hero grid

- Two columns: flexible company summary and auto-width investment action.
- Gap: 24 px.
- Bottom padding: 24 px.
- Bottom divider: translucent white.

### 9.3 Company identity

Logo:

- Initials `AB`.
- 52 × 52 px.
- 12 px radius.
- Light blue background and primary-blue text.

Company copy:

- Name: `ABC Engineering Ltd.`
- Metadata: `Industrial Machinery · Pune, Maharashtra · Est. 2008`
- Description: `Leading manufacturer of precision engineering components for aerospace, defence, and automotive OEMs. Strong export revenues, consistent EBITDA margins, and an NSE Emerge listing on track within 24–30 months.`

### 9.4 Deal badges

| Badge | Visual meaning |
|---|---|
| `⚡ Pre-IPO` | Blue deal-stage badge |
| `✓ CAPLORE Score 85/100` | Green positive score badge |
| `⚠ Moderate Risk` | Amber risk badge |
| `Industrial Machinery` | Neutral sector badge |

Badges are pill-shaped, wrap when space is constrained, and use 11 px bold text.

### 9.5 Hero investment box

| Field | Value |
|---|---|
| Label | Target Raise |
| Amount | ₹120 Cr |
| Supporting line | Min. ticket ₹25 Lakh · Closes 30 Jun 2025 |
| Primary action | Express Interest |
| Secondary action | Save to Watchlist |

The investment box:

- has a translucent primary-blue background and border;
- is at least 200 px wide;
- centers all copy;
- uses a full-width blue primary button.

The watchlist control is a full-width outlined dark-background button below the box. Neither action has an event handler.

### 9.6 Hero key-stat strip

The strip is a six-column grid. Items are separated by translucent vertical dividers.

| Label | Value | Emphasis |
|---|---|---|
| Revenue (FY24) | ₹218 Cr | White |
| EBITDA Margin | 18.4% | Green |
| Revenue CAGR (3Y) | 27.2% | Green |
| Debt / Equity | 0.38x | White |
| Pre-Money Valuation | ₹480 Cr | White |
| Expected IPO | 24–30 Mo | Amber |

Labels are uppercase, 10 px, and muted. Values are 16 px and weight 800.

## 10. Deal tab navigation

### 10.1 Tabs

The tabs appear in this order:

1. Overview
2. Financials
3. Promoters
4. Risks & Strengths
5. Comparables
6. Documents
7. IPO Timeline

### 10.2 Styling

- White background.
- Rounded top corners, 16 px.
- Bottom border.
- Each tab has 12 px vertical and 18 px horizontal padding.
- Inactive tabs are muted gray.
- Hovered tabs use primary text.
- Active tab uses blue, weight 700, and a 2 px blue bottom border.
- `Overview` is active on initial load.

### 10.3 Behavior

Clicking a tab:

1. removes `.active` from every `.deal-tab`;
2. adds `.active` to the clicked tab;
3. reads the clicked element's `data-tab`;
4. iterates over all seven known tab IDs;
5. sets the matching panel to `display:block`;
6. sets all other tab panels to `display:none`.

No route, query parameter, hash, local storage, or history entry records the active tab. Reloading always returns to Overview.

The tabs are non-semantic `div` elements. They do not currently support keyboard activation, ARIA tab roles, or focus indication.

## 11. Shared panel component

Major content sections use a common panel:

- white background;
- 1 px neutral border;
- 20 px radius;
- clipped overflow.

Panel header:

- horizontal flex layout;
- vertically centered;
- content spaced between edges;
- padding: 14 px vertical, 18 px horizontal;
- bottom border.

Panel title:

- 13 px;
- weight 700;
- primary text color.

Panel body:

- padding: 16 px vertical, 18 px horizontal.

## 12. Overview tab

### 12.1 Business Overview panel

The business overview uses a two-column grid with a 10 px gap.

| Label | Value | Supporting value |
|---|---|---|
| Company Type | Private Limited | — |
| Incorporation Year | 2008 | — |
| Headquarters | Pune, Maharashtra | — |
| Employees | 1,240+ | — |
| Key Clients | Tata, L&T, BEL, HAL | Blue emphasis |
| Export Revenue | 34% of Revenue | US, Germany, Japan |
| Manufacturing Plants | 3 Facilities | Pune, Nashik, Hosur |
| Certifications | AS9100D, IATF 16949 | — |

Each item sits on a light-gray inset surface with 14 px vertical and 16 px horizontal padding.

The `About the Business` subsection is separated by a top border and contains:

> ABC Engineering Ltd. is a precision engineering manufacturer supplying mission-critical components to India's aerospace, defence, and automotive industries. Founded in 2008 by Ramesh Agarwal, the company has scaled from a single plant in Pune to three facilities with 1,240+ employees and ₹218 Cr in annual revenue. The company holds long-term supply agreements with marquee OEMs and has consistently grown EBITDA margins above 18% over the last three years. With a clean balance sheet (D/E of 0.38x) and structured governance, ABC Engineering is targeting an NSE Emerge listing within 24–30 months.

### 12.2 CAPLORE Score Breakdown

Overall score: **85 / 100**.

The score is represented by:

- a 90 × 90 px SVG ring;
- a gray 36 px-radius base circle;
- a blue progress circle with a 10 px stroke;
- centered score `85` and label `Score`;
- six horizontal category bars.

| Category | Score | Color treatment |
|---|---:|---|
| Financial Health | 90 | Green |
| Governance Quality | 82 | Blue |
| Management Credibility | 88 | Green |
| Market Opportunity | 85 | Blue |
| Scalability | 80 | Blue |
| IPO Readiness | 75 | Amber |

Bar widths directly equal their score percentages.

### 12.3 CAPLORE AI Investment View

The insight card uses a dark navy-to-blue gradient, a lightning icon, and a green `Positive` status pill.

Summary:

> ABC Engineering is one of the stronger pre-IPO candidates on the platform. The combination of sticky OEM relationships, export diversification, and consistent EBITDA expansion creates a defensible growth story with limited customer concentration risk.

Supporting observations:

- Revenue visibility is high because BEL and HAL supply agreements cover more than 40% of the forward order book.
- Governance has improved since FY22 through independent directors, an active audit committee, and audited related-party disclosures.
- The key stated risk is promoter dilution from 72% to approximately 55% after the IPO, with lock-in compliance and investor communication requiring attention.

This is static copy. No model request, freshness indicator, methodology link, or source disclosure is implemented.

## 13. Financials tab

### 13.1 Income Statement

Units: **₹ Crore**.

| Metric | FY21 | FY22 | FY23 | FY24 |
|---|---:|---:|---:|---:|
| Revenue | 108.2 | 138.6 | 174.4 | 218.0 |
| YoY Growth | — | 28.1% ↑ | 25.8% ↑ | 25.0% ↑ |
| Gross Profit | 38.2 | 50.4 | 64.0 | 81.6 |
| Gross Margin | 35.3% | 36.4% | 36.7% | 37.4% |
| EBITDA | 16.8 | 22.4 | 30.6 | 40.1 |
| EBITDA Margin | 15.5% | 16.2% | 17.5% | 18.4% |
| PAT | 8.4 | 11.8 | 17.2 | 23.6 |
| PAT Margin | 7.8% | 8.5% | 9.9% | 10.8% |

The EBITDA row has a light-blue highlight. Positive growth arrows use green pills.

### 13.2 Balance Sheet Snapshot

Units: **₹ Crore**.

| Metric | FY22 | FY23 | FY24 |
|---|---:|---:|---:|
| Total Assets | 86.2 | 112.4 | 148.6 |
| Total Equity | 48.4 | 62.8 | 84.0 |
| Total Debt | 24.0 | 28.4 | 31.8 |
| Debt / Equity | 0.50x | 0.45x | 0.38x |
| Working Capital Days | 68 | 62 | 58 |
| Cash & Equivalents | 6.2 | 9.8 | 14.4 |

The Debt / Equity row has a light-blue highlight.

### 13.3 Table behavior

- First columns are left-aligned.
- Numeric columns are right-aligned and semibold.
- Headers are uppercase and placed on a light-gray background.
- Rows receive a light-gray background on hover.
- Tables are wrapped in horizontally scrollable containers.
- No sorting, filtering, export, chart view, source link, or period toggle is implemented.

## 14. Promoters tab

The tab contains five ownership entries.

| Holder | Role/context | Holding |
|---|---|---:|
| Ramesh Agarwal | Founder & Managing Director · 22 years in precision engineering | 52.4% |
| Sunita Agarwal | Co-Promoter · Director — Operations | 19.6% |
| Vertex Equity Partners | Series A Investor (2019) · Exiting via IPO | 14.2% |
| Employee ESOP Pool | Vested & Unvested — Management incentive | 5.8% |
| Public / Pre-IPO Investors | This raise + existing angel holders | 8.0% |

The displayed holdings total 100.0%.

Each holder appears in a light-gray rounded row with:

- a 36 px colored initials avatar;
- holder name and role;
- right-aligned holding value and `Holding` or `Pool` label.

There are no expandable biographies, verification indicators, ownership charts, historical dilution views, or source documents.

## 15. Risks & Strengths tab

### 15.1 Risk levels

Risk cards use a tinted background, colored border, status dot, and level pill.

| Level | Color |
|---|---|
| High | Red |
| Medium | Amber |
| Low | Green |

### 15.2 Key risks

| Risk | Level | Description |
|---|---|---|
| Customer Concentration | Medium | BEL, HAL, and Tata Motors contribute approximately 52% of revenue; losing one could materially affect revenue. |
| IPO Timeline Slippage | Medium | Regulatory delays, market conditions, or governance gaps could delay the targeted 24–30 month listing window. |
| Liquidity Risk | High | The pre-IPO position is illiquid and depends on listing for exit; the internal secondary desk may provide partial liquidity in Year 2. |
| Raw Material Volatility | Low | Steel and aluminium costs affect margin, partially mitigated by OEM pass-through clauses. |

### 15.3 Key strengths

| Strength | Description |
|---|---|
| Sticky OEM Relationships | Multi-year BEL, HAL, and Tata supply agreements provide revenue visibility and pricing power. |
| Export Diversification | 34% of revenue comes from the US, Germany, and Japan. |
| Improving Balance Sheet | Debt/equity declined from 0.50x to 0.38x over three years, with strong cash generation. |
| Governance Improvements | Independent directors, an audit committee, and a structured ESOP support IPO readiness. |

Strength cards use a neutral inset background and a green circular check icon.

## 16. Comparables tab

### 16.1 Comparison table

| Company | Revenue (Cr) | EBITDA % | P/E | EV/EBITDA | Market Cap (Cr) |
|---|---:|---:|---:|---:|---:|
| ABC Engineering (Pre-IPO) | 218 | 18.4% | ~20x est. | ~12x est. | 480 (Pre-Money) |
| Minda Industries | 4,840 | 14.2% | 38x | 22x | 18,200 |
| Craftsman Automation | 3,420 | 19.6% | 28x | 16x | 8,600 |
| Precision Camshafts | 810 | 17.8% | 24x | 14x | 1,940 |
| Ramkrishna Forgings | 2,640 | 20.1% | 22x | 13x | 5,800 |

The ABC Engineering row uses a light-blue background and blue bold text.

### 16.2 Valuation note

At a ₹480 Cr pre-money valuation and ₹218 Cr revenue, the page describes the company as priced at approximately:

- **2.2x Revenue**
- **12x EV/EBITDA**

The page positions this as a discount to listed peers trading at 14–22x EV/EBITDA and states that the discount typically compresses at listing.

No valuation date, market-data source, update timestamp, calculation detail, or disclaimer is shown.

## 17. Documents tab

Header state: `NDA Signed · Access Granted`.

### 17.1 Available documents

| Document | Type/size | State |
|---|---|---|
| Investment Teaser — ABC Engineering Ltd. | PDF · 2.4 MB | Download |
| Audited Financials FY22, FY23, FY24 | PDF · 8.1 MB | Download |
| Investor Pitch Deck (June 2025) | PDF · 4.8 MB | Download |

### 17.2 Restricted documents

| Document | Access message | State |
|---|---|---|
| Draft DRHP — Restricted Access | Pending · Available after expression of interest | Locked |
| Legal Due Diligence Report | Locked · Available post verification | Locked |

Available document rows:

- use a document icon;
- use normal opacity;
- show a blue `Download` action;
- receive a blue border on hover.

Locked rows:

- use a lock icon;
- use 50% opacity;
- show `cursor:not-allowed`;
- show muted `Locked` text.

All rows are static `div` elements. No download, preview, authorization check, tracking, or error handling is implemented.

## 18. IPO Timeline tab

| Milestone | State | Date |
|---|---|---|
| Governance Setup Complete | Done | Dec 2023 |
| Statutory Audit (FY24) Filed | Done | May 2024 |
| Merchant Banker Appointed | Done | Mar 2025 |
| Pre-IPO Fundraise (Current Round) | Current | Closes Jun 2025 |
| DRHP Filing with SEBI | Upcoming | Sep 2025 |
| SEBI Observations Received | Upcoming | Dec 2025 |
| Roadshow & Anchor Booking | Upcoming | Mar 2026 |
| NSE Emerge Listing | Upcoming | Apr 2026 |

Presentation:

- a 1 px vertical connector runs behind all milestones;
- completed milestones use filled green dots;
- the current milestone uses a filled blue dot and blue focus halo;
- upcoming milestones use white dots with gray borders;
- titles use 12 px bold text;
- dates use 10.5 px muted text.

The dates are static and do not reconcile automatically with the current date.

## 19. Persistent right rail

The right rail is present for every selected tab and has a fixed desktop width of 300 px.

### 19.1 Express Interest panel

Content:

- heading: `Express Interest`;
- label: `Enter investment amount`;
- rupee-prefixed text input;
- default value: `25,00,000`;
- placeholder: `Min. ₹25 Lakh`;
- primary action: `Express Interest →`;
- note: `Minimum ₹25 Lakh · Closes 30 Jun 2025`;
- divider: `or`;
- secondary action: `Schedule a Call with Team`;
- social proof: `28 investors have expressed interest`.

The social proof uses four overlapping initials avatars: A, R, K, and M.

Current behavior:

- the amount can be edited as unrestricted text;
- no numeric parsing or Indian-number formatting is applied;
- minimum, maximum, increment, and available-allocation validation are absent;
- the primary and scheduling buttons do nothing;
- there is no authentication, suitability, KYC, confirmation, success, loading, or failure flow.

### 19.2 Deal Details panel

| Label | Value |
|---|---|
| Deal Type | Pre-IPO Equity |
| Target Raise | ₹120 Crore |
| Min. Ticket | ₹25 Lakh |
| Pre-Money Valuation | ₹480 Crore |
| Instrument | Compulsory Convertible Debentures (CCD) |
| Conversion | Auto-converts at IPO |
| Expected IPO | NSE Emerge · Apr 2026 |
| Lock-In Period | 6 months post-listing |
| Close Date | 30 June 2025 |
| Merchant Banker | SBI Capital Markets |

Deal Type and Merchant Banker use blue emphasis.

### 19.3 Raise Progress panel

| Metric | Value |
|---|---|
| Raised | ₹74 Cr |
| Target | ₹120 Cr |
| Progress | 62% |
| Remaining | ₹46 Cr |
| Investors | 28 |
| Days Left | 12 |
| Average Ticket | ₹2.6 Cr |

The progress bar is a blue fill set to a hard-coded width of 62%.

The displayed ratio uses rounded presentation: ₹74 Cr divided by ₹120 Cr is approximately 61.7%, represented as 62%.

## 20. Interaction inventory

| Control | Expected user intent | Prototype implementation |
|---|---|---|
| Sidebar Dashboard | Navigate to dashboard | Real relative link |
| Sidebar placeholder items | Navigate within product | `href="#"`; no destination |
| Deal tabs | Change deal information view | Implemented in client-side JavaScript |
| Breadcrumb Dashboard | Navigate to dashboard | Real relative link |
| Breadcrumb Opportunities | Return to listing | Placeholder `#` |
| Share icon | Share opportunity | Not implemented |
| Top-bar Save icon | Save opportunity | Not implemented |
| Notifications | Open notifications | Not implemented |
| User chip | Open account menu | Not implemented |
| Hero Express Interest | Start investment-interest flow | Not implemented |
| Save to Watchlist | Save deal | Not implemented |
| Amount input | Enter proposed amount | Editable text only |
| Right-rail Express Interest | Submit interest | Not implemented |
| Schedule a Call | Start scheduling | Not implemented |
| Available document rows | Download files | Not implemented |
| Locked document rows | Explain/unlock access | Not implemented |
| Refer Now | Start referral flow | Not implemented |

### 20.1 Sidebar JavaScript caveat

The script attempts to intercept navigation items only when `item.href` is absent or exactly equals `'#'`. In browsers, an anchor's `href` property is normally resolved to an absolute URL, so an element declared as `href="#"` generally does not satisfy `item.href === '#'`.

Consequences:

- placeholder links may still update the URL fragment or move the page;
- the intended active-class toggle may not execute;
- the logic should check `item.getAttribute('href') === '#'` or use proper application routes.

## 21. Data and state requirements for production

The static prototype implies the following data domains.

### 21.1 Deal

- deal ID and slug;
- deal type and status;
- sector;
- risk level;
- target raise;
- committed/raised amount;
- minimum ticket;
- close date;
- investor count;
- average ticket;
- valuation;
- security/instrument;
- conversion terms;
- lock-in period;
- merchant banker;
- expected exchange and listing date.

### 21.2 Company

- legal and display names;
- logo or initials fallback;
- description;
- incorporation year;
- headquarters;
- employee count;
- plants;
- certifications;
- key clients;
- export share and markets.

### 21.3 Research

- key performance indicators;
- annual financial statements;
- score and score categories;
- AI/research summary;
- risks and strengths;
- comparable companies;
- valuation explanation;
- data source and as-of date.

### 21.4 Ownership

- holder name and type;
- role/context;
- current holding;
- avatar or initials;
- pre- and post-transaction ownership where applicable.

### 21.5 Documents

- document ID;
- title;
- MIME type;
- file size;
- version and date;
- access state;
- access requirement;
- signed download/preview URL;
- download audit metadata.

### 21.6 Timeline

- milestone ID;
- label;
- target/completion date;
- status: done, current, upcoming, delayed, or cancelled;
- update timestamp.

### 21.7 Investor-specific state

- authentication and membership tier;
- NDA status;
- KYC/accreditation status;
- document permissions;
- watchlist status;
- proposed investment amount;
- submitted expressions of interest;
- notification count.

## 22. Production functional requirements

The following behaviors are implied by the interface but absent from the static file.

### 22.1 Express interest

1. The amount field must accept a numeric INR amount.
2. Input should support Indian digit grouping for display.
3. The amount must be at least ₹25 lakh.
4. The amount must not exceed the open allocation or any account-specific limit.
5. The user must be authenticated and pass required KYC, suitability, and access checks.
6. Submission must show a pending state and prevent duplicate requests.
7. Success must provide a reference number and next steps.
8. Failures must explain whether the issue is validation, permissions, availability, or service failure.
9. Submission must be auditable.

### 22.2 Watchlist

1. Save state must be visible and consistent between the hero and top-bar controls.
2. Saving should be reversible.
3. The state should persist to the investor account.
4. Failure and unauthenticated states must be handled.

### 22.3 Documents

1. Available documents should support preview or download.
2. Restricted documents should explain the exact access requirement.
3. Access must be authorized on the server, not only hidden in the UI.
4. Download URLs should be time-limited.
5. NDA/document access should be auditable.

### 22.4 Scheduling

1. `Schedule a Call with Team` should open an available-slot flow or a configured external scheduler.
2. The deal and investor identity should be included automatically.
3. Success, cancellation, and unavailable-slot states must be defined.

### 22.5 Sharing

1. Use native sharing where supported.
2. Provide a copy-link fallback.
3. Do not expose restricted deal-room data in public preview metadata.

### 22.6 Data freshness

1. Financials, valuation multiples, raise progress, investor count, close date, and timeline should include an as-of timestamp.
2. Time-sensitive states must be calculated rather than hard-coded.
3. Closed, fully allocated, delayed, and withdrawn deal states require distinct UI treatment.
4. Stale or unavailable data must not silently appear current.

## 23. Accessibility requirements and current gaps

### 23.1 Current gaps

- Tabs are clickable `div` elements rather than buttons or ARIA tabs.
- Icon actions in the top bar are `div` elements and are not keyboard-operable.
- Most interactive-looking controls lack visible keyboard focus styles.
- The investment input has no programmatically associated `<label>`.
- The tab set lacks `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, and `aria-controls`.
- Inline SVG icons do not consistently declare decorative or accessible status.
- Active navigation relies heavily on color.
- Risk and status states rely partly on color.
- There is no skip link.
- Dynamic tab changes are not represented in navigation history.
- No reduced-motion preference is defined.

### 23.2 Required production behavior

- All actions must use semantic controls.
- Every control must be reachable and usable by keyboard.
- Focus indicators must remain visible against both light and dark surfaces.
- Tab keys should follow the WAI-ARIA tab pattern, including arrow-key movement where appropriate.
- Inputs must have associated labels, descriptions, constraints, and accessible validation messages.
- Status should be communicated through text as well as color.
- Decorative SVGs should be hidden from assistive technology; meaningful icons need names.
- Text and interactive states should meet WCAG 2.2 AA contrast requirements.
- The page should preserve usability at 200% zoom and at a 320 CSS px viewport.

## 24. Security, privacy, and compliance requirements

Because the page presents private investment material, a production version should include:

- server-side authentication and authorization for the deal room;
- role- and deal-specific document permissions;
- NDA acceptance version, timestamp, and audit record;
- secure, expiring file links;
- event logs for document access and investment-interest submission;
- protection against exposing restricted content in page source before authorization;
- CSRF protection and secure session handling for mutations;
- input validation on both client and server;
- rate limiting for interest and scheduling submissions;
- suitable investment, risk, forward-looking statement, and non-advice disclosures;
- clear provenance and as-of dates for AI-generated or research content;
- an explicit statement that an expression of interest is non-binding if that is the intended legal status.

The current file includes all deal-room copy directly in the HTML and should not be used to deliver confidential documents or investor-specific information.

## 25. Performance and dependency notes

- The page has no framework or bundled JavaScript dependency.
- Icons are inline SVG and require no additional network request.
- Inter is the only external visual dependency.
- All CSS is embedded in the `<head>`.
- All JavaScript is embedded immediately before `</body>`.
- There are no raster images.
- There is no lazy loading, caching strategy, preconnect hint, or font-display configuration in the local CSS.
- The small script only registers tab and sidebar click listeners.

For production, critical assets should follow the host application's loading, caching, CSP, and font strategy.

## 26. Current implementation constraints

1. The page is a static snapshot, not a connected deal-room application.
2. Only tab switching is materially functional.
3. Most controls are visual placeholders.
4. Deal information is duplicated across the hero and side rail instead of being driven by a shared data object.
5. Inline styles are used extensively for one-off spacing, colors, widths, and display state.
6. No empty, loading, error, permission-denied, closed-deal, or fully-funded states exist.
7. There is no mobile layout.
8. There is no URL-addressable tab state.
9. Dates and progress values are hard-coded and can become internally stale.
10. No analytics, telemetry, or audit behavior exists.
11. The page links to `caplore-dashboard.html`, which is not part of this specification and may not exist in the same deployment.

## 27. Visual parity acceptance criteria

A recreation matches the current desktop prototype when:

- the fixed sidebar is 216 px wide and visually remains independent from content scrolling;
- the top bar is 54 px high;
- the main content background is light gray with 20 px padding;
- the hero uses the navy background, dual glow, company/action split, and six-stat strip;
- the initial active tab is Overview;
- selecting any of the seven tabs hides the other six panels;
- the side rail remains 300 px wide and visible beside every tab panel at desktop width;
- all financial, ownership, risk, comparable, document, timeline, and deal-detail values match this document;
- panels use white surfaces, neutral borders, and 20 px radii;
- primary actions and active states use `#1E5EFF`;
- positive, warning, and high-risk treatments use the specified green, amber, and red colors;
- tables scroll horizontally within their own container when required;
- the content region, not the full browser body, owns vertical scrolling.

## 28. Functional acceptance criteria for a production conversion

A production implementation is complete only when:

- every action in the interaction inventory has a defined success, loading, disabled, and failure behavior;
- tabs and controls are semantic and keyboard accessible;
- active tab state can be linked to or restored;
- investment amounts are validated and submitted to a real service;
- investor eligibility and access states are enforced server-side;
- watchlist state persists;
- document availability and downloads are authorized;
- deal data comes from a single structured source;
- time-sensitive values update from real dates and deal state;
- all private-data, compliance, and audit requirements are implemented;
- desktop, tablet, and mobile behavior is explicitly tested;
- stale, missing, loading, closed, fully allocated, and permission-denied states are covered.

## 29. Recommended component breakdown

```text
DealRoomPage
├── AppSidebar
│   ├── Brand
│   ├── NavigationGroup
│   └── ReferralCard
├── TopBar
│   ├── Breadcrumbs
│   ├── TopBarActions
│   └── UserMenu
├── DealHero
│   ├── CompanyIdentity
│   ├── DealBadges
│   ├── HeroInvestmentCard
│   └── KeyStats
├── DealTabList
├── DealContentLayout
│   ├── DealTabPanel
│   │   ├── OverviewPanel
│   │   ├── FinancialStatements
│   │   ├── OwnershipList
│   │   ├── RiskStrengthList
│   │   ├── ComparablesTable
│   │   ├── DocumentList
│   │   └── IpoTimeline
│   └── DealSideRail
│       ├── InterestForm
│       ├── DealDetails
│       └── RaiseProgress
└── FeedbackLayer
    ├── ValidationMessages
    ├── Toasts
    ├── Dialogs
    └── LoadingStates
```

Shared primitives should include `Panel`, `Button`, `IconButton`, `Badge`, `Metric`, `ProgressBar`, `DataTable`, and `StatusListItem`.

## 30. QA data consistency checks

- ₹74 Cr raised + ₹46 Cr remaining = ₹120 Cr target.
- ₹74 Cr / ₹120 Cr = 61.7%, displayed as 62%.
- Promoter/shareholder percentages total 100.0%.
- FY24 EBITDA of ₹40.1 Cr / revenue of ₹218.0 Cr = approximately 18.4%.
- FY24 PAT of ₹23.6 Cr / revenue of ₹218.0 Cr = approximately 10.8%.
- FY24 debt of ₹31.8 Cr / equity of ₹84.0 Cr = approximately 0.38x.
- ₹480 Cr valuation / ₹218 Cr revenue = approximately 2.2x revenue.
- The listed 12x estimated EV/EBITDA multiple is presented as a page assertion and cannot be independently derived without enterprise-value adjustments.
- The side-rail average ticket of ₹2.6 Cr is broadly consistent with ₹74 Cr across 28 investors, approximately ₹2.64 Cr.

## 31. Out of scope for the current prototype

- Actual securities transaction execution.
- Payment or escrow collection.
- E-signature.
- Investor onboarding and KYC.
- Live cap table management.
- Real-time valuation feeds.
- Real document storage or delivery.
- Calendar integration.
- Notifications center.
- User account menu.
- Community and portfolio pages.
- Legal validation of the investment claims or terms.
