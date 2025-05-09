import { Button } from "../../components/Editor/Button";
import { useEditorStore } from "../../stores/useEditorStore";
import { toast } from "sonner";
import { Captions } from "lucide-react";

export default function VideoTranscription() {
  const {
    activeLayer,
    updateLayer,
    setActiveLayer,
    initiateTranscription,
    transcribingGenerating,
    initiateTranscriptionError,
  } = useEditorStore((state) => ({
    activeLayer: state.activeLayer,
    updateLayer: state.updateLayer,
    setActiveLayer: state.setActiveLayer,
    initiateTranscription: state.initiateTranscription,
    transcribingGenerating: state.transcribingGenerating,
    initiateTranscriptionError: state.initiateTranscriptionError,
  }));

  const handleTranscribe = async () => {
    if (!activeLayer.publicId || activeLayer.resourceType !== "video") {
      toast.error("Please select a video layer first");
      return;
    }

    await initiateTranscription(activeLayer.publicId);

    if (activeLayer.subtitledVideoUrl) {
      // If the URL is available (set in the store after success), update layer
      updateLayer({
        ...activeLayer,
        transcriptionURL: activeLayer.subtitledVideoUrl,
      });
      setActiveLayer(activeLayer.id);
    }
  };

  return (
    <div className="flex items-center">
      {!activeLayer.transcriptionURL && (
        <Button
          className="py-8 w-full"
          onClick={handleTranscribe}
          disabled={transcribingGenerating || activeLayer.resourceType !== "video"}
          variant="outline"
        >
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            {transcribingGenerating ? "Transcribing..." : "Transcribe"}
            <Captions size={18} />
          </span>
        </Button>
      )}

      {activeLayer.transcriptionURL && (
        <Button className="py-8 w-full" variant="outline" asChild>
          <a
            href={activeLayer.transcriptionURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
              View Transcription
              <Captions size={18} />
            </span>
          </a>
        </Button>
      )}

      {initiateTranscriptionError && (
        <p className="text-red-500 text-xs mt-2">{initiateTranscriptionError}</p>
      )}
    </div>
  );
}
