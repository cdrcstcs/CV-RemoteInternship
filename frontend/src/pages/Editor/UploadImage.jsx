import useImageStore from "../../stores/useImageStore"
import { useDropzone } from "react-dropzone"
import Lottie from "lottie-react"
import { Card, CardContent } from "../../components/Editor/Card"
import { cn } from "../../lib/utils"
import useLayerStore from "../../stores/useLayerStore"
import imageAnimation from "../../../src/animations/image-upload.json"
import { toast } from "sonner"
import { useEditorStore } from "../../stores/useEditorStore"

export default function UploadImage() {
  const setTags = useImageStore((state) => state.setTags)
  const setGenerating = useImageStore((state) => state.setGenerating)
  const generating = useImageStore((state) => state.generating)

  const activeLayer = useLayerStore((state) => state.activeLayer)
  const { activeLayer: resLayer } = useEditorStore((state) => ({ activeLayer: state.activeLayer }));
  const updateLayer = useLayerStore((state) => state.updateLayer)
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer)
  const { uploadImage } = useEditorStore((state) => ({
    uploadImage: state.uploadImage, // Get the uploadImage function from Zustand store
  }))
  const { uploadImageError } = useEditorStore((state) => ({
    uploadImage: state.uploadImageError, // Get the uploadImage function from Zustand store
  }))


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/webp": [".webp"],
      "image/jpeg": ["jpeg"],
    },
    onDrop: async (acceptedFiles, fileRejections) => {
      if (acceptedFiles.length) {

        // Generate Object URL
        const objectUrl = acceptedFiles[0]
        setGenerating(true)

        // Update the layer with temporary uploading state
        updateLayer({
          id: activeLayer.id,
          url: objectUrl,
          width: 0,
          height: 0,
          name: "uploading",
          publicId: "",
          format: "",
          resourceType: "image",
        })
        setActiveLayer(activeLayer.id)

        // Upload image using the Zustand store function
        await uploadImage(acceptedFiles[0])
        if (!uploadImageError && !generating) {
          // Update the layer after successful upload
          updateLayer({
            id: activeLayer.id,
            url: resLayer.url,
            width: resLayer.width,
            height: resLayer.height,
            name: resLayer.original_filename,
            publicId: resLayer.public_id,
            format: resLayer.format,
            resourceType: resLayer.resource_type,
          })
          console.log(resLayer);
          // Set tags from the upload response
          setTags(resLayer.tags)

          // Set active layer and stop generating state
          setActiveLayer(activeLayer.id)
          setGenerating(false)
        } else {
          setGenerating(false)
          toast.error(uploadImageError)
        }
      }

      if (fileRejections.length) {
        console.log("rejected")
        toast.error(fileRejections[0].errors[0].message)
      }
    },
  })

  if (!resLayer.url)
    return (
      <Card
        {...getRootProps()}
        className={cn(
          "hover:cursor-pointer hover:bg-secondary hover:border-primary transition-all ease-in-out",
          `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`
        )}
      >
        <CardContent className="flex flex-col h-full items-center justify-center px-2 py-24 text-xs">
          <input {...getInputProps()} />
          <div className="flex items-center flex-col justify-center gap-4">
            <Lottie className="h-48" animationData={imageAnimation} />
            <p className="text-muted-foreground text-2xl">
              {isDragActive
                ? "Drop your image here!"
                : "Start by uploading an image"}
            </p>
            <p className="text-muted-foreground">
              Supported Formats .jpeg .jpg .png .webp
            </p>
          </div>
        </CardContent>
      </Card>
    )
}
