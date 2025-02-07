function UserCard({ user, isConnection }) {
	console.log(user);
	return (
		<div className='border-2 border-white rounded-lg p-4 flex flex-col items-center transition-all hover:shadow-md hover:bg-emerald-400'>
			<img
				src={user.connection.profile_picture || "/avatar.png"}
				className='w-24 h-24 rounded-full object-cover mb-4'
			/>
			<h3 className='font-semibold text-lg text-emerald-400 text-center'>
				{user.connection.first_name + " " + user.connection.last_name}
			</h3>
			<p className='text-emerald-400 text-center'>{user.connection.headline}</p>
			<p className='text-sm text-emerald-400 mt-2'>
				{user.connection.connections?.length} connections
			</p>
			<button className='mt-4 border-2 border-white text-emerald-400 px-4 py-2 rounded-md hover:bg-emerald-400 hover:text-white transition-colors w-full'>
				{isConnection ? "Connected" : "Connect"}
			</button>
		</div>
	);
}

export default UserCard;
