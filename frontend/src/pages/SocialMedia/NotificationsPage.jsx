import { useEffect } from "react";
import { ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import useSocialMediaStore from "../../stores/useSocialMediaStore";
const NotificationsPage = () => {
  const { notifications, isLoadingNotifications, fetchNotifications, markAsRead, deleteNotification } = useSocialMediaStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="text-blue-500" />;
      case "comment":
        return <MessageSquare className="text-green-500" />;
      case "connectionAccepted":
        return <UserPlus className="text-purple-500" />;
      default:
        return null;
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span>
            <strong>{notification.related_user.first_name+ " "+ notification.related_user.last_name}</strong> liked your post
          </span>
        );
      case "comment":
        return (
          <span>
            {notification.related_user.first_name+ " "+ notification.related_user.last_name} commented on your post
          </span>
        );
      case "connectionAccepted":
        return (
          <span>
              {notification.related_user.first_name+ " "+ notification.related_user.last_name} accepted your connection request
          </span>
        );
      default:
        return null;
    }
  };

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null;

    return (
      <>
        {relatedPost.image && (
          <img src={relatedPost.image} alt="Post preview" className="w-10 h-10 object-cover rounded" />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-600 truncate">{relatedPost.content}</p>
        </div>
        <ExternalLink size={14} className="text-gray-400" />
	  </>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>

          {isLoadingNotifications ? (
            <p>Loading notifications...</p>
          ) : notifications && notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
                    !notification.read ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                          src={notification.related_user.profilePicture || "/avatar.png"}
                          className="w-12 h-12 rounded-full object-cover"
                        />

                      <div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-gray-100 rounded-full">
                            {renderNotificationIcon(notification.type)}
                          </div>
                          <p className="text-sm">{renderNotificationContent(notification)}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                        {renderRelatedPost(notification.relatedPost)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          aria-label="Mark as read"
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
