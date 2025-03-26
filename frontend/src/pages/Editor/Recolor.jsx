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
  const tags = useEditorStore((state) => state.tags)
  const setActiveTag = useEditorStore((state) => state.setActiveTag)
  const activeTag = useEditorStore((state) => state.activeTag)
  const setActiveColor = useEditorStore((state) => state.setActiveColor)
  const activeColor = useEditorStore((state) => state.activeColor)
  const setGenerating = useEditorStore((state) => state.setGenerating)
  const activeLayer = useEditorStore((state) => state.activeLayer)
  const addLayer = useEditorStore((state) => state.addLayer)
  const generating = useEditorStore((state) => state.generating)
  const recolorImage = useEditorStore((state) => state.recolorImage)
  const setActiveLayer = useEditorStore((state) => state.setActiveLayer)
  const recolorImageError = useEditorStore((state) => state.recolorImageError)

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
            !activeLayer?.url || !activeTag || !activeColor || generating
          }
          className="w-full mt-4"
          onClick={async () => {
            setGenerating(true)
            await recolorImage(activeLayer.url, "prompt_" + activeTag, "to-color_" + activeColor)

            if (!recolorImageError) {
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
              setGenerating(false)
              setActiveLayer(newLayerId)
            } else {
              toast.error("Recoloring failed")
              setGenerating(false)
            }
          }}
        >
          {generating ? "Generating..." : "Recolor"}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
