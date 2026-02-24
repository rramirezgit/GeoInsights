# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # TypeScript check + Vite production build (tsc -b && vite build)
npm run lint       # ESLint across all .ts/.tsx files
npm run preview    # Serve the production build locally
```

There is no test runner configured.

## Environment

Requires a Mapbox access token. Copy `.env.example` to `.env.local` and set `VITE_MAPBOX_TOKEN`. All env vars must be prefixed with `VITE_` to be exposed to the client (Vite convention).

## Architecture

GeoInsights is a client-side SPA (no backend) for geospatial visualization, built with React 19 + Vite + TypeScript. It showcases 6 interactive demos focused on Argentina.

### Routing and Lazy Loading

`src/app/routes.tsx` defines all routes. Every demo page is lazy-loaded via `React.lazy()`. The app shell (`src/app/App.tsx`) wraps everything in `BrowserRouter` > `Providers` (TanStack Query) > `Navbar` + `AppRoutes`.

Routes: `/` (Hub), `/heatmap`, `/tracking`, `/satelital`, `/draw`, `/storymap`.

### State Management (Two Stores)

- **`mapStore`** — shared map viewport, base style, `flyTo()`, `resetViewport()`. Used by `BaseMap` and any component that needs to control the map camera.
- **`demoStore`** — per-demo filter/UI state (heatmap filters, tracking filters, draw analysis result, satelital slider). Each demo section has its own typed slice with a reset function.
- **`uiStore`** — left/right panel open state for the `DemoLayout` responsive drawers.

All stores use Zustand with `devtools` middleware.

### Map Layer Pattern

`BaseMap` (`src/components/map/BaseMap.tsx`) wraps `react-map-gl/mapbox` and reads viewport/style from `mapStore`. Demo-specific maps (e.g., `HeatmapMap`, `TrackingMap`, `DrawMap`) compose on top of `BaseMap` by passing children (deck.gl overlay, markers, sources/layers).

deck.gl layer factories live in `src/lib/mapbox/layers.ts` — `createHeatmapLayer`, `createScatterplotLayer`, `createGeoJsonLayer`. These return deck.gl layer instances configured with data and visual options.

### Demo Page Structure

Each demo in `src/pages/<DemoName>/` follows the pattern:
- **`<DemoName>Page.tsx`** — top-level page component, uses `DemoLayout` to compose left panel (controls), center (map), right panel (stats/info)
- **`<DemoName>Map.tsx`** — map-specific component with deck.gl layers or Mapbox sources
- **Controls/Stats components** — demo-specific UI that reads/writes to `demoStore`

`DemoLayout` (`src/components/layout/DemoLayout.tsx`) provides the three-column layout with collapsible side panels and mobile drawer overlays.

### Data Flow

Static data lives in `public/data/` (GeoJSON provinces, agro production, fleet, routes). Services in `src/services/` fetch these via `fetch('/data/...')`. Hooks in `src/hooks/` (e.g., `useGeoData`, `useFleetSimulation`, `useDrawAnalysis`) consume services and expose data/logic to pages. TanStack Query wraps data fetching with 5-minute staleTime.

Geospatial analysis (area, perimeter, centroid) is performed client-side using Turf.js helpers in `src/lib/geo/turf.helpers.ts`. GeoJSON validation uses Zod schemas in `src/lib/geo/geojson.validators.ts`.

### Path Alias

`@/*` maps to `./src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`).

### Styling

Tailwind CSS 3 with a dark-theme-first approach. Custom theme tokens in `tailwind.config.js`: `dark-*` colors, `accent-emerald`/`accent-cyan`, glass background gradients. Reusable CSS classes in `src/index.css`: `.glass-panel`, `.glass-panel-hover`, `.text-gradient`, `.map-container`.

UI primitives use Radix UI (Dialog, Slider, Switch) for accessibility. Animations use Framer Motion.

### TypeScript

Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`. Domain types are in `src/types/` — `geo.types.ts` (ViewState, MapStyle, AnalysisResult), `fleet.types.ts` (Truck, TruckStatus), `agro.types.ts` (CropType, AgroDataPoint), `map.types.ts`.
