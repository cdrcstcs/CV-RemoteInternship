import { useState, useTransition, useRef } from "react";
import { Trash } from "lucide-react";
import Hint from "./Hint";
import useLiveStreamStore from "../../stores/useLiveStreamStore";

const InfoModal = ({ initialName, initialThumbnailUrl }) => {
  const closeRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  // Access stream state from the store
  const { streamData, isProcessingStream, isErrorStream, errorMessageStream, updateStream } = useLiveStreamStore();

  const [name, setName] = useState(initialName);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);
  const [newThumbnail, setNewThumbnail] = useState(null); // State for new thumbnail file

  const onRemove = () => {
    startTransition(() => {
      updateStream({ thumbnail: null });
      closeRef?.current?.click();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    startTransition(() => {
      updateStream({ title: name });
      closeRef?.current?.click();
    });
  };

  const onChange = (e) => {
    setName(e.target.value);
  };

  const onThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewThumbnail(URL.createObjectURL(file)); // Preview the image locally before upload
    }
  };

  const onUploadThumbnail = () => {
    if (newThumbnail) {
      // Assuming you have an API endpoint to upload the thumbnail
      startTransition(() => {
        updateStream({ thumbnail: newThumbnail });
        closeRef?.current?.click();
      });
    }
  };

  // If there is an error, show it
  const renderError = () => {
    if (isErrorStream) {
      return (
        <div className="text-red-500 mt-4">
          <strong>Error:</strong> {errorMessageStream}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dialog bg-transparent">
      <button
        type="button"
        className="link-button text-emerald-400"
        onClick={() => {}}
      >
        Edit
      </button>
      <div className="dialog-content bg-transparent border-2 border-white">
        <div className="dialog-header">
          <h2 className="text-emerald-400">Edit stream info</h2>
        </div>
        <form onSubmit={onSubmit} className="space-y-14">
          <div className="space-y-2">
            <label htmlFor="name" className="text-emerald-400">Name</label>
            <input
              id="name"
              disabled={isProcessingStream || isPending} // Disable input if processing or transition is pending
              placeholder="Stream name"
              onChange={onChange}
              value={name}
              className="input text-emerald-400 border-2 border-white"
            />
          </div>

          {/* Display current stream name from streamData */}
          {streamData && streamData.title && !name && (
            <div className="text-sm text-gray-500">
              Current Name: {streamData.title}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-emerald-400">Thumbnail</label>
            <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-white">
              <div className="absolute top-2 right-2 z-[10]">
                <Hint label="Remove thumbnail" asChild side="left">
                  <button
                    type="button"
                    disabled={isProcessingStream || isPending} // Disable button if processing or transition is pending
                    onClick={onRemove}
                    className="button-remove-thumbnail text-emerald-400"
                  >
                    <Trash className="h-4 w-4 text-emerald-400" />
                  </button>
                </Hint>
              </div>
              <img
                alt="Thumbnail"
                src={thumbnailUrl}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* File upload input for a new thumbnail */}
          <div className="space-y-2">
            <label htmlFor="thumbnail" className="text-emerald-400">Upload New Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              disabled={isProcessingStream || isPending} // Disable input if processing or transition is pending
              onChange={onThumbnailChange}
              id="thumbnail"
              className="input-file text-emerald-400 border-2 border-white"
            />
            {newThumbnail && (
              <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-white mt-2">
                <img
                  alt="New Thumbnail Preview"
                  src={newThumbnail}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button ref={closeRef} type="button" className="ghost-button text-emerald-400">
              Cancel
            </button>
            <button
              disabled={isProcessingStream || isPending || !newThumbnail} // Disable if processing, pending, or no new thumbnail
              type="button"
              onClick={onUploadThumbnail}
              className="primary-button text-emerald-400 border-2 border-white"
            >
              {isPending ? "Uploading..." : "Upload Thumbnail"} {/* Show uploading state */}
            </button>
            <button disabled={isProcessingStream || isPending} type="submit" className="primary-button text-emerald-400 border-2 border-white">
              {isPending ? "Saving..." : "Save"} {/* Show saving state */}
            </button>
          </div>
        </form>

        {/* Display error message if exists */}
        {renderError()}
      </div>
    </div>
  );
};

export default InfoModal;
