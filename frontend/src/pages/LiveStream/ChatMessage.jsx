import moment from "moment";
import { stringToColor } from "../../helpers";

export const ChatMessage = ({ data }) => {
  const color = stringToColor(data.from?.name || "");

  return (
    <div className="flex gap-2 p-2 rounded-md hover:bg-transparent border-2 border-white">
      {/* Time */}
      <p className="text-sm text-emerald-400">
        {moment(data.timestamp).format("HH:mm")}
      </p>

      <div className="flex flex-wrap items-baseline gap-1 grow">
        {/* Sender's Name */}
        <p className="text-sm font-semibold whitespace-nowrap">
          <span className="truncate" style={{ color: color }}>
            {data.from?.name}
          </span>
          :
        </p>

        {/* Message Text */}
        <p className="text-sm break-all text-emerald-400">{data.message}</p>
      </div>
    </div>
  );
};
