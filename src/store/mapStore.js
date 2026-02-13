import { create } from "zustand"

export const useMapStore = create((set) => ({
  geoData: null,
  loading: false,
  error: null,

  fetchGeoData: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/geodata")
      if (!response.ok) {
        throw new Error("Failed to fetch geodata")
      }
      const data = await response.json()
      set({ geoData: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
