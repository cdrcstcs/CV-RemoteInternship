import VideoTranscription from "./Transcribe"
import useLayerStore from "../../stores/useLayerStore"
import SmartCrop from "./SmartCrop"

export default function VideoTools() {
  const activeLayer = useLayerStore((state) => state.activeLayer)
  if (activeLayer.resourceType === "video")
    return (
      <>
        <VideoTranscription />
        <SmartCrop />
      </>
    )
}
