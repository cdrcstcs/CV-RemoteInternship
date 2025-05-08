import useEditorStore from "../../stores/useEditorStore"
import { useDropzone } from "react-dropzone"
import Lottie from "lottie-react"
import { Card, CardContent } from "../../components/Editor/Card"
import { cn } from "../../lib/utils"
import useEditorStore from "../../stores/useEditorStore"
import videoAnimation from "../../../src/animations/video-upload.json"
import { toast } from "sonner"
import { useEditorStore } from "../../stores/useEditorStore"

export default function UploadVideo() {
  const {
    setTags,
    setGenerating,
    activeLayer,
    updateLayer,
    setActiveLayer,
    uploadVideo,
  } = useEditorStore((state) => ({
    setTags: state.setTags,
    setGenerating: state.setGenerating,
    activeLayer: state.activeLayer,
    updateLayer: state.updateLayer,
    setActiveLayer: state.setActiveLayer,
    uploadVideo: state.uploadVideo,
  }));
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "video/mp4": [".mp4", ".MP4"],
    },

    onDrop: async (acceptedFiles, fileRejections) => {
      if (acceptedFiles.length) {
        const formData = new FormData()
        formData.append("video", acceptedFiles[0])
        const objectUrl = URL.createObjectURL(acceptedFiles[0])
        setGenerating(true)

        // Use the uploadVideo function from Zustand store
        const res = await uploadVideo({ video: formData })

        if (res?.data?.success) {
          const videoUrl = res.data.success.url
          const thumbnailUrl = videoUrl.replace(/\.[^/.]+$/, ".jpg")
          console.log(res.data.success)

          // Update the layer with the uploaded video data
          updateLayer({
            id: activeLayer.id,
            url: res.data.success.url,
            width: res.data.success.width,
            height: res.data.success.height,
            name: res.data.success.original_filename,
            publicId: res.data.success.public_id,
            format: res.data.success.format,
            poster: thumbnailUrl,
            resourceType: res.data.success.resource_type,
          })

          // Set the tags for the video
          setTags(res.data.success.tags)
          setActiveLayer(activeLayer.id)
          setGenerating(false)
        }

        // Handle error
        if (res?.data?.error) {
          setGenerating(false)
          toast.error(res.data.error)
        }
      }

      if (fileRejections.length) {
        console.log("rejected")
        toast.error(fileRejections[0].errors[0].message)
      }
    },
  })

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
          <Lottie className="h-48" animationData={videoAnimation} />
          <p className="text-muted-foreground text-2xl">
            {isDragActive
              ? "Drop your video here!"
              : "Start by uploading a video"}
          </p>
          <p className="text-muted-foreground">Supported Format: .mp4</p>
        </div>
      </CardContent>
    </Card>
  )
}
