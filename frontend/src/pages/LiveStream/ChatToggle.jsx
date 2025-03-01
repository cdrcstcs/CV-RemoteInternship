import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { useChatSidebarStore } from "../../stores/useChatSideBarStore";

export const ChatToggle = () => {
  const { collapsed, onExpand, onCollapse } = useChatSidebarStore();

  const Icon = collapsed ? ArrowLeftFromLine : ArrowRightFromLine;

  const onToggle = () => {
    if (collapsed) {
      onExpand();
    } else {
      onCollapse();
    }
  };

  const label = collapsed ? "Expand" : "Collapse";

  return (
    <div
      title={label} // Tooltip for the label
      onClick={onToggle}
      className="cursor-pointer p-2 hover:bg-white/10 hover:text-primary"
    >
      <Icon className="h-4 w-4" />
    </div>
  );
};
