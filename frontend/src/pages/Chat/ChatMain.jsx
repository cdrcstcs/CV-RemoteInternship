import { useEffect, useRef, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import useChatStore from "../../stores/useChatStore";
import ConversationHeader from "./ConversationHeader";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import AttachmentPreviewModal from "./AttachmentPreviewModal";
import { useEventBus } from "../../EventBus";
import NewMessageNotification from "./NewMessageNotification";
export default function ChatMain({ selectedConversation, isUser }) {
  const { localMessages, noMoreMessages, scrollFromBottom, fetchConversationData, loadMoreMessages, messageCreated, messageDeleted } = useChatStore();
  const { on } = useEventBus();

  const loadMoreIntersect = useRef(null);
  const messagesCtrRef = useRef(null);
  
  const [previewAttachment, setPreviewAttachment] = useState({ attachments: [], ind: 0 });
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);

  useEffect(() => {
    if (selectedConversation) {
      fetchConversationData(selectedConversation.id, isUser); // Fetch messages when conversation is selected
    }

    const offCreated = on("message.created", messageCreated);
    const offDeleted = on("message.deleted", messageDeleted);

    return () => {
      offCreated();
      offDeleted();
    };
  }, [selectedConversation, fetchConversationData, messageCreated, messageDeleted]);

  // Use Intersection Observer to load more messages when scrolled to top
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !noMoreMessages) {
          loadMoreMessages();
        }
      },
      { threshold: 1.0 }  // Trigger when the top of the list is fully visible
    );

    if (loadMoreIntersect.current) {
      observer.observe(loadMoreIntersect.current);
    }

    return () => {
      if (loadMoreIntersect.current) {
        observer.unobserve(loadMoreIntersect.current);
      }
    };
  }, [loadMoreMessages, noMoreMessages]);

  useEffect(() => {
    // Restore the scroll position based on scrollFromBottom after messages are loaded
    if (messagesCtrRef.current && scrollFromBottom !== null) {
      messagesCtrRef.current.scrollTop =
        messagesCtrRef.current.scrollHeight -
        messagesCtrRef.current.offsetHeight -
        scrollFromBottom;
    }
  }, [localMessages, scrollFromBottom]);

  const handleAttachmentClick = (attachments, ind) => {
    setPreviewAttachment({
      attachments,
      ind,
    });
    setShowAttachmentPreview(true);
  };

  return (
    <>
      <NewMessageNotification />
      <div className="flex flex-col h-full gap-8">
        {selectedConversation ? (
          <>
            <ConversationHeader selectedConversation={selectedConversation} />
            <div ref={messagesCtrRef} className="flex-1 overflow-y-auto p-5 messages-container flex flex-col justify-between">
              {localMessages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-lg text-slate-200">No messages found</div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div ref={loadMoreIntersect}></div>
                  {localMessages.map((message) => (
                    <MessageItem
                      key={message.id}
                      message={message}
                      attachmentClick={handleAttachmentClick}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="mt-auto"> {/* This ensures that the input stays at the bottom */}
              <MessageInput conversation={selectedConversation} />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center text-center h-full opacity-35">
            <div className="text-2xl md:text-4xl p-16 text-slate-200">
              Please select a conversation to see messages
            </div>
            <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
          </div>
        )}
      </div>

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal
        attachments={previewAttachment.attachments}
        index={previewAttachment.ind}
        show={showAttachmentPreview}
        onClose={() => setShowAttachmentPreview(false)}
      />
    </>
  );
}
