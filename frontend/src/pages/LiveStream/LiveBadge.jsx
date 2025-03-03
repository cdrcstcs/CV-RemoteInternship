import { cn } from "../../helpers";

const LiveBadge = ({ className }) => {
  return (
    <div
      className={cn(
        "bg-transparent text-emerald-400 text-center p-0.5 px-1.5 rounded-md uppercase text-[10px] border-2 border-white font-semibold tracking-wide",
        className
      )}
    >
      Live
    </div>
  );
};

export default LiveBadge;
