<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Mapbox_GL-3.x-000?style=flat-square&logo=mapbox&logoColor=white" />
  <img src="https://img.shields.io/badge/deck.gl-9.x-FC4C02?style=flat-square" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://github.com/rramirezgit/GeoInsights/actions/workflows/ci.yml/badge.svg" />
</p>

<h1 align="center">GeoInsights</h1>

<p align="center">
  <strong>Intelligent geospatial visualization platform</strong><br/>
  <em>6 interactive demos combining maps, real-time data and client-side spatial analysis over Argentina</em>
</p>

<p align="center">
  <a href="#demos">Demos</a> &middot;
  <a href="#tech-stack">Tech Stack</a> &middot;
  <a href="#getting-started">Getting Started</a> &middot;
  <a href="#architecture">Architecture</a> &middot;
  <a href="#testing">Testing</a> &middot;
  <a href="#project-structure">Structure</a>
</p>

---

## About

GeoInsights is a **single page application** focused on geospatial visualization. Built as a portfolio project, it demonstrates advanced frontend engineering with interactive maps, real-time data visualization and client-side spatial analysis.

```
Landing with rotating 3D map
       |
       v
  +----+----+----+----+----+
  |    |    |    |    |    |
  v    v    v    v    v    v
Heat  Track Satel Draw Story
map   ing   ital  &    Map
             Compare Analyze
```

---

## Demos

### 1. Agricultural Heatmap
Crop production by region using a **deck.gl ScatterplotLayer** with color gradients. Filter by province, crop (soy, corn, wheat, sunflower) and year. Real province borders from Mapbox vector tiles. Stats panel powered by Recharts.

### 2. Fleet Tracking
Real-time simulation of **20 trucks** moving along Argentine national routes (Routes 9, 7, 40, 3, 14, 11). Animated status-pulse markers, live event feed, simulation speed controls and route rendering.

### 3. Satellite Comparator
Two synchronized maps with a **comparison slider**: satellite vs terrain. Drag to compare. Preset zones: Paraná Delta, Perito Moreno Glacier, Buenos Aires, Iguazú Falls, Mendoza. Includes elevation profiling and distance measurement modes.

### 4. Draw & Analyze
Draw polygons directly on the map by clicking. On completion, **Turf.js** automatically computes: area (km² and hectares), perimeter, centroid, estimated agricultural aptitude and soil type by geographic zone.

### 5. StoryMap Argentina
Scroll-driven narrative with **cinematic fly-overs** across 6 Argentine locations: Buenos Aires, the Humid Pampas, Mendoza, Patagonia and the Northwest. The map glides between locations as you scroll through the story.

### 6. Hub (Landing)
Main page with a rotating 3D map background, emerald-cyan gradient typography, glassmorphism card grid and staggered Framer Motion animations.

---

## Tech Stack

