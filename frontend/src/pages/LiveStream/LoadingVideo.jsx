import { Loader } from "lucide-react";

const LoadingVideo = ({ label }) => {
  return (
    <div className="h-full flex flex-col space-y-4 justify-center items-center bg-transparent border-2 border-white">
      <Loader className="h-10 w-10 text-emerald-400 animate-spin" />
      <p className="text-emerald-400 capitalize">{label}</p>
    </div>
  );
};

export default LoadingVideo;
