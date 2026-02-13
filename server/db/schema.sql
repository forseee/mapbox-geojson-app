CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS sample_features (
    id TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    geometry GEOMETRY(Geometry, 4326)
);
