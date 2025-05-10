import { Button } from "../../components/Editor/Button";
import { useEditorStore } from "../../stores/useEditorStore";
import { toast } from "sonner";
import { Captions } from "lucide-react";

export default function VideoTranscription() {
  const { getState, setState } = useEditorStore();
  const state = getState;
  console.log(state.activeLayer);
  const handleTranscribe = async () => {
    const {
      activeLayer,
      initiateTranscription,
      updateLayer,
      setActiveLayer,
      initiateTranscriptionError,
    } = getState();

    if (!activeLayer.publicId || activeLayer.resourceType !== "video") {
      toast.error("Please select a video layer first");
      return;
    }

    try {
      await initiateTranscription(activeLayer.publicId, activeLayer.id);

      if (activeLayer.subtitledVideoUrl) {
        // If the URL is available (set in the store after success), update layer
        updateLayer({
          ...activeLayer,
          transcriptionURL: activeLayer.subtitledVideoUrl,
        });
        setActiveLayer(activeLayer.id);
      }
    } catch (error) {
      toast.error(initiateTranscriptionError || "An error occurred during transcription.");
    }
  };

  const { activeLayer, transcribingGenerating, initiateTranscriptionError } = getState();

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
