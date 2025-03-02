import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../pages/State/Redux"; // Use Redux hooks
import { setIsSidebarCollapsed } from "../../pages/State/State"; // Import the action

export const ChatToggle = () => {
  const dispatch = useAppDispatch(); // Get dispatch method from Redux
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  ); // Get the current sidebar state from Redux

  const Icon = isSidebarCollapsed ? ArrowLeftFromLine : ArrowRightFromLine;

  const onToggle = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed)); // Dispatch action to toggle the sidebar state
  };

  const label = isSidebarCollapsed ? "Expand" : "Collapse"; // Tooltip label based on the sidebar state

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
