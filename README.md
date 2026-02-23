<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Mapbox_GL-3.x-000?style=flat-square&logo=mapbox&logoColor=white" />
  <img src="https://img.shields.io/badge/deck.gl-9.x-FC4C02?style=flat-square" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

<h1 align="center">GeoInsights</h1>

<p align="center">
  <strong>Plataforma de visualizacion geoespacial inteligente</strong><br/>
  <em>6 demos interactivos que combinan mapas, datos en tiempo real y analisis geoespacial sobre Argentina</em>
</p>

<p align="center">
  <a href="#demos">Demos</a> &middot;
  <a href="#tech-stack">Tech Stack</a> &middot;
  <a href="#instalacion">Instalacion</a> &middot;
  <a href="#arquitectura">Arquitectura</a> &middot;
  <a href="#estructura">Estructura</a>
</p>

---

## Sobre el Proyecto

GeoInsights es una **Single Page Application** enfocada en visualizacion geoespacial. Construida como proyecto de portafolio, demuestra capacidades avanzadas de desarrollo frontend con mapas interactivos, visualizacion de datos en tiempo real y analisis espacial client-side.

```
Landing con mapa 3D rotando
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

### 1. Heatmap Agricola
Visualizacion de produccion agricola por zona usando **deck.gl ScatterplotLayer** con gradiente de color. Filtros por provincia, cultivo (soja, maiz, trigo, girasol) y anio. Bordes provinciales reales desde los vector tiles de Mapbox. Panel de estadisticas con graficos de Recharts.

### 2. Tracking de Flota
Simulacion en tiempo real de **20 camiones** moviendose sobre rutas nacionales argentinas (Ruta 9, 7, 40, 3, 14, 11). Marcadores animados con pulso por estado, feed de eventos en vivo, controles de velocidad de simulacion y visualizacion de rutas.

### 3. Comparador Satelital
Dos mapas sincronizados con **slider de comparacion**: vista satelital vs terrain. Arrastra el slider para comparar. Zonas predefinidas: Delta del Parana, Glaciar Perito Moreno, Buenos Aires, Cataratas del Iguazu, Mendoza.

### 4. Draw & Analyze
Dibuja poligonos directamente en el mapa haciendo click. Al completar la figura, **Turf.js** calcula automaticamente: area (km2 y hectareas), perimetro, centroide, aptitud agricola estimada y tipo de suelo segun la zona geografica.

### 5. StoryMap Argentina
Narrativa scroll-driven con **vuelos cinematograficos** por 6 ubicaciones de Argentina: Buenos Aires, Pampa Humeda, Mendoza, Patagonia y el Noroeste. El mapa vuela suavemente entre ubicaciones a medida que scrolleas por la historia.

### 6. Hub (Landing)
Pagina principal con mapa 3D rotando de fondo, titulo con gradiente emerald-cyan, grid de cards con glassmorphism y animaciones staggered con Framer Motion.

---

## Tech Stack

| Capa | Tecnologia | Funcion |
|------|-----------|---------|
| **Framework** | React 18 + Vite | SPA con HMR rapido y tree-shaking |
| **Lenguaje** | TypeScript | Tipado estricto para GeoJSON y APIs geo |
| **Mapas** | Mapbox GL JS + react-map-gl | Motor de renderizado de mapas |
| **Capas de datos** | deck.gl | ScatterplotLayer, GeoJsonLayer |
| **Analisis geo** | Turf.js | Area, perimetro, centroide client-side |
| **Estado** | Zustand | Estado global con devtools |
| **Data fetching** | TanStack Query v5 | Cache y fetching con staleTime |
| **Validacion** | Zod | Schemas para GeoJSON y datos |
| **Estilos** | Tailwind CSS | Dark theme con glassmorphism |
| **Animaciones** | Framer Motion | Transiciones y animaciones de UI |
| **Graficos** | Recharts | BarChart, PieChart en paneles |
| **Iconos** | Lucide React | Iconografia consistente |
| **UI primitivos** | Radix UI | Slider, Switch accesibles |
| **Routing** | React Router v6 | Lazy loading por demo |

---

## Instalacion

### Prerequisitos

- **Node.js** >= 18
- **npm** >= 9
- Una cuenta en [Mapbox](https://account.mapbox.com/) (plan gratuito)

### Setup

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/GeoInsights.git
cd GeoInsights

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
```

