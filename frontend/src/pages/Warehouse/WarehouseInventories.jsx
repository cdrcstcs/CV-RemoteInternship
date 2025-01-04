import { useEffect, useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { motion } from "framer-motion";
import ProductCard from "../../components/ProductCard";
import { Search } from "lucide-react";
import { ClipLoader } from "react-spinners"; // Optional spinner library, you can choose another one
import useInventoryStore from "../../stores/useInventoryStore";

const WarehouseInventories = () => {
  const { inventories, getInventoriesForWarehouse, updateInventoriesForWarehouse, loading } = useProductStore();
  const { getTotalInventoryWeightForUserWarehouse, warehouse, loadingWarehouseData } = useInventoryStore(); // Ensure loadingWarehouseData is available if needed
  const [inventoryUpdates, setInventoryUpdates] = useState([]);
  
  // State for search filters
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");

  // Called once when component mounts
  useEffect(() => {
    // Fetch the warehouse data (total weight and capacity)
    getTotalInventoryWeightForUserWarehouse();

    // Perform an initial search when the page is first loaded
    getInventoriesForWarehouse(productName, category);
  }, []); // Empty dependency array ensures this runs only on initial load

  // Function to trigger the search
  const triggerSearch = () => {
    getInventoriesForWarehouse(productName, category);
  };

  const handleInventoryUpdate = (inventoryId, stock, weight) => {
    setInventoryUpdates((prev) => [
      ...prev,
      { inventory_id: inventoryId, stock, weight_per_unit: weight },
    ]);
  };

  const handleUpdate = async () => {
    if (inventoryUpdates.length > 0) {
      await updateInventoriesForWarehouse(inventoryUpdates);
      setInventoryUpdates([]); // Reset after update
    }
  };

  // Handle changes to search fields
  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  console.log("inventories:", inventories);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
	  <div className="p-6 rounded-lg shadow-xl border border-gray-200 max-w-4xl mx-auto mb-5">
			{/* Warehouse Overview Title */}
			<h2 className="text-2xl font-semibold text-emerald-500 text-center mb-6">
				Warehouse Overview
			</h2>

			<div className="flex justify-between items-center gap-6 text-center">
				{/* Total Inventory Weight */}
				<div className="flex-1 min-w-[240px]">
				<div className="text-lg font-semibold text-emerald-500 mb-2">Total Inventory Weight</div>
				<div className="text-3xl text-green-600 font-bold">
					{warehouse?.totalWeight || 0} kg
				</div>
				</div>

				{/* Vertical Divider */}
				<div className="w-[1px] h-16 bg-gray-300" />

				{/* Warehouse Capacity */}
				<div className="flex-1 min-w-[240px]">
				<div className="text-lg font-semibold text-emerald-500 mb-2">Warehouse Capacity</div>
				<div className="text-3xl text-orange-600 font-bold">
					{warehouse?.capacity || 0} kg
				</div>
				</div>
				
				{/* Vertical Divider */}
				<div className="w-[1px] h-16 bg-gray-300" />

				{/* Remaining Capacity */}
				<div className="flex-1 min-w-[240px]">
				<div className="text-lg font-semibold text-emerald-500 mb-2">Remaining Capacity</div>
				<div className="text-3xl text-blue-600 font-bold">
					{(warehouse?.capacity - warehouse?.totalWeight) || 0} kg
				</div>
				</div>
			</div>
		</div>


        {/* Search Fields */}
        <div className="flex space-x-4 mb-8">
          {/* Product Name Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={productName}
              onChange={handleProductNameChange}
              placeholder="Search by product name"
              className="p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 pl-10" // Added padding for the icon
            />
            {/* Search Icon */}
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400 cursor-pointer"
              onClick={triggerSearch} // Trigger search on icon click
            />
          </div>

          {/* Category Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={category}
              onChange={handleCategoryChange}
              placeholder="Search by category"
              className="p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 pl-10" // Added padding for the icon
            />
            {/* Search Icon */}
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-400 cursor-pointer"
              onClick={triggerSearch} // Trigger search on icon click
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <ClipLoader size={50} color="#10B981" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {inventories?.length === 0 && (
              <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
                No products found
              </h2>
            )}

            {inventories?.map((inventory) => (
              <ProductCard
                key={inventory.product.id}
                product={inventory.product}
                stock={inventory.stock}
                weight_per_unit={inventory.weight_per_unit}
				categories={inventory.categories}
                onUpdate={(stock, weight) => handleInventoryUpdate(inventory.id, stock, weight)}
              />
            ))}
          </motion.div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-emerald-400 text-white rounded-md"
          >
            Save Inventories
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseInventories;
