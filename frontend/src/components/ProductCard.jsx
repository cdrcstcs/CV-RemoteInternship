import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product, stock, weight_per_unit }) => {
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart(product.id);
  };

  // Check if the product is out of stock
  const isInWareHousePage = stock;

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

      </div>
    </div>
  );
};

export default ProductCard;
