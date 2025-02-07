import useSocialMediaStore from "../../stores/useSocialMediaStore";

const FriendRequest = ({ request }) => {
  const { acceptConnectionRequest, rejectConnectionRequest } = useSocialMediaStore();

  const handleAccept = () => {
    acceptConnectionRequest(request.id);
  };

  const handleReject = () => {
    rejectConnectionRequest(request.id);
  };

  return (
    <div className="border-2 border-white rounded-lg p-4 flex items-center justify-between transition-all hover:shadow-md text-emerald-400">
      <div className="flex items-center gap-4">
        <div>
          <div className="font-semibold text-lg">
            {`${request.sender.first_name} ${request.sender.last_name}`}
          </div>
          <p className="text-emerald-400">{request.sender.headline}</p>
        </div>
      </div>

      <div className="space-x-2">
        <button
          className="border-2 border-white text-emerald-400 px-4 py-2 rounded-md hover:bg-emerald-400 hover:text-white transition-colors"
          onClick={handleAccept}
        >
          Accept
        </button>
        <button
          className="border-2 border-white text-emerald-400 px-4 py-2 rounded-md hover:bg-emerald-400 hover:text-white transition-colors"
          onClick={handleReject}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
