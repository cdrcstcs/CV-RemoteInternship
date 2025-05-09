import { useDropzone } from "react-dropzone";
import Lottie from "lottie-react";
import { Card, CardContent } from "../../components/Editor/Card";
import { cn } from "../../lib/utils";
import videoAnimation from "../../../src/animations/video-upload.json";
import { toast } from "sonner";
import { useEditorStore } from "../../stores/useEditorStore";

export default function UploadVideo() {
  const {
    setTags,
    uploadingVideoGenerating,
    activeLayer,
    updateLayer,
    setActiveLayer,
    uploadVideo,
    uploadVideoError,
  } = useEditorStore((state) => ({
    setTags: state.setTags,
    uploadingVideoGenerating: state.uploadingVideoGenerating,
    activeLayer: state.activeLayer,
    updateLayer: state.updateLayer,
    setActiveLayer: state.setActiveLayer,
    uploadVideo: state.uploadVideo,
    uploadVideoError: state.uploadVideoError,
  }));

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: { "video/mp4": [".mp4", ".MP4"] },
    onDrop: async (acceptedFiles, fileRejections) => {
      if (acceptedFiles.length) {
        const formData = new FormData();
        formData.append("video", acceptedFiles[0]);
        const objectUrl = URL.createObjectURL(acceptedFiles[0]);

        // Temporary layer update for preview
        updateLayer({
          id: activeLayer.id,
          url: objectUrl,
          width: 0,
          height: 0,
          name: "uploading",
          publicId: "",
          format: "",
          poster: "",
          resourceType: "video",
        });

        setActiveLayer(activeLayer.id);

        // Upload video using store function
        await uploadVideo({ video: formData });

        if (!uploadVideoError && !uploadingVideoGenerating) {
          const thumbnailUrl = activeLayer.url.replace(/\.[^/.]+$/, ".jpg");

          updateLayer({
            id: activeLayer.id,
            url: activeLayer.url,
            width: activeLayer.width,
            height: activeLayer.height,
            name: activeLayer.original_filename,
            publicId: activeLayer.public_id,
            format: activeLayer.format,
            poster: thumbnailUrl,
            resourceType: activeLayer.resource_type,
          });

          setTags(activeLayer.tags);
          setActiveLayer(activeLayer.id);
        } else {
          toast.error(uploadVideoError);
        }
      }

      if (fileRejections.length) {
        toast.error(fileRejections[0].errors[0].message);
      }
    },
  });

  if (!activeLayer.url)
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
    );

  return null; // or render something else if video already uploaded
}