| Layer | Technology | Role |
|------|-----------|---------|
| **Framework** | React 19 + Vite | SPA with fast HMR and tree-shaking |
| **Language** | TypeScript (strict) | Strong typing for GeoJSON and geo APIs |
| **Maps** | Mapbox GL JS + react-map-gl | Map rendering engine |
| **Data layers** | deck.gl | ScatterplotLayer, GeoJsonLayer |
| **Spatial analysis** | Turf.js | Client-side area, perimeter, centroid |
| **State** | Zustand | Global state with devtools |
| **Data fetching** | TanStack Query v5 | Caching and fetching with staleTime |
| **Validation** | Zod | Schemas for GeoJSON and domain data |
| **Styling** | Tailwind CSS | Dark theme with glassmorphism |
| **Animations** | Framer Motion | UI transitions and motion |
| **Charts** | Recharts | BarChart, PieChart in side panels |
| **Icons** | Lucide React | Consistent iconography |
| **UI primitives** | Radix UI | Accessible Slider, Switch, Dialog |
| **Routing** | React Router | Per-demo lazy loading |
| **Testing** | Vitest + Testing Library | Unit tests for stores and geo logic |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A [Mapbox](https://account.mapbox.com/) account (free tier)

### Setup

```bash
git clone https://github.com/rramirezgit/GeoInsights.git
cd GeoInsights

npm install

cp .env.example .env.local
```

Edit `.env.local` and add your Mapbox token:

```env
VITE_MAPBOX_TOKEN=pk.eyJ1...your_token_here
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other commands

```bash
npm run build      # Type-check + production build
npm run preview    # Preview the production build
npm run lint       # Run ESLint
npm test           # Run the Vitest suite
```

---

## Architecture

```
+----------------------------------------------------------+
|                     BROWSER (SPA)                        |
|                                                          |
|   React App  <-->  Mapbox GL  <-->  deck.gl              |
|   (Vite)           (Maps)          (Data layers)         |
|                                                          |
|   +--------------------------------------------------+   |
|   |              State Layer                         |   |
|   |    Zustand (global)  +  TanStack Query (server)  |   |
|   +--------------------------------------------------+   |
+-----------------------------+----------------------------+
                              | HTTP
                              v
+----------------------------------------------------------+
|                   EXTERNAL DATA                          |
|                                                          |
|   Mapbox Tiles    GeoJSON data      Local simulation     |
|   (vector tiles)  (public/data/)    (useFleetSimulation) |
+----------------------------------------------------------+
```

### Architecture decisions

- **Zustand + TanStack Query instead of a single store**: global UI/map state lives in three small Zustand stores (`mapStore`, `demoStore`, `uiStore`) while server-ish data (static GeoJSON fetched over HTTP) is owned by TanStack Query with a 5-minute `staleTime`. Each tool does what it is best at.
- **deck.gl on top of Mapbox instead of native Mapbox layers**: deck.gl gives typed, declarative, WebGL-accelerated layers that scale to hundreds of thousands of points and compose cleanly with React.
- **Client-side spatial analysis with Turf.js**: area, perimeter, centroid and point-in-polygon run in the browser with zero backend. The service layer is designed so a future PostGIS backend (`ST_Area`, `ST_Within`) can replace Turf without touching the UI.
- **Feature-based structure**: each demo is self-contained (page, map, controls, store slice), so demos can be added or removed without cross-cutting changes.
- **Per-demo lazy loading**: Mapbox GL and deck.gl are heavy (~1.6 MB); every demo route is split with `React.lazy()` so the initial load stays lean.

### Applied patterns

- **Separation of concerns**: BaseMap (config) / DemoMap (layers) / Controls (UI) / Store (state)
- **Typed service layer** for static data and APIs, validated with Zod
- **Query keys + staleTime** for predictable cache behavior

---

## Testing

```bash
npm test
```

70 Vitest tests cover the pure core of the app:

- **Zustand stores** — viewport math, filter slices, satellite mode transitions
- **Turf helpers** — area/perimeter/centroid math against known geometries
- **Fleet simulation** — route interpolation, bearing math, event generation
- **Zod validators** — GeoJSON and domain schema edge cases
- **Elevation profiling** — sampling, gain accumulation, defensive terrain queries

Mapbox GL and deck.gl are mocked at the module boundary; the WebGL canvas itself is exercised by Playwright smoke tests in CI.

---

## Project Structure

```
src/
  app/                    # App shell, providers, routes
  pages/
    Hub/                  # Landing page with 3D map
    Heatmap/              # Demo: agricultural heatmap
    Tracking/             # Demo: fleet tracking
    Satelital/            # Demo: satellite comparator
    Draw/                 # Demo: draw & analyze
    StoryMap/             # Demo: scroll-driven narrative
  components/
    layout/               # Navbar, DemoLayout, panels
    map/                  # BaseMap, MapControls, Legend, Popup
    ui/                   # GlassCard, StatWidget, Toggle, etc.
  hooks/                  # useFleetSimulation, useGeoData, etc.
  stores/                 # Zustand: mapStore, demoStore, uiStore
  services/               # Typed data loading
  lib/
    geo/                  # Turf.js helpers, simulation, validators
    mapbox/               # Styles, deck.gl layer factories
  types/                  # TypeScript: geo, fleet, agro, map
  constants/              # Mapbox config, demos, theme
  tests/                  # Vitest setup

public/
  data/                   # Province GeoJSON, routes, fleet, agro data
```

---

## Data

| File | Contents |
|---------|-----------|
| `argentina-provinces.geojson` | Boundaries of 24 provinces (simplified) |
| `agro-production.json` | ~170 crop production points (2018-2024) |
| `sample-fleet.json` | 20 trucks with origin, destination, cargo and status |
| `argentina-routes.json` | 6 national routes with waypoints |

Province borders in the Heatmap use **native Mapbox vector tiles** for full precision.

---

## Scalability

The project is designed to scale from portfolio to SaaS product:

```
PHASE 1 (current)        PHASE 2 (SaaS)
Static + public APIs     + Backend (Node.js + NestJS)
                         + Auth (Clerk / Auth0)
                         + DB (PostgreSQL + PostGIS)
                         + Cache (Redis)
                         + Storage (S3)
```

**PostGIS** would replace Turf.js with native geospatial queries (`ST_Within`, `ST_Intersects`, `ST_Area`).

---

## License

Personal portfolio project. Contact me for commercial use inquiries.

---

<p align="center">
  <sub>Built with React + Mapbox GL + deck.gl + TypeScript</sub>
</p>
