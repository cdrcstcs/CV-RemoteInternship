import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useState, useEffect } from "react";

const ProductCard = ({ product, stock, weight_per_unit, onUpdate }) => {
  const { addToCart } = useCartStore();

  const [newStock, setNewStock] = useState(stock);
  const [newWeight, setNewWeight] = useState(weight_per_unit);
  const [lastUpdated, setLastUpdated] = useState({ stock, weight_per_unit });

  const handleAddToCart = () => {
    addToCart(product.id);
  };

  const handleStockChange = (e) => {
    setNewStock(e.target.value);
  };

  const handleWeightChange = (e) => {
    setNewWeight(e.target.value);
  };

  // Prevent infinite loop by updating only when there is a real change in stock or weight
  useEffect(() => {
    // Only call onUpdate if the newStock or newWeight is different from the previous one
    if (
      newStock !== lastUpdated.stock ||
      newWeight !== lastUpdated.weight_per_unit
    ) {
      onUpdate(newStock, newWeight);
      setLastUpdated({ stock: newStock, weight_per_unit: newWeight });
    }
  }, [newStock, newWeight, lastUpdated, onUpdate]);

  // Check if the product is out of stock
  const isInWareHousePage = stock != null;

  return (
    <div className="flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        {/* Conditionally render the Link based on stock availability */}
        {!isInWareHousePage ? (
          <Link to={`/product/${product.id}`}>
            <img
              className="object-cover w-full cursor-pointer"
              src={product.image}
              alt="Product image"
            />
          </Link>
        ) : (
          <img
            className="object-cover w-full"
            src={product.image}
            alt="Product image"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="mt-4 px-5 pb-5">
        {/* Conditionally render the Link for product name */}
        {!isInWareHousePage ? (
          <Link to={`/product/${product.id}`}>
            <h5 className="text-xl font-semibold tracking-tight text-white cursor-pointer">
              {product.name}
            </h5>
          </Link>
        ) : (
          <h5 className="text-xl font-semibold tracking-tight text-white">
            {product.name}
          </h5>
        )}

        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">${product.price}</span>
          </p>
        </div>

        {/* Display stock if available */}
        {stock !== null && (
          <p className="text-sm text-gray-300">Stock: {stock}</p>
        )}

        {/* Display weight if available */}
        {weight_per_unit !== null && (
          <p className="text-sm text-gray-300">Weight: {weight_per_unit} kg</p>
        )}

        {/* Conditionally render the Add to Cart button if the product is in stock */}
        {!isInWareHousePage && (
          <button
            className="flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={22} className="mr-2" />
            Add to cart
          </button>
        )}

        {/* Editable fields for inventory update */}
        {isInWareHousePage && (
          <div className="mt-4">
            <div className="mb-4">
              <label className="text-sm text-gray-300">Stock:</label>
              <input
                type="number"
                value={newStock}
                onChange={handleStockChange}
                className="w-full p-2 mt-2 bg-gray-800 text-white rounded-lg"
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-300">Weight (kg):</label>
              <input
                type="number"
                value={newWeight}
                onChange={handleWeightChange}
                className="w-full p-2 mt-2 bg-gray-800 text-white rounded-lg"
                min="0"
                step="any"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
