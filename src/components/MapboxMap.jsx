import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import { useMapStore } from "../store/mapStore"
import Button from "./Button"
import { useMapLayerActions } from "../hooks/useMapLayerActions"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? ""

const MapboxMap = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const { geoData, fetchGeoData, loading, error } = useMapStore()

  // Initial layer: GeoJSON from API (fetched on mount). I don't change base layer. On button click: custom layers (GeoJSON / vector tiles) replace it.
  // Intentionally didn't change the first render behavior — noticed it has different styles, but it wasn't in the task requirements.
  const { handleLoadGeoJSON, handleLoadVectorTiles, handleFilterData } =
    useMapLayerActions(map)

  // Initialize map
  useEffect(() => {
    if (map.current) return // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-89, 30.4], // Centered on the data
      zoom: 8,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
  }, [])

  // Fetch data on mount
  useEffect(() => {
    fetchGeoData()
  }, [fetchGeoData])

  // Add GeoJSON layer when data is loaded
  // Intentionally didn't change the first render behavior — noticed it has different styles, but it wasn't in the task requirements.
  useEffect(() => {
    if (!map.current || !geoData) return

    map.current.on("load", () => {
      // Add source
      if (!map.current.getSource("geodata")) {
        map.current.addSource("geodata", {
          type: "geojson",
          data: geoData,
        })

        // Add fill layer for polygons
        map.current.addLayer({
          id: "geodata-fill",
          type: "fill",
          source: "geodata",
          paint: {
            "fill-color": "#088",
            "fill-opacity": 0.4,
          },
        })

        // Add outline layer
        map.current.addLayer({
          id: "geodata-outline",
          type: "line",
          source: "geodata",
          paint: {
            "line-color": "#000",
            "line-width": 2,
          },
        })

        // Fit map to bounds of the data
        const bounds = new mapboxgl.LngLatBounds()
        geoData.features.forEach((feature) => {
          if (feature.geometry.type === "Polygon") {
            feature.geometry.coordinates[0].forEach((coord) => {
              bounds.extend(coord)
            })
          } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon) => {
              polygon[0].forEach((coord) => {
                bounds.extend(coord)
              })
            })
          }
        })
        map.current.fitBounds(bounds, { padding: 50 })

        // Add popup on click
        map.current.on("click", "geodata-fill", (e) => {
          const properties = e.features[0].properties
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
              `
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 8px 0;">Feature Details</h3>
                ${Object.entries(properties)
                  .map(
                    ([key, value]) =>
                      `<p style="margin: 4px 0;"><strong>${key}:</strong> ${value}</p>`,
                  )
                  .join("")}
              </div>
            `,
            )
            .addTo(map.current)
        })

        // Change cursor on hover
        map.current.on("mouseenter", "geodata-fill", () => {
          map.current.getCanvas().style.cursor = "pointer"
        })
        map.current.on("mouseleave", "geodata-fill", () => {
          map.current.getCanvas().style.cursor = ""
        })
      }
    })

    // If map is already loaded, add the source and layers immediately
    if (map.current.loaded()) {
      if (!map.current.getSource("geodata")) {
        map.current.addSource("geodata", {
          type: "geojson",
          data: geoData,
        })

        map.current.addLayer({
          id: "geodata-fill",
          type: "fill",
          source: "geodata",
          paint: {
            "fill-color": "#088",
            "fill-opacity": 0.4,
          },
        })

        map.current.addLayer({
          id: "geodata-outline",
          type: "line",
          source: "geodata",
          paint: {
            "line-color": "#000",
            "line-width": 2,
          },
        })

        const bounds = new mapboxgl.LngLatBounds()
        geoData.features.forEach((feature) => {
          if (feature.geometry.type === "Polygon") {
            feature.geometry.coordinates[0].forEach((coord) => {
              bounds.extend(coord)
            })
          } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon) => {
              polygon[0].forEach((coord) => {
                bounds.extend(coord)
              })
            })
          }
        })
        map.current.fitBounds(bounds, { padding: 50 })
      }
    }
  }, [geoData])

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          Loading geodata...
        </div>
      )}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            backgroundColor: "#f44336",
            color: "white",
            padding: "12px 20px",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          Error: {error}
        </div>
      )}
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <div
        style={{
          position: "absolute",
          display: "flex",
          gap: 10,
          top: 10,
          left: 10,
        }}
      >
        <Button label="Load from Server" onClick={handleLoadGeoJSON} />
        <Button label="Load Vector Tiles" onClick={handleLoadVectorTiles} />
        <Button label="Filter Data (Count > 200k)" onClick={handleFilterData} />
      </div>
    </div>
  )
}

export default MapboxMap
