import { MessageSquare, Users } from "lucide-react";
import Hint from "./Hint";
import { useChatSidebarStore } from "../../stores/useChatSideBarStore";

export const VariantToggle = () => {
  const { ChatVariant, variant, onChangeVariant } = useChatSidebarStore();
  const isChat = variant === ChatVariant.CHAT;

  const Icon = isChat ? Users : MessageSquare;

  const onToggle = () => {
    const newVariant = isChat ? ChatVariant.COMMUNITY : ChatVariant.CHAT;
    onChangeVariant(newVariant);
  };

  const label = isChat ? "Community" : "Go back to chat";

  return (
    <Hint label={label} side="left" asChild>
      <button
        onClick={onToggle}
        className="h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent border-none cursor-pointer"
      >
        <Icon className="h-4 w-4" />
      </button>
    </Hint>
  );
};
