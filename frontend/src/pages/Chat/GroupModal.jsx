import { useState, useEffect } from "react";
import useChatStore from "../../stores/useChatStore";
import useSocialMediaStore from "../../stores/useSocialMediaStore";

const GroupModal = ({ show = false, onClose = () => {} }) => {
  const [group, setGroup] = useState({});
  const { 
    recommendedUsers, 
    isLoadingRecommendedUsers, 
    fetchRecommendedUsers, 
    isErrorRecommendedUsers,
  } = useSocialMediaStore();

  const [data, setData] = useState({
    id: "",
    name: "",
    description: "",
    user_ids: [],
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const { createOrUpdateGroup } = useChatStore(); // Get the store method

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await createOrUpdateGroup(data, group.id); // Pass group data and group ID if it exists
      onClose(); // Close the modal after the group is created/updated
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
    } finally {
      setProcessing(false);
    }
  };

  const closeModal = () => {
    setData({
      id: "",
      name: "",
      description: "",
      user_ids: [],
    });
    setErrors({});
    onClose();
  };

  useEffect(() => {
    if (show && group.id) {
      setData({
        name: group.name,
        description: group.description,
        user_ids: group.users.filter((u) => group.owner_id !== u.id).map((u) => u.id),
      });
      setGroup(group);
    }
  }, [show, group]);
  
  useEffect(() => {
    fetchRecommendedUsers(); // Fetch recommended users data
  }, [fetchRecommendedUsers]);
  
  // Handle loading states
  if (isLoadingRecommendedUsers) {
    return <div className="text-emerald-400">Loading...</div>;
  }
  
  // Handle error states
  if (isErrorRecommendedUsers) {
    return <div className="text-emerald-400">Error loading data. Please try again later.</div>;
  }
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 w-full sm:w-96 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-medium text-gray-900">
            {group.id ? `Edit Group "${group.name}"` : "Create new Group"}
          </h2>

          <div className="mt-8">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={data.name}
              disabled={!!group.id}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
            {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={data.description || ""}
              onChange={(e) => setData({ ...data, description: e.target.value })}
            />
            {errors.description && <span className="text-sm text-red-500">{errors.description}</span>}
          </div>

          <div className="mt-4">
            <label htmlFor="users" className="block text-sm font-medium text-gray-700">
              Select Users
            </label>
            <select
              id="users"
              multiple
              value={data.user_ids}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                setData({ ...data, user_ids: selectedOptions });
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {recommendedUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name + " " + user.last_name}
                </option>
              ))}
            </select>
            {errors.user_ids && <span className="text-sm text-red-500">{errors.user_ids}</span>}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700"
              disabled={processing}
            >
              {group.id ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
