import ConversationItem from './ConversationItem';
import GroupModal from './GroupModal';
import { useEventBus } from '../../EventBus';
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import useChatStore from '../../stores/useChatStore';
import { useUserStore } from '../../stores/useUserStore';
import ChatMain from './ChatMain';
const ChatWrapper = () => {
    const { selectedConversation, setSelectedConversation, fetchConversations, conversations, isLoading } = useChatStore();
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const { emit, on } = useEventBus();
    const { user } = useUserStore();

    useEffect(() => {
        fetchConversations(); // Fetch conversations on component mount
    }, [fetchConversations]);

    useEffect(() => {
        if (isLoading) return;
        console.log("Conversations updated:", conversations);
    }, [conversations]);

    useEffect(() => {
        if (!conversations || !user || isLoading) return;

        console.log(conversations);
        // Convert object to array if necessary
        Object.values(conversations).forEach((conversation) => {
            let channel = `message.group.${conversation.id}`;

            if (conversation.is_user) {
                channel = `message.user.${[parseInt(user.id), parseInt(conversation.id)]
                    .sort((a, b) => a - b)
                    .join("-")}`;
            }

            Echo.private(channel)
                .error((error) => {
                    console.error(`Error subscribing to ${channel}:`, error);
                })
                .listen("SocketMessage", (e) => {
                    const message = e.message;

                    emit("message.created", message);

                    if (message.sender_id === user.id) {
                        return;
                    }

                    emit("newMessageNotification", {
                        user: message.sender,
                        group_id: message.group_id,
                        message: message.message ||
                            `Shared ${message.attachments.length === 1
                                ? "an attachment"
                                : `${message.attachments.length} attachments`}`,
                    });
                });

            if (conversation.is_group) {
                Echo.private(`group.deleted.${conversation.id}`)
                    .listen("GroupDeleted", (e) => {
                        emit("group.deleted", { id: e.id, name: e.name });
                    })
                    .error((e) => {
                        console.error(`Error subscribing to group.deleted.${conversation.id}:`, e);
                    });
            }
        });

        return () => {
            Object.values(conversations).forEach((conversation) => {
                let channel = `message.group.${conversation.id}`;

                if (conversation.is_user) {
                    channel = `message.user.${[parseInt(user.id), parseInt(conversation.id)]
                        .sort((a, b) => a - b)
                        .join("-")}`;
                }

                Echo.leave(channel);

                if (conversation.is_group) {
                    Echo.leave(`group.deleted.${conversation.id}`);
                }
            });
        };
    }, [conversations, user, emit]);

    const handleConversationSelect = (conversation) => {
        setSelectedConversation(conversation);
    };

    const isUserOnline = (userId) => onlineUsers[userId];

    const onSearch = (ev) => {
        const search = ev.target.value.toLowerCase();
        setLocalConversations(
            Object.values(conversations).filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            })
        );
    };

    const messageCreated = (message) => {
        setLocalConversations((oldConversations) => {
            return oldConversations.map((u) => {
                if (
                    message.receiver_id &&
                    !u.is_group &&
                    (u.id == message.sender_id || u.id == message.receiver_id)
                ) {
                    u.last_message = message.message;
                    u.last_message_date = message.created_at;
                    return u;
                }
                if (
                    message.group_id &&
                    u.is_group &&
                    u.id == message.group_id
                ) {
                    u.last_message = message.message;
                    u.last_message_date = message.created_at;
                    return u;
                }
                return u;
            });
        });
    };

    const messageDeleted = ({ prevMessage }) => {
        if (!prevMessage) return;

        messageCreated(prevMessage);
    };

    useEffect(() => {
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        const offModalShow = on("GroupModal.show", () => setShowGroupModal(true));
        const offGroupDelete = on("group.deleted", ({ id, name }) => {
            setLocalConversations((oldConversations) => oldConversations.filter((con) => con.id !== id));
            emit("toast.show", `Group "${name}" was deleted`);
        });

        return () => {
            offCreated();
            offDeleted();
            offModalShow();
            offGroupDelete();
        };
    }, [on]);

    useEffect(() => {
        setSortedConversations(
            [...localConversations].sort((a, b) => {
                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(a.last_message_date);
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                }
                return 0;
            })
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(Object.values(conversations));
    }, [conversations]);

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );
                setOnlineUsers((prevOnlineUsers) => ({ ...prevOnlineUsers, ...onlineUsersObj }));
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => ({ ...prevOnlineUsers, [user.id]: user }));
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            })
            .error((error) => {
                console.error("error", error);
            });

        return () => {
            Echo.leave("online");
        };
    }, []);

    return (
        <>
            <div className="flex-1 w-full flex overflow-hidden h-screen">
                <div className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden ${
                    selectedConversation ? "-ml-[100%] sm:ml-0" : ""}`}>
                    <div className="flex items-center justify-between py-2 px-3 text-xl font-medium text-gray-200">
                        My Conversations
                        <div className="tooltip tooltip-left" data-tip="Create new Group">
                            <button onClick={() => setShowGroupModal(true)} className="text-gray-400 hover:text-gray-200">
                                <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <input
                            onKeyUp={onSearch}
                            placeholder="Filter users and groups"
                            className="w-full p-2 text-gray-700 rounded-md"
                        />
                    </div>
                    <div className="flex-1 overflow-auto">
                        {sortedConversations && sortedConversations.map((conversation) => (
                            <ConversationItem
                                key={`${
                                    conversation.is_group ? "group_" : "user_"
                                }${conversation.id}`}
                                conversation={conversation}
                                online={!!isUserOnline(conversation.id)}
                                selectedConversation={selectedConversation}
                                setSelectedConversation={handleConversationSelect}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    <ChatMain selectedConversation={selectedConversation} isUser={selectedConversation?.is_user}/>
                </div>
            </div>
            <GroupModal show={showGroupModal} onClose={() => setShowGroupModal(false)} />
        </>
    );
};

export default ChatWrapper;
