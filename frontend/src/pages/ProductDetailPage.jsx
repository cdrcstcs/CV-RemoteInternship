import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useProductStore } from "../stores/useProductStore";
import useRatingStore from "../stores/useRatingStore"; // Import the rating store
import { FaStar } from "react-icons/fa"; // For Star Rating Icon
import ProductCard from "../components/ProductCard";
const ProductDetailPage = () => {
  const { id } = useParams(); // Getting the product ID from the URL
  const { addToCart } = useCartStore();
  const { currentProduct, loading, fetchProductById, fetchProductsByCategory, products } = useProductStore();
  
  // Access rating store
  const { ratings, ratingLoading, fetchRatings, submitRating, isSubmitting } = useRatingStore();
  
  const [feedback, setFeedback] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]); // State for related products

  useEffect(() => {
    fetchProductById(id); // Fetch the product details when the component mounts
    fetchRatings(id); // Fetch ratings for the product
  }, [id, fetchProductById, fetchRatings]);

  useEffect(() => {
    if (currentProduct?.categories) {
      // Fetch products by categories after the product details are fetched
      const categories = currentProduct.categories.map(category => category.category_name);
      console.log(categories)
      fetchProductsByCategory(categories);
    }
  }, [currentProduct, fetchProductsByCategory]);

  // Assuming fetchProductsByCategory updates the `relatedProducts` state
  useEffect(() => {
    console.log(products)
    if (products.length > 0) {
      setRelatedProducts(products); // Update related products when fetched
    }
  }, [products]);

  const handleAddToCart = () => {
    addToCart(currentProduct);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (ratingValue === 0) {
      alert("Please provide a rating!");
      return;
    }

    await submitRating(id, ratingValue, feedback, 1); // Assuming shipmentId is 1 for now
    setFeedback(""); // Reset feedback after submission
    setRatingValue(0); // Reset rating
  };

  const renderStars = (value) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`cursor-pointer ${i <= value ? "text-yellow-500" : "text-gray-300"}`}
          onClick={() => setRatingValue(i)}
        />
      );
    }
    return stars;
  };

  if (loading || ratingLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-500 to-teal-500">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-500 to-teal-500">
        <p className="text-white text-xl">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 rounded-xl shadow-xl">
      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-12">
        {/* Product Image */}
        <div className="flex-shrink-0 w-full sm:w-64 lg:w-96 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-all">
          <img
            className="object-cover w-full h-64 lg:h-80 rounded-lg"
            src={currentProduct.image}
            alt={currentProduct.name}
          />
        </div>

        {/* Product Information */}
        <div className="flex-grow text-center lg:text-left">
          <h1 className="text-3xl font-extrabold text-emerald-400 mb-4">{currentProduct.name}</h1>
          <p className="text-xl text-emerald-400 mb-4">${currentProduct.price}</p>
          <p className="text-lg text-white mb-6">{currentProduct.description}</p>

          {/* Categories */}
          <div className="mb-6">
            <strong className="text-lg text-emerald-400">Categories:</strong>
            {currentProduct.categories && currentProduct.categories.length > 0 ? (
              <div className="flex space-x-4 mt-2">
                {currentProduct.categories.map((category) => (
                  <span key={category.id} className="text-lg text-white px-3 py-1 bg-emerald-600 rounded-full shadow-md hover:bg-emerald-700 cursor-pointer">
                    {category.category_name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No categories available</p>
            )}
          </div>

          {/* Supplier */}
          <div className="mb-6">
            <strong className="text-lg text-emerald-400">Supplier:</strong>
            <p className="text-lg text-white">
              {(currentProduct.supplier?.first_name + " " + currentProduct.supplier?.last_name) || "Unknown Supplier"}
            </p>
          </div>

          {/* Add to Cart Button */}
          <button
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transform transition-all hover:scale-105"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Ratings and Feedback */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Ratings & Feedback</h2>

        {/* Display Ratings */}
        {ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(rating.rating_value)}
                  </div>
                  <span className="text-sm text-gray-400">- {new Date(rating.date_created).toLocaleDateString()}</span>
                </div>
                {rating.feedback && <p className="text-white mt-2">{rating.feedback}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No ratings yet for this product</p>
        )}

        {/* Add Feedback Form */}
        <div className="mt-8">
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="text-white font-semibold">Your Rating:</label>
              <div className="flex space-x-2 mt-2">
                {renderStars(ratingValue)}
              </div>
            </div>

            <div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Your feedback..."
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white mt-4"
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transform transition-all hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500">No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
