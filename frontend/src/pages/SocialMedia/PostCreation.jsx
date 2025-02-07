import { useState } from "react";
import { Image, Loader } from "lucide-react";
import useSocialMediaStore from "../../stores/useSocialMediaStore";

const PostCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Access the createPost method from the store
  const { createPost, isLoadingPost, isErrorPost, errorMessagePost } = useSocialMediaStore((state) => state);

  const handlePostCreation = async () => {
    try {
      const postData = new FormData();
      postData.append("content", content);
      if (image) {
        postData.append("image", image);
      }

      // Call the createPost action from the store
      await createPost(postData);
      resetForm();
    } catch (error) {
      console.error("Error in handlePostCreation:", error);
    }
  };

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="border-2 border-white rounded-lg p-4 text-emerald-400">
      <div className="flex space-x-3 items-center">
        <div>{`${user.first_name} ${user.last_name}`}</div>
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-transparent hover:bg-transparent focus:bg-transparent focus:outline-none resize-none transition-colors duration-200 min-h-[100px] text-emerald-400"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {imagePreview && (
        <div className="mt-4">
          <img src={imagePreview} alt="Selected" className="w-full h-auto rounded-lg" />
        </div>
      )}

      {isErrorPost && errorMessagePost && (
        <div className="text-red-500 mt-2">{errorMessagePost}</div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <label className="flex items-center text-emerald-400 hover:text-emerald-500 transition-colors duration-200 cursor-pointer">
            <Image size={20} className="mr-2" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button
          className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200"
          onClick={handlePostCreation}
          disabled={isLoadingPost}
        >
          {isLoadingPost ? <Loader className="size-5 animate-spin" /> : "Share"}
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
