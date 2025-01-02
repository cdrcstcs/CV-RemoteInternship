import { useEffect, useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { motion } from "framer-motion";
import ProductCard from "../../components/ProductCard";

const WarehouseInventories = () => {
  const { inventories, getInventoriesForWarehouse, updateInventoriesForWarehouse } = useProductStore();
  const [inventoryUpdates, setInventoryUpdates] = useState([]);

  useEffect(() => {
    getInventoriesForWarehouse();
  }, [getInventoriesForWarehouse]);

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

  console.log("inventories:", inventories);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
              onUpdate={(stock, weight) => handleInventoryUpdate(inventory.id, stock, weight)}
            />
          ))}
        </motion.div>

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
