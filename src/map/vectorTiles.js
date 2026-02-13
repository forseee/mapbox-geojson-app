export const VECTOR_SOURCE_ID = "vector-source"
export const VECTOR_LAYER_FILL_ID = "vector-layer-fill"
export const VECTOR_LAYER_LINE_ID = "vector-layer-line"

const defaults = {
  url: "mapbox://forse.sample_data",
  sourceLayer: "sample-data.json",
  fillColor: "#FFA500",
  fillOpacity: 0.4,
  lineColor: "#FFA500",
  lineWidth: 2,
}

export function addVectorTilesLayer(map, filter, options = {}) {
  if (!map.isStyleLoaded()) return

  const opts = { ...defaults, ...options }
  if (!opts.url || !opts.sourceLayer) {
    console.error(
      "Missing VITE_VECTOR_TILESET_URL or VITE_VECTOR_SOURCE_LAYER in .env",
    )
    return
  }

  map.addSource(VECTOR_SOURCE_ID, {
    type: "vector",
    url: opts.url,
  })

  const transition = { duration: 600 }

  map.addLayer({
    id: VECTOR_LAYER_FILL_ID,
    source: VECTOR_SOURCE_ID,
    "source-layer": opts.sourceLayer,
    type: "fill",
    ...(filter ? { filter } : {}),
    paint: {
      "fill-color": opts.fillColor,
      "fill-opacity": 0,
      "fill-opacity-transition": transition,
    },
  })
  map.setPaintProperty(VECTOR_LAYER_FILL_ID, "fill-opacity", opts.fillOpacity)

  map.addLayer({
    id: VECTOR_LAYER_LINE_ID,
    source: VECTOR_SOURCE_ID,
    "source-layer": opts.sourceLayer,
    type: "line",
    ...(filter ? { filter } : {}),
    paint: {
      "line-color": opts.lineColor,
      "line-width": opts.lineWidth,
      "line-opacity": 0,
      "line-opacity-transition": transition,
    },
  })
  map.setPaintProperty(VECTOR_LAYER_LINE_ID, "line-opacity", 1)
}
