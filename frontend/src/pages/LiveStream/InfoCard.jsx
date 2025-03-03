import { Pencil } from "lucide-react";
import InfoModal from "./InfoModal";

const InfoCard = ({ name, thumbnailUrl, hostIdentity, viewerIdentity }) => {
  const hostAsViewer = `Host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;

  if (!isHost) return null;

  return (
    <div className="px-4">
      <div className="rounded-xl bg-transparent border-2 border-white">
        <div className="flex items-center gap-x-2.5 p-4">
          <div className="rounded-md bg-transparent p-2 h-auto w-auto border-2 border-white">
            <Pencil className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm lg:text-lg font-semibold text-emerald-400 capitalize">
              Edit your stream info
            </h2>
            <p className="text-emerald-400 text-xs lg:text-sm">
              Maximize your visibility
            </p>
          </div>
          <InfoModal initialName={name} initialThumbnailUrl={thumbnailUrl} />
        </div>

        {/* Replaced Separator with a simple horizontal line */}
        <div className="border-t-2 border-white my-4"></div>

        <div className="p-4 lg:p-6 space-y-4">
          <div>
            <h3 className="text-sm text-emerald-400 mb-2">Name</h3>
            <p className="text-sm font-semibold text-emerald-400">{name}</p>
          </div>
          <div>
            <h3 className="text-sm text-emerald-400 mb-2">Thumbnail</h3>
            {thumbnailUrl && (
              <div className="relative aspect-video rounded-md overflow-hidden w-[200px] border-2 border-white">
                <img
                  src={thumbnailUrl}
                  alt={name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
