import { WifiOff } from "lucide-react";

const OfflineVideo = ({ username }) => {
  return (
    <div className="h-full flex flex-col space-y-4 justify-center items-center bg-transparent border-2 border-white">
      <WifiOff className="h-10 w-10 text-emerald-400" />
      <p className="text-emerald-400">{username} is offline</p>
    </div>
  );
};

export default OfflineVideo;
