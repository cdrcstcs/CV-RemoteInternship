import React, { useState } from "react"
import { useEditorStore } from "../../stores/useEditorStore"
import { Button } from "../../components/Editor/Button"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/Editor/Popover"
import { Crop, Square } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/Editor/Card"
import TikTok from "./Tiktok"
import Youtube from "./Youtube"
import { cn } from "../../lib/utils"

export default function SmartCrop() {
  const {
    activeLayer,
    addLayer,
    croppingVideoGenerating,
    setActiveLayer,
    cropVideo,
    cropVideoError,
  } = useEditorStore((state) => ({
    activeLayer: state.activeLayer,
    addLayer: state.addLayer,
    croppingVideoGenerating: state.croppingVideoGenerating,
    setActiveLayer: state.setActiveLayer,
    cropVideo: state.cropVideo,
    cropVideoError: state.cropVideoError,
  }));
  

  const [aspectRatio, setAspectRatio] = useState("16:9")
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  // Replaced the genCrop function with cropVideo from useEditorStore
  const handleGenCrop = async () => {
    try {
      await cropVideo(activeLayer.url, aspectRatio, height)

      if (!cropVideoError && !croppingVideoGenerating) {
        const newLayerId = crypto.randomUUID()
        const thumbnailUrl = res.data.success.replace(/\.[^/.]+$/, ".jpg")
        addLayer({
          id: newLayerId,
          name: "cropped " + activeLayer.name,
          format: activeLayer.format,
          height: height + activeLayer.height,
          width: width + activeLayer.width,
          url: res.data.success,
          publicId: activeLayer.publicId,
          resourceType: "video",
          poster: thumbnailUrl,
        })
        toast.success("Video cropped successfully!")
        setActiveLayer(newLayerId)
      }
      else {
        toast.error("Failed to crop video")
      }
    } catch (e) {
      toast.error(cropVideoError)
      console.error("Error:", e)
    } 
  }

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer?.url} asChild>
        <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center flex-col text-xs font-medium">
            Smart Crop
            <Crop size={18} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="flex flex-col h-full">
          <div className="space-y-2 pb-4">
            <h3 className="font-medium text-center py-2 leading-none">
              Smart Recrop
            </h3>
          </div>
          <h4 className="text-md font-medium pb-2">Format</h4>
          <div className={"flex gap-4 items-center justify-center pb-2"}>
            <Card
              className={cn(
                aspectRatio === "16:9" ? " border-primary" : "",
                "p-4 w-36 cursor-pointer"
              )}
              onClick={() => setAspectRatio("16:9")}
            >
              <CardHeader className="text-center p-0">
                <CardTitle className="text-md">Youtube</CardTitle>
                <CardDescription>
                  <p className="text-sm font-bold">16:9</p>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 pt-2">
                <Youtube />
              </CardContent>
            </Card>
            <Card
              className={cn(
                aspectRatio === "9:16" ? " border-primary" : "",
                "p-4 w-36 cursor-pointer"
              )}
              onClick={() => setAspectRatio("9:16")}
            >
              <CardHeader className="p-0 text-center">
                <CardTitle className="text-md">Tiktok</CardTitle>
                <CardDescription>
                  <p className="text-sm font-bold">9:16</p>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 pt-2">
                <TikTok />
              </CardContent>
            </Card>
            <Card
              className={cn(
                aspectRatio === "1:1" ? " border-primary" : "",
                "p-4 w-36 cursor-pointer"
              )}
              onClick={() => setAspectRatio("1:1")}
            >
              <CardHeader className="p-0 text-center">
                <CardTitle className="text-md">Square</CardTitle>
                <CardDescription>
                  <p className="text-sm font-bold">1:1</p>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-0 pt-2">
                <Square className="w-10 h-10" />
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={handleGenCrop}
            className="w-full mt-4"
            variant={"outline"}
            disabled={!activeLayer.url || croppingVideoGenerating}
          >
            {croppingVideoGenerating ? "Cropping..." : "Smart Crop 🎨"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
