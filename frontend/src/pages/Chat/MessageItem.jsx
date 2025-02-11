import ReactMarkdown from "react-markdown";
import React from "react";
import UserAvatar from "./UserAvatar";
import { formatMessageDateLong } from "../../helpers";
import MessageAttachments from "./MessageAttachments";
import MessageOptionsDropdown from "./MessageOptionsDropdown";
import { useUserStore } from "../../stores/useUserStore";

const MessageItem = ({ message, attachmentClick }) => {
  const { user } = useUserStore();

  return (
    <div
      className={`flex ${message.sender_id === user.id ? "justify-end" : "justify-start"} my-2`}
    >
      {/* User Avatar */}
      <div className="flex-shrink-0">
        <UserAvatar user={message.sender} />
      </div>

      {/* Chat Content */}
      <div className={`max-w-xs ${message.sender_id === user.id ? "ml-4" : "mr-4"}`}>
        {/* Chat Header */}
        <div className="flex items-center text-sm text-gray-500">
          {message.sender_id !== user.id && (
            <span>
              {message.sender.first_name} {message.sender.last_name}
            </span>
          )}
          <time className="ml-2 text-xs text-gray-400">
            {formatMessageDateLong(message.created_at)}
          </time>
        </div>

        {/* Chat Bubble */}
        <div
          className={`relative mt-1 p-3 rounded-lg ${
            message.sender_id === user.id
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {/* Message Options Dropdown for the Sender */}
          {message.sender_id === user.id && <MessageOptionsDropdown message={message} />}

          {/* Message Content */}
          <div className="prose max-w-none">
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </div>

          {/* Message Attachments */}
          <MessageAttachments
            attachments={message.attachments}
            attachmentClick={attachmentClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
