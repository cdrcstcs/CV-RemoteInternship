import { useState } from "react";
import { VerifiedMark } from "./VerifiedMark";
import { BioModal } from "./BioModal";

export const AboutCard = ({
  hostName,
  hostIdentity,
  viewerIdentity,
  headline,
  about,
  followedByCount,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility state
  
  const hostAsViewer = `Host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;

  const followedByLabel = followedByCount === 1 ? "follower" : "followers";

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal when cancel is clicked
  };

  return (
    <div className="px-4">
      <div className="group rounded-xl p-6 lg:p-10 flex flex-col gap-y-3  bg-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 font-semibold text-lg lg:text-2xl text-emerald-400">
            About {hostName}
            <VerifiedMark className="text-emerald-400" /> {/* Make icon emerald-400 */}
          </div>
          {/* Show the BioModal if it's the host and modal is open */}
          {isHost && (
            <button
              onClick={() => setIsModalOpen(true)} // Open the modal when the user clicks edit
              className="text-sm text-emerald-400 hover:underline border-2 border-white px-2 py-1 rounded-md"
            >
              Edit Profile
            </button>
          )}
        </div>
        <div className="text-sm text-emerald-400">
          <span className="font-semibold">{followedByCount}</span> {followedByLabel}
        </div>
        <p className="text-sm text-emerald-400">{about || "This user has not set a bio yet."}</p>
      </div>

      {/* Conditionally render BioModal when isModalOpen is true */}
      {isModalOpen && (
        <BioModal
          initialHeadline={headline}
          initialAbout={about}
          onClose={handleModalClose} // Pass the close function to BioModal
        />
      )}
    </div>
  );
};
