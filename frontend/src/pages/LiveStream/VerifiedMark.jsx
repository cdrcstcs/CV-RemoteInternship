import { Check } from "lucide-react";

export const VerifiedMark = () => {
  return (
    <div className="p-0.5 flex items-center justify-center h-4 w-4 rounded-full border-2 border-white bg-transparent">
      <Check className="h-[10px] w-[10px] text-emerald-400 stroke-[4px]" />
    </div>
  );
};
