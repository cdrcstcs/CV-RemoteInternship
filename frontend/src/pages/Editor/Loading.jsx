import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTitle } from "../../components/Editor/Dialog"
import useImageStore from "../../stores/useImageStore"
import useLayerStore from "../../stores/useLayerStore"
import loadingAnimation from "../../../src/animations/loading.json"
import Lottie from "lottie-react"

export default function Loading() {
  const generating = useImageStore((state) => state.generating)
  const setGenerating = useImageStore((state) => state.setGenerating)
  const activeLayer = useLayerStore((state) => state.activeLayer)
  return (
    <Dialog open={generating} onOpenChange={setGenerating}>
      <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>Editing {activeLayer.name}</DialogTitle>
          <DialogDescription>
            Please note that this operation might take up to a couple of
            seconds.
          </DialogDescription>
        </DialogHeader>
        <Lottie className="w-36" animationData={loadingAnimation} />
      </DialogContent>
    </Dialog>
  )
}
