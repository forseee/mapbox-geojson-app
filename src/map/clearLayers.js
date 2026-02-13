export function removeSourceAndLayers(map, sourceId) {
  if (!map.isStyleLoaded()) return

  const style = map.getStyle()
  const layerIds = style.layers
    .filter((layer) => "source" in layer && layer.source === sourceId)
    .map((layer) => layer.id)

  for (const id of layerIds) {
    if (map.getLayer(id)) map.removeLayer(id)
  }

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId)
  }
}
