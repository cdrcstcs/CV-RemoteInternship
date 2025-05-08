import React, { useState } from "react"
import { Button } from "../../components/Editor/Button"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/Editor/Popover"
import { Input } from "../../components/Editor/Input"
import { Label } from "../../components/Editor/Label"
import { Scissors } from "lucide-react"
import { Checkbox } from "../../components/Editor/Checkbox"
import { RadioGroup, RadioGroupItem } from "../../components/Editor/RadioGroup"
import { useEditorStore } from "../../stores/useEditorStore" // Import the store

export default function ExtractPart() {
  const { setGenerating, activeLayer, addLayer, generating, setActiveLayer } = useEditorStore((state) => ({
    setGenerating: state.setGenerating,
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    generating: state.generating,
    setActiveLayer: state.setActiveLayer,
  }));
  

  const [prompts, setPrompts] = useState([""])
  const [multiple, setMultiple] = useState(false)
  const [mode, setMode] = useState("default")
  const [invert, setInvert] = useState(false)

  const addPrompt = () => {
    setPrompts([...prompts, ""])
  }

  const updatePrompt = (index, value) => {
    const newPrompts = [...prompts]
    newPrompts[index] = value
    setPrompts(newPrompts)
  }

  // Get extractImage function from useEditorStore
  const extractImage = useEditorStore((state) => state.extractImage)

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            AI Extract
            <Scissors size={18} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">AI Extract</h4>
            <p className="text-sm text-muted-foreground">
              Extract specific areas or objects from your image using AI.
            </p>
          </div>
          <div className="grid gap-2">
            {prompts.map((prompt, index) => (
              <div key={index} className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor={`prompt-${index}`}>Prompt {index + 1}</Label>
                <Input
                  id={`prompt-${index}`}
                  value={prompt}
                  onChange={(e) => updatePrompt(index, e.target.value)}
                  placeholder="Describe what to extract"
                  className="col-span-2 h-8"
                />
              </div>
            ))}
            <Button onClick={addPrompt} size="sm">
              Add Prompt
            </Button>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="multiple"
                checked={multiple}
                onCheckedChange={(checked) => setMultiple(checked)}
              />
              <Label htmlFor="multiple">Extract multiple objects</Label>
            </div>

            <RadioGroup value={mode} onValueChange={setMode}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="mode-default" />
                <Label htmlFor="mode-default">
                  Default (transparent background)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mask" id="mode-mask" />
                <Label htmlFor="mode-mask">Mask</Label>
              </div>
            </RadioGroup>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="invert"
                checked={invert}
                onCheckedChange={(checked) => setInvert(checked)}
              />
              <Label htmlFor="invert">Invert (keep background)</Label>
            </div>
          </div>
        </div>
        <Button
          disabled={
            !activeLayer?.url ||
            generating ||
            prompts.every((p) => p.trim() === "")
          }
          className="w-full mt-4"
          onClick={async () => {
            setGenerating(true)
            // Call the extractImage function from the store
            await extractImage(
              activeLayer.url,
              prompts.filter((p) => p.trim() !== ""),
              multiple,
              mode,
              invert,
              activeLayer.format
            )

            // Handle response
            const res = useEditorStore.getState().activeLayer; // Assuming extractImage updates activeLayer directly

            if (res?.url) {
              const newLayerId = crypto.randomUUID()
              addLayer({
                id: newLayerId,
                name: "extracted-" + activeLayer.name,
                format: ".png",
                height: activeLayer.height,
                width: activeLayer.width,
                url: res.url,
                publicId: activeLayer.publicId,
                resourceType: "image",
              })
              setGenerating(false)
              setActiveLayer(newLayerId)
            } else {
              setGenerating(false)
              toast.error("Failed to extract image")
            }
          }}
        >
          {generating ? "Extracting..." : "Extract"}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
