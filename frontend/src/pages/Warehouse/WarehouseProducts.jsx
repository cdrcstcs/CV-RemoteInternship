import { useEffect } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { motion } from "framer-motion";
import ProductCard from "../../components/ProductCard";
const WarehouseProducts = () => {
	const { warehouseProducts, getProductsForWarehouse } = useProductStore();
	useEffect(() => {
		getProductsForWarehouse();
	}, [getProductsForWarehouse]);

	console.log("products:", warehouseProducts);
	return (
		<div className='min-h-screen'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{warehouseProducts?.length === 0 && (
						<h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
							No products found
						</h2>
					)}

					{warehouseProducts?.map((product) => (
						<ProductCard key={product.product.id} product={product.product} stock={product.stock} weight_per_unit={product.weight_per_unit}/>
					))}
				</motion.div>
			</div>
		</div>
	);
};
export default WarehouseProducts;
