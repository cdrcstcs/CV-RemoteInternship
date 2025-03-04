import { useState } from "react";
import CopyButton from "./CopyButton";
const KeyCard = ({ value }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-start gap-x-10">
        <p className="font-semibold shrink-0">Stream Key</p>
        <div className="space-y-2 w-full">
          <div className="w-full flex items-center gap-x-2">
            <input
              value={value || ""}
              type={show ? "text" : "password"}
              disabled
              placeholder="Stream key"
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300"
            />
            <CopyButton value={value || ""} />
          </div>
          <button
            onClick={() => setShow(!show)}
            className="text-sm text-blue-500 hover:text-blue-700 mt-2"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyCard;
