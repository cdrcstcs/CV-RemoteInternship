import { useState } from "react";
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PostAction from "./PostAction";
import useSocialMediaStore from "../../stores/useSocialMediaStore";
import { useUserStore } from "../../stores/useUserStore";

const Post = ({ post }) => {

  const { user } = useUserStore();
  const { likePost, createComment, deletePost } = useSocialMediaStore();

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const isOwner = user?.id === post.author.id;
  const isLiked = post.likes.includes(user?.id);

  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePost(post.id);
  };

  const handleLikePost = () => {
    if (!isLiked) {
      likePost(post.id, user.id);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      await createComment(post.id, newComment, user);
      setNewComment("");
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            id: user.id,
            name: user.name,
            profilePicture: user.profilePicture,
          },
          created_at: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="bg-secondary rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div>
              <h3 className="font-semibold">{`${post.author.first_name} ${post.author.last_name}`}</h3>
              <p className="text-xs text-info">
                {isNaN(new Date(post.created_at).getTime())
                  ? "Error: Invalid date"
                  : formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          {isOwner && (
            <button onClick={handleDeletePost} className="text-red-500 hover:text-red-700">
              <Trash2 size={18} />
            </button>
          )}
        </div>
        <p className="mb-4">{post.content}</p>
        {post.image && <img src={post.image} alt="Post content" className="rounded-lg w-full mb-4" />}

        <div className="flex justify-between text-info">
          <PostAction
            icon={<ThumbsUp size={18} className={isLiked ? "text-blue-500  fill-blue-300" : ""} />}
            text={`Like (${post.likes.length})`}
            onClick={handleLikePost}
          />
          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment (${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction icon={<Share2 size={18} />} text="Share" />
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="mb-2 bg-base-100 p-2 rounded flex items-start">
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2">{`${comment.user.first_name} ${comment.user.last_name}`}</span>
                    <span className="text-xs text-info">
                      {isNaN(new Date(comment.created_at).getTime())
                        ? "Error: Invalid date"
                        : formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300"
              disabled={false}
            >
              {false ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
