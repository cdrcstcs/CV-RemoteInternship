import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<div className='rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-4'>
			<div className='flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0 md:items-center md:justify-between'>
				{/* Image section */}
				<div className='shrink-0'>
					<img className='h-16 md:h-24 rounded object-cover' src={item.product.image} />
				</div>

				{/* Quantity controls */}
				<div className='flex items-center gap-2'>
					<button
						className='inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500'
						onClick={() => updateQuantity(item.product.id, false)}
					>
						<Minus className='text-gray-300' />
					</button>
					<p className='text-base text-white'>{item.quantity}</p>
					<button
						className='inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500'
						onClick={() => updateQuantity(item.product.id, true)}
					>
						<Plus className='text-gray-300' />
					</button>
				</div>

				{/* Product name and details */}
				<div className='text-sm text-white space-y-1'>
					<p className='font-medium text-emerald-400'>{item.product.name}</p>
					<p className='text-gray-400'>{item.product.description}</p>
					<p className='text-gray-400'>Price: ${item.product.price}</p>
					<p className='font-bold text-emerald-400'>Total: ${item.total_amount}</p>
				</div>

				{/* Remove from cart button */}
				<div className='flex items-center justify-center'>
					<button
						className='inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline'
						onClick={() => removeFromCart(item.product.id)}
					>
						<Trash />
					</button>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
