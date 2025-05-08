import UploadForm from "./UploadForm"
import ActiveImage from "./ActiveImage"
import Layers from "./Layers"
import ImageTools from "./ImageTools"
import VideoTools from "./VideoTools"
import Loading from "./Loading"
import { useEditorStore } from "../../stores/useEditorStore"
export default function Editor() {
  const activeLayer = useEditorStore((state) => state.activeLayer)
  return (
    <div className="flex h-full ">
      <div className="py-6 px-4  min-w-48 ">
        <div className="flex flex-col gap-4 ">
          {activeLayer.resourceType === "video" ? <VideoTools /> : null}
          {activeLayer.resourceType === "image" ? <ImageTools /> : null}
        </div>
      </div>
      <Loading />
      <ActiveImage />
      <UploadForm />
      <Layers />
    </div>
  )
}
