# Phase 8 — Insights Dashboard (Charts)

## Goal

Implement the Insights Dashboard with summary stats and at least three functional Recharts charts.

## Reference

Reference screen: `screens/insights-dashboard.png` — agent must request the user to upload this image before implementing.

> ⚠️ Instruction for the agent: Before starting the implementation of this screen, ask the user to upload the `insights-dashboard.png` image directly in the chat. Analyze the image pixel by pixel to ensure the layout, spacing, colors, typography, and element arrangement are identical to the screenshot. Do not assume any visual detail without confirming it in the image.

## Tasks

### Page: `src/pages/insights/Insights.tsx`

Layout faithful to the `insights-dashboard.png` screenshot:

- **Navbar** at top: logo + links (Discover/Browse/Radio/My Collection/Insights active) + search + avatar
- **Left sidebar** "YOUR INSIGHTS": Overview (active), History, Top Charts, Global Stats + "⬇ Export Report" button at the bottom
- **Main content**:
  - "Insights Dashboard" title + subtext "📊 Your listening habits analyzed"
  - Period filters: Week / Month (active) / Year — to the right of the title
  - 2-column grid: "Listening Trends" (LineChart) + "Monthly Favorites" (PieChart donut)
  - 3 stat cards in a row: Hours Played, New Artists, Top Genre
- **Player bar** fixed at the footer

### Component: `src/pages/insights/components/InsightsSidebar.tsx`

- Fixed left sidebar with the "YOUR INSIGHTS" label
- Items: Overview (active), History, Top Charts, Global Stats
- "Export Report" button at the bottom

### Component: `src/pages/insights/components/ListeningTrendsChart.tsx`

- Recharts `LineChart` with `ResponsiveContainer`
- 2 lines: "This Month" (`#E8B84B`, solid) and "Last Month" (white, dashed)
- X-axis: Week 1, Week 2, Week 3, Week 4 · Y-axis: 15 to 45
- Legend above the chart · custom Tooltip

### Component: `src/pages/insights/components/MonthlyFavoritesChart.tsx`

- Recharts `PieChart` donut with `ResponsiveContainer`
- Segments: Synthwave (`#C8922A`), Electronic (`#4a90d9`), Ambient (`#7c3aed`), Lofi (`#27ae60`)
- Side legend with each genre's name · central hole with dark background

### Component: `src/pages/insights/components/StatCards.tsx`

- 3 cards in a row: circular icon + label + value + delta
- Hours Played: value "128.5", delta "+12%" green
- New Artists: value "24", delta "↑5" green
- Top Genre: value "Synthwave" in `#E8B84B`

### Data Derivation

1. `AppContext.searchResults` — snapshot of the latest searches (top 10 artists)
2. `FavoritesContext.favorites` — for genre distribution
3. `AppContext.listeningHistory` — hours played (simulated with mock when `USE_SPOTIFY_MOCK = true`)

## Acceptance Criteria

- All three charts render with real data (or mock data when `USE_SPOTIFY_MOCK = true`)
- Charts are responsive (use `ResponsiveContainer` from Recharts)
- Custom tooltips display formatted values
- Summary stat cards show correct counts
- Charts update when favorites change
- All strings use `t()`
