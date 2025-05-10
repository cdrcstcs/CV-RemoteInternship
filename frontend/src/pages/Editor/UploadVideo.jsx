import { useDropzone } from "react-dropzone";
import Lottie from "lottie-react";
import { Card, CardContent } from "../../components/Editor/Card";
import { cn } from "../../lib/utils";
import videoAnimation from "../../../src/animations/video-upload.json";
import { toast } from "sonner";
import { useEditorStore } from "../../stores/useEditorStore";

export default function UploadVideo() {
  const { getState } = useEditorStore;
  const state = getState();
  console.log(state.activeLayer);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: { "video/mp4": [".mp4", ".MP4"] },
    onDrop: async (acceptedFiles, fileRejections) => {
      const {
        updateLayer,
        setActiveLayer,
        uploadVideo,
        setTags,
      } = getState();

      const activeLayer = getState().activeLayer;

      if (acceptedFiles.length) {
        const objectUrl = URL.createObjectURL(acceptedFiles[0]);

        // Temporary preview update
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

        // Upload video
        await uploadVideo(acceptedFiles[0], activeLayer.id);

        const latestState = getState();
        const latestActiveLayer = latestState.activeLayer;

        if (!latestState.uploadVideoError && !latestState.uploadingVideoGenerating) {
          const thumbnailUrl = latestActiveLayer.url.replace(/\.[^/.]+$/, ".jpg");

          updateLayer({
            id: latestActiveLayer.id,
            url: latestActiveLayer.url,
            width: latestActiveLayer.width,
            height: latestActiveLayer.height,
            name: latestActiveLayer.original_filename,
            publicId: latestActiveLayer.public_id,
            format: latestActiveLayer.format,
            poster: thumbnailUrl,
            resourceType: latestActiveLayer.resource_type,
          });

          setTags(latestActiveLayer.tags);
          setActiveLayer(latestActiveLayer.id);
        } else {
          toast.error(latestState.uploadVideoError || "Upload failed");
        }
      }

      if (fileRejections.length) {
        toast.error(fileRejections[0].errors[0].message);
      }
    },
  });

  const latestActiveLayer = getState().activeLayer;

  if (!latestActiveLayer.url) {
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
              {isDragActive ? "Drop your video here!" : "Start by uploading a video"}
            </p>
            <p className="text-muted-foreground">Supported Format: .mp4</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null; // Or render something else if video already uploaded
}
