import { useState } from "react";
import { CheckCheck, Copy } from "lucide-react";
import { toast } from "react-hot-toast";

const CopyButton = ({ value }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    if (!value) return;

    setIsCopied(true);
    navigator.clipboard.writeText(value);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    toast.success("Copied");
  };

  const Icon = isCopied ? CheckCheck : Copy;

  return (
    <button
      onClick={onCopy}
      disabled={!value || isCopied}
      className="flex items-center justify-center p-2 bg-transparent border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

export default CopyButton;
