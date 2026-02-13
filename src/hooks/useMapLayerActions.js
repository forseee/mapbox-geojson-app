import {
  addVectorTilesLayer,
  addGeoJsonLayers,
  removeSourceAndLayers,
  GEOJSON_SOURCE_ID,
  VECTOR_SOURCE_ID,
} from "../map"
import { useMapStore } from "../store/mapStore"

export function useMapLayerActions(mapRef) {
  const { geoData } = useMapStore()

  const clearTilesLayers = (map) => {
    removeSourceAndLayers(map, "geodata")
    removeSourceAndLayers(map, GEOJSON_SOURCE_ID)
    removeSourceAndLayers(map, VECTOR_SOURCE_ID)
  }

  const handleLoadGeoJSON = async () => {
    const map = mapRef.current
    if (!map) return

    clearTilesLayers(map)
    addGeoJsonLayers(map, geoData)
  }

  const handleLoadVectorTiles = () => {
    const map = mapRef.current
    if (!map) return

    clearTilesLayers(map)
    addVectorTilesLayer(map)
  }

  const handleFilterData = () => {
    const map = mapRef.current
    if (!map) return

    const filter = [">", ["get", "count"], 200000]
    clearTilesLayers(map)
    addVectorTilesLayer(map, filter)
  }

  return {
    handleLoadGeoJSON,
    handleLoadVectorTiles,
    handleFilterData,
  }
}
