export const GEOJSON_SOURCE_ID = "geojson"
export const GEOJSON_LAYER_FILL_ID = "geojson-layer-fill"
export const GEOJSON_LAYER_LINE_ID = "geojson-layer-line"

const defaultOptions = {
  fillColor: "#000000",
  fillOpacity: 0.1,
  lineColor: "#000000",
  lineWidth: 2,
}

export function addGeoJsonLayers(map, data, options = {}) {
  if (!map.isStyleLoaded()) return

  const opts = { ...defaultOptions, ...options }

  map.addSource(GEOJSON_SOURCE_ID, {
    type: "geojson",
    data,
  })

  const transition = { duration: 600 }

  map.addLayer({
    id: GEOJSON_LAYER_FILL_ID,
    source: GEOJSON_SOURCE_ID,
    type: "fill",
    paint: {
      "fill-color": opts.fillColor,
      "fill-opacity": 0,
      "fill-opacity-transition": transition,
    },
  })
  map.setPaintProperty(GEOJSON_LAYER_FILL_ID, "fill-opacity", opts.fillOpacity)

  map.addLayer({
    id: GEOJSON_LAYER_LINE_ID,
    source: GEOJSON_SOURCE_ID,
    type: "line",
    paint: {
      "line-color": opts.lineColor,
      "line-width": opts.lineWidth,
      "line-opacity": 0,
      "line-opacity-transition": transition,
    },
  })
  map.setPaintProperty(GEOJSON_LAYER_LINE_ID, "line-opacity", 1)
}
