import { Button } from "../../components/Editor/Button"
import { Badge } from "../../components/Editor/Badge"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/Editor/Popover"
import { Input } from "../../components/Editor/Input"
import { Label } from "../../components/Editor/Label"
import { cn } from "../../lib/utils"
import { Paintbrush } from "lucide-react"
import { useEditorStore } from "../../stores/useEditorStore"
import { toast } from "sonner"

export default function AIRecolor() {
  const {
    tags,
    setActiveTag,
    activeTag,
    setActiveColor,
    activeColor,
    activeLayer,
    addLayer,
    recoloringImageGenerating,
    recolorImage,
    setActiveLayer,
    recolorImageError,
  } = useEditorStore((state) => ({
    tags: state.tags,
    setActiveTag: state.setActiveTag,
    activeTag: state.activeTag,
    setActiveColor: state.setActiveColor,
    activeColor: state.activeColor,
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    recoloringImageGenerating: state.recoloringImageGenerating,
    recolorImage: state.recolorImage,
    setActiveLayer: state.setActiveLayer,
    recolorImageError: state.recolorImageError,
  }));
  

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            AI Recolor
            <Paintbrush size={18} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Generative Recolor</h4>
            <p className="text-sm text-muted-foreground">
              Recolor any part of your image with generative recolor.
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
            <h3 className="text-xs">Suggested colors</h3>
            <div className="flex gap-2">
              <div
                className="w-4 h-4 bg-blue-500 rounded-sm cursor-pointer"
                onClick={() => setActiveColor("blue")}
              ></div>
              <div
                className="w-4 h-4 bg-red-500 rounded-sm cursor-pointer"
                onClick={() => setActiveColor("red")}
              ></div>
              <div
                className="w-4 h-4 bg-green-500 rounded-sm cursor-pointer"
                onClick={() => setActiveColor("green")}
              ></div>
              <div
                className="w-4 h-4 bg-yellow-500 rounded-sm cursor-pointer"
                onClick={() => setActiveColor("yellow")}
              ></div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Color</Label>
              <Input
                name="color"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
        <Button
          disabled={
            !activeLayer?.url || !activeTag || !activeColor || recoloringImageGenerating
          }
          className="w-full mt-4"
          onClick={async () => {
            await recolorImage(activeLayer.url, "prompt_" + activeTag, "to-color_" + activeColor)

            if (!recolorImageError && !recoloringImageGenerating) {
              const newLayerId = crypto.randomUUID()
              addLayer({
                id: newLayerId,
                name: "recolored" + activeLayer.name,
                format: activeLayer.format,
                height: activeLayer.height,
                width: activeLayer.width,
                url: res.data.success,
                publicId: activeLayer.publicId,
                resourceType: "image",
              })
              setActiveLayer(newLayerId)
            } else {
              toast.error(recolorImageError)
            }
          }}
        >
          {recoloringImageGenerating ? "recoloringImageGenerating..." : "Recolor"}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