Edita `.env.local` y agrega tu token de Mapbox:

```env
VITE_MAPBOX_TOKEN=pk.eyJ1...tu_token_aqui
```

```bash
# 4. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Otros comandos

```bash
npm run build      # Build de produccion
npm run preview    # Preview del build
npm run lint       # Ejecutar ESLint
```

---

## Arquitectura

```
+----------------------------------------------------------+
|                     BROWSER (SPA)                        |
|                                                          |
|   React App  <-->  Mapbox GL  <-->  deck.gl              |
|   (Vite)           (Mapas)         (Capas)               |
|                                                          |
|   +--------------------------------------------------+   |
|   |              State Layer                         |   |
|   |    Zustand (global)  +  TanStack Query (server)  |   |
|   +--------------------------------------------------+   |
+-----------------------------+----------------------------+
                              | HTTP
                              v
+----------------------------------------------------------+
|                   DATOS EXTERNOS                         |
|                                                          |
|   Mapbox Tiles    Datos GeoJSON     Simulacion local     |
|   (vector tiles)  (public/data/)    (useFleetSimulation) |
+----------------------------------------------------------+
```

### Patrones aplicados

- **Feature-Based Structure**: cada demo es autocontenido con su pagina, mapa, controles y logica
- **Separation of Concerns**: BaseMap (config) / DemoMap (capas) / Controls (UI) / Store (estado)
- **Service Layer**: servicios tipados para carga de datos estaticos y APIs
- **Lazy Loading**: cada demo se carga bajo demanda con `React.lazy()`

---

## Estructura

```
src/
  app/                    # App shell, providers, routes
  pages/
    Hub/                  # Landing page con mapa 3D
    Heatmap/              # Demo: heatmap agricola
    Tracking/             # Demo: tracking de flota
    Satelital/            # Demo: comparador satelital
    Draw/                 # Demo: dibujo y analisis
    StoryMap/             # Demo: narrativa scroll-driven
  components/
    layout/               # Navbar, DemoLayout, panels
    map/                  # BaseMap, MapControls, Legend, Popup
    ui/                   # GlassCard, StatWidget, Toggle, etc.
  hooks/                  # useFleetSimulation, useGeoData, etc.
  stores/                 # Zustand: mapStore, demoStore, uiStore
  services/               # Carga de datos y APIs
  lib/
    geo/                  # Turf.js helpers, simulacion, validators
    mapbox/               # Estilos, factory de capas deck.gl
  types/                  # TypeScript: geo, fleet, agro, map
  constants/              # Mapbox config, demos, theme

public/
  data/                   # GeoJSON de provincias, rutas, flota, agro
```

---

## Datos

| Archivo | Contenido |
|---------|-----------|
| `argentina-provinces.geojson` | Limites de 24 provincias (simplificado) |
| `agro-production.json` | ~170 puntos de produccion agricola (2018-2024) |
| `sample-fleet.json` | 20 camiones con origen, destino, carga y estado |
| `argentina-routes.json` | 6 rutas nacionales con waypoints |

Los bordes provinciales en el Heatmap usan los **vector tiles nativos de Mapbox** para precision total.

---

## Escalabilidad

El proyecto esta disenado para escalar de portafolio a producto SaaS:

```
FASE 1 (actual)          FASE 2 (SaaS)
Static + APIs publicas   + Backend (Node.js + Express)
                         + Auth (Clerk / Auth0)
                         + DB (PostgreSQL + PostGIS)
                         + Cache (Redis)
                         + Storage (S3)
```

**PostGIS** reemplazaria Turf.js con queries geoespaciales nativas (`ST_Within`, `ST_Intersects`, `ST_Area`).

---

## Licencia

Este proyecto es de uso personal como portafolio. Contactame para consultas sobre uso comercial.

---

<p align="center">
  <sub>Construido con React + Mapbox GL + deck.gl + TypeScript</sub>
</p>
