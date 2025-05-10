import React from 'react';
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import ImageComparison from "../../components/Editor/ImageComparison";
import { useEditorStore } from "../../stores/useEditorStore";

export default function ActiveImage() {
  const { getState } = useEditorStore; // 🔥 getState for imperative state reads
  const state = getState();

  const {
    removingBackgroundGenerating,
    replacingBackgroundGenerating,
    extractingImageGenerating,
    genFillingGenerating,
    genRemovingGenerating,
    recoloringImageGenerating,
    croppingVideoGenerating,
    transcribingGenerating,
    uploadingImageGenerating,
    uploadingVideoGenerating,
    activeLayer,
    layerComparisonMode,
    comparedLayers,
    layers,
  } = state;

  console.log(activeLayer);

  const anyGenerating =
    removingBackgroundGenerating ||
    replacingBackgroundGenerating ||
    extractingImageGenerating ||
    genFillingGenerating ||
    genRemovingGenerating ||
    recoloringImageGenerating ||
    croppingVideoGenerating ||
    transcribingGenerating ||
    uploadingImageGenerating ||
    uploadingVideoGenerating;

  if (!activeLayer?.url && comparedLayers.length === 0) return null;

  const renderLayer = (layer) => (
    <div className="relative w-full h-full flex items-center justify-center">
      {layer.resourceType === "image" && (
        <img
          alt={layer.name || "Image"}
          src={layer.url || ""}
          className={cn(
            "rounded-lg object-contain",
            anyGenerating && "animate-pulse"
          )}
          style={{ width: "100%", height: "auto" }}
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

  return (
    <div className="w-full relative h-screen p-24 bg-secondary flex flex-col items-center justify-center">
      {renderLayer(activeLayer)}
    </div>
  );
}
