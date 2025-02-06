function UserCard({ user, isConnection }) {
	console.log(user);
	return (
		<div className='bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md'>
			<img
				src={user.connection.profilePicture || "/avatar.png"}
				className='w-24 h-24 rounded-full object-cover mb-4'
			/>
			<h3 className='font-semibold text-lg text-center'>{user.connection.first_name + " " + user.connection.last_name}</h3>
			<p className='text-gray-600 text-center'>{user.connection.headline}</p>
			<p className='text-sm text-gray-500 mt-2'>{user.connection.connections?.length} connections</p>
			<button className='mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full'>
				{isConnection ? "Connected" : "Connect"}
			</button>
		</div>
	);
}

export default UserCard;
