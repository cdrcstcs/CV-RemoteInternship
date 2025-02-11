import { Link } from "react-router-dom"; // Updated to react-router-dom
import {
    ArrowLeftIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import GroupDescriptionPopover from "./GroupDescriptionPopover";
import GroupUsersPopover from "./GroupUsersPopover";
import { useEventBus } from "../../EventBus";
import { useUserStore } from "../../stores/useUserStore";
import useChatStore from "../../stores/useChatStore"; // Import useChatStore

const ConversationHeader = ({ selectedConversation }) => {
    const { user } = useUserStore();
    const { emit } = useEventBus();
    const { deleteGroup } = useChatStore(); // Get the deleteGroup function from the store

    const onDeleteGroup = () => {
        if (!window.confirm("Are you sure you want to delete this group?")) {
            return;
        }

        // Use deleteGroup from the store instead of making an API call directly
        deleteGroup(selectedConversation.id);
    };

    return (
        <>
            {selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/" // Changed to 'to' for react-router-dom
                            className="inline-block sm:hidden"
                        >
                            <ArrowLeftIcon className="w-6" />
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_group && <GroupAvatar />}
                        <div>
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className="text-xs text-gray-500">
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                    {selectedConversation.is_group && (
                        <div className="flex gap-3">
                            <GroupDescriptionPopover
                                description={selectedConversation.description}
                            />
                            <GroupUsersPopover
                                users={selectedConversation.users}
                            />
                            {selectedConversation.owner_id == user.id && (
                                <>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Edit Group"
                                    >
                                        <button
                                            onClick={(ev) =>
                                                emit(
                                                    "GroupModal.show",
                                                    selectedConversation
                                                )
                                            }
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <PencilSquareIcon className="w-4" />
                                        </button>
                                    </div>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Delete Group"
                                    >
                                        <button
                                            onClick={onDeleteGroup}
                                            className="text-gray-400 hover:text-gray-200"
                                        >
                                            <TrashIcon className="w-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ConversationHeader;
