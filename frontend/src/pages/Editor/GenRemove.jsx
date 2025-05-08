import { Button } from "../../components/Editor/Button"
import { Badge } from "../../components/Editor/Badge"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/Editor/Popover"
import { Input } from "../../components/Editor/Input"
import { Label } from "../../components/Editor/Label"
import { cn } from "../../lib/utils"
import { Eraser } from "lucide-react"
import { useEditorStore } from "../../stores/useEditorStore" // Importing the useEditorStore

export default function GenRemove() {
  const {
    tags,
    setActiveTag,
    generating,
    activeTag,
    activeColor,
    setGenerating,
    activeLayer,
    addLayer,
    setActiveLayer,
    genRemove,
    genRemoveError,
  } = useEditorStore((state) => ({
    tags: state.tags,
    setActiveTag: state.setActiveTag,
    generating: state.generating,
    activeTag: state.activeTag,
    activeColor: state.activeColor,
    setGenerating: state.setGenerating,
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    setActiveLayer: state.setActiveLayer,
    genRemove: state.genRemove,
    genRemoveError: state.genRemoveError,
  }));
  
  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="p-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            Content Aware <Eraser size={20} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Smart AI Remove</h4>
            <p className="text-sm text-muted-foreground">
              Generative Remove any part of the image
            </p>
          </div>
          <div className="grid gap-2">
            <h3 className="text-xs">Suggested selections</h3>
            <div className="flex gap-2">
              {tags.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No tags available
                </p>
              )}
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={cn(
                    "px-2 py-1 rounded text-xs",
                    activeTag === tag && "bg-primary text-white"
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Selection</Label>
              <Input
                className="col-span-2 h-8"
                value={activeTag}
                name="tag"
                onChange={(e) => {
                  setActiveTag(e.target.value)
                }}
              />
            </div>
          </div>
        </div>
        <Button
          className="w-full mt-4"
          disabled={
            !activeTag || !activeColor || !activeLayer.url || generating
          }
          onClick={async () => {
            setGenerating(true)
            await genRemove(activeLayer.url, activeTag);  // Using genRemove from store

            if (!genRemoveError) {
              setGenerating(false)

              const newLayerId = crypto.randomUUID()
              addLayer({
                id: newLayerId,
                url: activeLayer,
                format: activeLayer.format,
                height: activeLayer.height,
                width: activeLayer.width,
                name: activeLayer.name,
                publicId: activeLayer.publicId,
                resourceType: "image",
              })
              setActiveLayer(newLayerId)
            } else {
              setGenerating(false)
            }
          }}
        >
          Magic Remove 🎨
        </Button>
      </PopoverContent>
    </Popover>
  )
}
