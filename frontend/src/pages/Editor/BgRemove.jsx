import { Button } from "../../components/Editor/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/Editor/Popover";
import { Image } from "lucide-react";
import { toast } from "sonner";
import { useEditorStore } from "../../stores/useEditorStore";

export default function BgRemove() {
  const { getState } = useEditorStore; // ✅ get direct state access functions

  return (
    <Popover>
      <PopoverTrigger
        disabled={!getState().activeLayer?.url} // ✅ access latest activeLayer
        asChild
      >
        <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            BG Removal
            <Image size={18} />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Background Removal</h4>
            <p className="text-sm max-w-xs text-muted-foreground">
              Remove the background of an image with one simple click.
            </p>
          </div>
        </div>

        <Button
          disabled={() => {
            const state = getState();
            return (
              !state.activeLayer?.url ||
              !state.activeTag ||
              !state.activeColor ||
              state.removingBackgroundGenerating
            );
          }}
          className="w-full mt-4"
          onClick={async () => {
            const stateBefore = getState();
            const { activeLayer, removeBackground } = stateBefore;

            await removeBackground(
              activeLayer.url,
              activeLayer.format,
              activeLayer.id
            );

            const stateAfter = getState();
            const { removeBackgroundError, removingBackgroundGenerating } = stateAfter;
            const latestActiveLayer = stateAfter.activeLayer;

            if (removeBackgroundError) {
              toast.error(removeBackgroundError);
              return;
            }

            if (!removeBackgroundError && !removingBackgroundGenerating) {
              const newLayerId = crypto.randomUUID();
              stateAfter.addLayer({
                id: newLayerId,
                name: "bg-removed-" + latestActiveLayer.name,
                format: "png",
                height: latestActiveLayer.height,
                width: latestActiveLayer.width,
                url: latestActiveLayer.url,
                publicId: latestActiveLayer.publicId,
                resourceType: "image",
              });
              stateAfter.setActiveLayer(newLayerId);
            }
          }}
        >
          {getState().removingBackgroundGenerating ? "Removing..." : "Remove Background"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
