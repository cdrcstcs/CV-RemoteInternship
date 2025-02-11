import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import { formatMessageDateShort } from "../../helpers";
import { useUserStore } from "../../stores/useUserStore";

const ConversationItem = ({
  conversation,
  selectedConversation = null,
  online = null,
  setSelectedConversation,
}) => {
  const { user } = useUserStore();

  let classes = "border-transparent";

  if (selectedConversation) {
    if (
      !selectedConversation.is_group &&
      !conversation.is_group &&
      selectedConversation.id === conversation.id
    ) {
      classes = "border-blue-500 bg-black/20";
    }
    if (
      selectedConversation.is_group &&
      conversation.is_group &&
      selectedConversation.id === conversation.id
    ) {
      classes = "border-blue-500 bg-black/20";
    }
  }

  return (
    <div
      onClick={() => setSelectedConversation(conversation)} // Fixed the function call
      className={
        "conversation-item flex items-center gap-2 p-2 text-gray-300 transition-all cursor-pointer border-l-4 hover:bg-black/30 " +
        classes +
        (conversation.is_user ? " pr-2" : " pr-4")
      }
    >
      {/* User Avatar or Group Avatar */}
      {conversation.is_user ? (
        <UserAvatar user={conversation} online={online} />
      ) : (
        <GroupAvatar group={conversation} />
      )}

      <div
        className="flex-1 text-xs max-w-full overflow-hidden"
      >
        <div className="flex gap-1 justify-between items-center">
          <h3 className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
            {conversation.name}
          </h3>
          {conversation.last_message_date && (
            <span className="text-nowrap">
              {formatMessageDateShort(conversation.last_message_date)}
            </span>
          )}
        </div>
        {conversation.last_message && (
          <p className="text-xs text-nowrap overflow-hidden text-ellipsis">
            {conversation.last_message}
          </p>
        )}
      </div>

    </div>
  );
};

export default ConversationItem;
