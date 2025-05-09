import { Button } from "../../components/Editor/Button"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/Editor/Popover"
import { Image } from "lucide-react"
import { toast } from "sonner"
import { useEditorStore } from "../../stores/useEditorStore"
export default function BgRemove() {
  const {
    activeTag,
    activeColor,
    activeLayer,
    addLayer,
    removingBackgroundGenerating,
    setActiveLayer,
    removeBackground,
    removeBackgroundError,
  } = useEditorStore((state) => ({
    activeTag: state.activeTag,
    activeColor: state.activeColor,
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    removingBackgroundGenerating: state.removingBackgroundGenerating,
    setActiveLayer: state.setActiveLayer,
    removeBackground: state.removeBackground,
    removeBackgroundError: state.removeBackgroundError,
  }));
  

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
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
          disabled={
            !activeLayer?.url || !activeTag || !activeColor || removingBackgroundGenerating
          }
          className="w-full mt-4"
          onClick={async () => {
            await removeBackground(activeLayer.url, activeLayer.format); // Use removeBackground from the store
            
            // Handle errors or success
            if (removeBackgroundError) {
              toast.error(removeBackgroundError); // Display error message
              return; // Early exit if there's an error
            }
            
            // Proceed with adding the new layer if the background removal is successful
            if (!removeBackgroundError && !removingBackgroundGenerating) {
              const newLayerId = crypto.randomUUID()
              addLayer({
                id: newLayerId,
                name: "bg-removed" + activeLayer.name,
                format: "png",
                height: activeLayer.height,
                width: activeLayer.width,
                url: activeLayer.url, // Ensure this is set to the new image URL after background removal
                publicId: activeLayer.publicId,
                resourceType: "image",
              })
              setActiveLayer(newLayerId) // Set the newly added layer as the active layer
            }
          }}
        >
          {removingBackgroundGenerating ? "Removing..." : "Remove Background"}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
