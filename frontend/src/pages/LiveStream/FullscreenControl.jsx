import { Maximize, Minimize } from "lucide-react";

const FullscreenControl = ({ isFullscreen, onToggle }) => {
  const Icon = isFullscreen ? Minimize : Maximize;

  const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onToggle}
        className="text-white p-1.5 hover:bg-white/10 rounded-lg"
        aria-label={label} // Adding aria-label for accessibility
      >
        <Icon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default FullscreenControl;
