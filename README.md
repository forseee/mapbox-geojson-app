# How to Run the Application

## 1. Install Dependencies

```bash
npm install
```

## 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

DATABASE_URL=postgresql://user:password@host:5432/database_name
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token

Variables description:

DATABASE_URL — connection string to a Postgres/PostGIS database.
VITE_MAPBOX_ACCESS_TOKEN — Mapbox public access token.

The backend expects a Postgres/PostGIS table named public.sample_features.
If your table has a different name, update it in server/index.js; otherwise requests to /api/geodata will fail.
Required table structure:
id — TEXT PRIMARY KEY
count — INTEGER NOT NULL
geometry — GEOMETRY(Geometry, 4326)
Schema reference: server/db/schema.sql
PostGIS must be enabled: CREATE EXTENSION IF NOT EXISTS postgis;

## 3. Run

```bash
npm run dev
```

Open http://localhost:5173
