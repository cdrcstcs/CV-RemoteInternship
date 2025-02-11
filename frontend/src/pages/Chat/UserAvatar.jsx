const UserAvatar = ({ user, online = null, profile = false }) => {
    let onlineClass =
        online === true ? "online" : online === false ? "offline" : "";

    const sizeClass = profile ? "w-40" : "w-8";

    return (
        <>
            {user.profile_picture && (
                <div className={`chat-image avatar ${onlineClass}`}>
                    <div className={`rounded-full ${sizeClass}`}>
                        <img src={user.profile_picture} />
                    </div>
                </div>
            )}
            {!user.profile_picture && (
                <div className={`chat-image avatar placeholder ${onlineClass}`}>
                    <div
                        className={`bg-gray-400 text-gray-800 rounded-full ${sizeClass}`}
                    >
                        <span className="text-xl">
                            {`${user.first_name} ${user.last_name}`}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAvatar;
