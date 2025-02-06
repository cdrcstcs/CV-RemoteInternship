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
    <div className='bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md'>
      <div className='flex items-center gap-4'>
        <div>
          <div className='font-semibold text-lg'>
            {`${request.sender.first_name} ${request.sender.last_name}`}
          </div>
          <p className='text-gray-600'>{request.sender.headline}</p>
        </div>
      </div>

      <div className='space-x-2'>
        <button
          className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors'
          onClick={handleAccept}
        >
          Accept
        </button>
        <button
          className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors'
          onClick={handleReject}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
