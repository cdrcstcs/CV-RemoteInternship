import { Button } from "../../components/Editor/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/Editor/Popover";
import { Input } from "../../components/Editor/Input";
import { Label } from "../../components/Editor/Label";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useEditorStore } from "../../stores/useEditorStore";

export default function AIBackgroundReplace() {
  const { getState } = useEditorStore; // ✅ only getState for all state reads
  const [prompt, setPrompt] = useState("");

  return (
    <Popover>
      <PopoverTrigger
        disabled={!getState().activeLayer?.url} // ✅ latest activeLayer
        asChild
      >
        <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            AI BG Replace
            <ImageOff size={18} />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Generative Background Replace</h4>
            <p className="text-sm text-muted-foreground">
              Replace the background of your image with AI-generated content.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="prompt">Prompt (optional)</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the new background"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>

        <Button
          disabled={() => {
            const state = getState();
            return !state.activeLayer?.url || state.replacingBackgroundGenerating;
          }}
          className="w-full mt-4"
          onClick={async () => {
            const stateBefore = getState();
            const { activeLayer, replaceBackground } = stateBefore;

            if (!activeLayer?.url) {
              toast.error("No active layer to replace background!");
              return;
            }

            await replaceBackground(activeLayer.url, prompt, activeLayer.id);

            const stateAfter = getState();
            const {
              activeLayer: latestActiveLayer,
              replaceBackgroundError,
              replacingBackgroundGenerating,
              addLayer,
              setActiveLayer,
            } = stateAfter;

            if (replaceBackgroundError) {
              toast.error(replaceBackgroundError);
            } else if (!replacingBackgroundGenerating) {
              const newLayerId = crypto.randomUUID();
              addLayer({
                id: newLayerId,
                name: "bg-replaced-" + latestActiveLayer.name,
                format: latestActiveLayer.format,
                height: latestActiveLayer.height,
                width: latestActiveLayer.width,
                url: latestActiveLayer.url,
                publicId: latestActiveLayer.publicId,
                resourceType: "image",
              });
              setActiveLayer(newLayerId);
              toast.success("Background replaced successfully!");
            }
          }}
        >
          {getState().replacingBackgroundGenerating
            ? "Replacing..."
            : "Replace Background"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
