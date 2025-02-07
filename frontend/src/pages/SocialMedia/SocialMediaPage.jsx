import { useEffect } from "react";
import useSocialMediaStore from "../../stores/useSocialMediaStore";
import PostCreation from "./PostCreation";
import Post from "./Post";
import { Users } from "lucide-react";
import RecommendedUser from "./RecommendedUser";
import { useUserStore } from "../../stores/useUserStore";

const SocialMediaPage = () => {
  const { user } = useUserStore();
  const { 
    recommendedUsers, 
    posts, 
    isLoadingPosts, 
    isLoadingRecommendedUsers, 
    fetchPosts, 
    fetchRecommendedUsers, 
    isErrorPosts,
    isErrorRecommendedUsers,
  } = useSocialMediaStore();

  useEffect(() => {
    fetchRecommendedUsers(); // Fetch recommended users data
    fetchPosts(); // Fetch posts
  }, [ fetchRecommendedUsers, fetchPosts]);

  // Handle loading states
  if ( isLoadingRecommendedUsers || isLoadingPosts) {
    return <div className="text-emerald-400">Loading...</div>;
  }

  // Handle error states
  if ( isErrorRecommendedUsers || isErrorPosts) {
    return <div className="text-emerald-400">Error loading data. Please try again later.</div>;
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 h-full'>
      <div className='col-span-1 lg:col-span-2 order-first lg:order-none border-2 border-white rounded-lg text-emerald-400'>
        <PostCreation user={user} />

        <div
          style={{
            maxHeight: '420px',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="posts-container"
        >
          {posts?.map((post) => (
            <Post key={post.id} post={post} />
          ))}
          <style jsx>{`
            .posts-container::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>

        {posts?.length === 0 && (
          <div className='border-2 border-white rounded-lg shadow p-8 text-emerald-400 text-center'>
            <div className='mb-6'>
              <Users size={64} className='mx-auto text-emerald-400' />
            </div>
            <h2 className='text-2xl font-bold mb-4 text-emerald-400'>No Posts Yet</h2>
          </div>
        )}
      </div>

      {recommendedUsers?.length > 0 && (
        <div className='col-span-1 lg:col-span-2 hidden lg:block'>
          <div className='border-2 border-white rounded-lg p-4 text-emerald-400'>
            <h2 className='font-semibold mb-4 text-emerald-400'>People you may know</h2>
            <div
              style={{
                maxHeight: '550px',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {recommendedUsers.map((user) => (
                <RecommendedUser key={user.id} user={user} />
              ))}
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaPage;
