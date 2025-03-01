import { Volume1, Volume2, VolumeX } from "lucide-react";
import Hint from "./Hint";

export const VolumeControl = ({ onToggle, onChange, value }) => {
  const isMuted = value === 0;
  const isAboveHalf = value > 50;

  let Icon = Volume1;

  if (isMuted) {
    Icon = VolumeX;
  } else if (isAboveHalf) {
    Icon = Volume2;
  }

  const label = isMuted ? "Unmute" : "Mute";

  const handleChange = (event) => {
    onChange(+event.target.value); // `+` is used to convert the value to a number
  };

  return (
    <div className="flex items-center gap-2">
      <Hint label={label} asChild>
        <button
          onClick={onToggle}
          className="text-white hover:bg-white/10 p-1.5 rounded-lg"
        >
          <Icon className="h-6 w-6" />
        </button>
      </Hint>

      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={value}
        onChange={handleChange}
        className="w-[8rem] cursor-pointer appearance-none bg-gray-400 rounded-full h-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
