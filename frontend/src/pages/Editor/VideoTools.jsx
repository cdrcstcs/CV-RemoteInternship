import VideoTranscription from "./Transcribe"
import SmartCrop from "./SmartCrop"
import { useEditorStore } from "../../stores/useEditorStore"

export default function VideoTools() {
  const activeLayer = useEditorStore((state) => state.activeLayer)
  if (activeLayer.resourceType === "video")
    return (
      <>
        <VideoTranscription />
        <SmartCrop />
      </>
    )
}
