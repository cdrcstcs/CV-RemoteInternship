import React from 'react';
import { cn } from "../../lib/utils"; // Assuming this is a utility function you can continue using
import { motion } from "framer-motion";
import ImageComparison from "../../components/Editor/ImageComparison"; // Assuming this component does not rely on Next.js
import { useEditorStore } from "../../stores/useEditorStore"
export default function ActiveImage() {
  const { generating, activeLayer, layerComparisonMode, comparedLayers, layers } = useEditorStore((state) => ({
    generating: state.generating,
    activeLayer: state.activeLayer,
    layerComparisonMode: state.layerComparisonMode,
    comparedLayers: state.comparedLayers,
    layers: state.layers,
  }));  

  // Return null if there is no active layer or compared layers
  if (!activeLayer.url && comparedLayers.length === 0) return null;

  const renderLayer = (layer) => (
    <div className="relative w-full h-full flex items-center justify-center">
      {layer.resourceType === "image" && (
        <img
          alt={layer.name || "Image"}
          src={layer.url || ""}
          className={cn(
            "rounded-lg object-contain",
            generating ? "animate-pulse" : ""
          )}
          style={{ width: "100%", height: "auto" }} // handle sizing without `fill` from Next.js
        />
      )}
      {layer.resourceType === "video" && (
        <video
          width={layer.width}
          height={layer.height}
          controls
          className="rounded-lg object-contain max-w-full max-h-full"
          src={layer.transcriptionURL || layer.url}
        />
      )}
    </div>
  );

  // If layer comparison mode is active, render the comparison
  if (layerComparisonMode && comparedLayers.length > 0) {
    const comparisonLayers = comparedLayers
      .map((id) => layers.find((l) => l.id === id))
      .filter(Boolean);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full relative h-screen p-24 bg-secondary flex flex-col items-center justify-center"
      >
        <ImageComparison layers={comparisonLayers} />
      </motion.div>
    );
  }

  // Default render with active layer
  return (
    <div className="w-full relative h-screen p-24 bg-secondary flex flex-col items-center justify-center">
      {renderLayer(activeLayer)}
    </div>
  );
}
