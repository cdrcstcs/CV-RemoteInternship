import { create } from "zustand";

// Define the state for Layer store
export const useLayerStore = create((set) => ({
  layers: [],
  activeLayer: {},
  layerComparisonMode: false,
  comparedLayers: [],

  // Add a new layer
  addLayer: (layer) =>
    set((state) => ({
      layers: [...state.layers, { ...layer }],
    })),

  // Remove a layer by ID
  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== id),
    })),

  // Set the active layer by ID
  setActiveLayer: (id) =>
    set((state) => ({
      activeLayer:
        state.layers.find((l) => l.id === id) || state.layers[0],
    })),

  // Update a layer
  updateLayer: (layer) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === layer.id ? layer : l
      ),
    })),

  // Set poster for a layer by ID
  setPoster: (id, posterUrl) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, poster: posterUrl } : l
      ),
    })),

  // Set transcription URL for a layer by ID
  setTranscription: (id, transcriptionURL) =>
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, transcriptionURL } : l
      ),
    })),

  // Set the layer comparison mode
  setLayerComparisonMode: (mode) =>
    set(() => ({
      layerComparisonMode: mode,
      comparedLayers: mode ? [] : [],
    })),

  // Set compared layers
  setComparedLayers: (layers) =>
    set(() => ({
      comparedLayers: layers,
      layerComparisonMode: layers.length > 0,
    })),

  // Toggle a layer in the compared layers list
  toggleComparedLayer: (id) =>
    set((state) => {
      const newComparedLayers = state.comparedLayers.includes(id)
        ? state.comparedLayers.filter((layerId) => layerId !== id)
        : [...state.comparedLayers, id].slice(-2);
      return {
        comparedLayers: newComparedLayers,
        layerComparisonMode: newComparedLayers.length > 0,
      };
    }),

  // Reset state to initial values
  reset: () =>
    set({
      layers: [],
      activeLayer: {},
      layerComparisonMode: false,
      comparedLayers: [],
    }),
}));

export default useLayerStore;
