import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogTitle } from "../../components/Editor/Dialog"
import loadingAnimation from "../../../src/animations/loading.json"
import Lottie from "lottie-react"
import { useEditorStore } from "../../stores/useEditorStore"

export default function Loading() {
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
  } = useEditorStore((state) => ({
    removingBackgroundGenerating: state.removingBackgroundGenerating,
    replacingBackgroundGenerating: state.replacingBackgroundGenerating,
    extractingImageGenerating: state.extractingImageGenerating,
    genFillingGenerating: state.genFillingGenerating,
    genRemovingGenerating: state.genRemovingGenerating,
    recoloringImageGenerating: state.recoloringImageGenerating,
    croppingVideoGenerating: state.croppingVideoGenerating,
    transcribingGenerating: state.transcribingGenerating,
    uploadingImageGenerating: state.uploadingImageGenerating,
    uploadingVideoGenerating: state.uploadingVideoGenerating,
    activeLayer: state.activeLayer,
  }));

  const generating =
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

  return (
    <Dialog open={generating}>
      <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>Editing {activeLayer.name}</DialogTitle>
          <DialogDescription>
            Please note that this operation might take up to a couple of seconds.
          </DialogDescription>
        </DialogHeader>
        <Lottie className="w-36" animationData={loadingAnimation} />
      </DialogContent>
    </Dialog>
  );
}
