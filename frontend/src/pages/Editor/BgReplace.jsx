import useImageStore from "../../stores/useImageStore"
import { Button } from "../../components/Editor/Button"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/Editor/Popover"
import { Input } from "../../components/Editor/Input"
import { Label } from "../../components/Editor/Label"
import { ImageOff } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useEditorStore } from "../../stores/useEditorStore"
export default function AIBackgroundReplace() {
  const {
    setGenerating,
    activeLayer,
    addLayer,
    generating,
    setActiveLayer,
    replaceBackground,
    replaceBackgroundError,
  } = useEditorStore((state) => ({
    setGenerating: state.setGenerating,
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    generating: state.generating,
    setActiveLayer: state.setActiveLayer,
    replaceBackground: state.replaceBackground,
    replaceBackgroundError: state.replaceBackgroundError,
  }));
  

  const [prompt, setPrompt] = useState("")

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
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
            <h4 className="font-medium leading-none">
              Generative Background Replace
            </h4>
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
          disabled={!activeLayer?.url || generating}
          className="w-full mt-4"
          onClick={async () => {
            setGenerating(true)

            // Call the replaceBackground function from the store
            await replaceBackground(activeLayer.url, prompt)

            // Check for error after calling replaceBackground
            if (replaceBackgroundError) {
              setGenerating(false)
              toast.error(replaceBackgroundError)
            } else {
              // If no error, process the result (assuming replaceBackground updates the active layer)
              const newLayerId = crypto.randomUUID()
              addLayer({
                id: newLayerId,
                name: "bg-replaced-" + activeLayer.name,
                format: activeLayer.format,
                height: activeLayer.height,
                width: activeLayer.width,
                url: activeLayer.url, // Assuming the activeLayer URL is updated by replaceBackground
                publicId: activeLayer.publicId,
                resourceType: "image",
              })
              setGenerating(false)
              setActiveLayer(newLayerId)
              toast.success("Background replaced successfully!")
            }
          }}
        >
          {generating ? "Generating..." : "Replace Background"}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
