export const ChatHeader = () => {
  return (
    <div className="relative p-3 border-b">
      <p className="font-semibold text-primary text-center">Stream Chat</p>
    </div>
  );
};

export const ChatHeaderSkeleton = () => {
  return (
    <div className="relative p-3 border-b hidden md:block">
      {/* Placeholder for the left icon */}
      <div className="absolute h-6 w-6 left-3 top-3 bg-gray-300 animate-pulse rounded-full"></div>

      {/* Placeholder for the center text */}
      <div className="w-28 h-6 mx-auto bg-gray-300 animate-pulse rounded-md"></div>

      {/* Placeholder for the right icon */}
      <div className="absolute h-6 w-6 right-3 top-3 bg-gray-300 animate-pulse rounded-full"></div>
    </div>
  );
};
