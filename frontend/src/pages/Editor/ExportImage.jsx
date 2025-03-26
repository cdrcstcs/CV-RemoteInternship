import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function ExportAsset({ resource }) {
  const [selected, setSelected] = useState("original");
  
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `/api/download?resource_type=yourResourceType&format=yourFormat&url=yourUrl&quality=${selected}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch image URL");
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const imageResponse = await fetch(data.url);
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch image");
      }
      const imageBlob = await imageResponse.blob();

      const downloadUrl = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger disabled={!resource} asChild>
        <Button variant="outline" className="py-8">
          <span className="flex gap-1 items-center justify-center flex-col text-xs font-medium">
            Export
            <Download size={18} />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div>
          <h3 className="text-center text-2xl font-medium pb-4">Export</h3>
          <div className="flex flex-col gap-4">
            <Card
              onClick={() => setSelected("original")}
              className={selected === "original" ? "border-primary" : null}
            >
              <CardContent className="p-0">
                <CardTitle className="text-md">Original</CardTitle>
                <CardDescription>Original resolution</CardDescription>
              </CardContent>
            </Card>
            <Card
              onClick={() => setSelected("large")}
              className={selected === "large" ? "border-primary" : null}
            >
              <CardContent className="p-0">
                <CardTitle className="text-md">Large</CardTitle>
                <CardDescription>Large resolution</CardDescription>
              </CardContent>
            </Card>
            <Card
              onClick={() => setSelected("medium")}
              className={selected === "medium" ? "border-primary" : null}
            >
              <CardContent className="p-0">
                <CardTitle className="text-md">Medium</CardTitle>
                <CardDescription>Medium resolution</CardDescription>
              </CardContent>
            </Card>
            <Card
              className={selected === "small" ? "border-primary" : null}
              onClick={() => setSelected("small")}
            >
              <CardContent className="p-0">
                <CardTitle className="text-md">Small</CardTitle>
                <CardDescription>Small resolution</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
        <Button onClick={handleDownload}>
          Download {selected} {resource}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
