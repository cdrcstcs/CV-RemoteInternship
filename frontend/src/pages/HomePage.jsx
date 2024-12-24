import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
  { 
    href: "/culpa", 
    name: "Repudiandae", 
    imageUrl: "/jeans.jpg", 
    description: "Comfortable and stylish jeans for every occasion."
  },
  { 
    href: "/t-shirts", 
    name: "T-Shirts", 
    imageUrl: "/tshirts.jpg", 
    description: "Soft and breathable t-shirts for casual wear."
  },
  { 
    href: "/shoes", 
    name: "Shoes", 
    imageUrl: "/shoes.jpg", 
    description: "Stylish shoes to complement any outfit."
  },
  { 
    href: "/glasses", 
    name: "Glasses", 
    imageUrl: "/glasses.png", 
    description: "Fashionable eyewear for a perfect look."
  },
  { 
    href: "/jackets", 
    name: "Jackets", 
    imageUrl: "/jackets.jpg", 
    description: "Keep warm with our stylish jacket collection."
  },
  { 
    href: "/suits", 
    name: "Suits", 
    imageUrl: "/suits.jpg", 
    description: "Elegantly tailored suits for formal occasions."
  },
  { 
    href: "/bags", 
    name: "Bags", 
    imageUrl: "/bags.jpg", 
    description: "Chic and durable bags to carry your essentials."
  },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
	  {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}

        <h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
          Explore Our Categories
        </h1>
        <p className='text-center text-xl text-gray-300 mb-12'>
		  Discover the latest fashion trends and products
		</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
