import { Maximize, Minimize } from "lucide-react";

const FullscreenControl = ({ isFullscreen, onToggle }) => {
  const Icon = isFullscreen ? Minimize : Maximize;

  const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onToggle}
        className="text-emerald-400 p-1.5 border-2 border-white rounded-lg bg-transparent hover:bg-white/10"
        aria-label={label} // Adding aria-label for accessibility
      >
        <Icon className="h-5 w-5 text-emerald-400" />
      </button>
    </div>
  );
};

export default FullscreenControl;
