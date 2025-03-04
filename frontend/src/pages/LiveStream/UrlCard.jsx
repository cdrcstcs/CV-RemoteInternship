import CopyButton from "./CopyButton";
const UrlCard = ({ value }) => {
  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-center gap-x-10">
        <p className="font-semibold shrink-0">Server URL</p>
        <div className="space-y-2 w-full">
          <div className="w-full flex items-center gap-x-2">
            <input
              value={value || ""}
              disabled
              placeholder="Server URL"
              className="w-full p-2 bg-gray-100 text-gray-700 rounded-md border border-gray-300"
            />
            <CopyButton value={value || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlCard;
