import React from 'react';
import useInventoryStore from '../../stores/useInventoryStore';

const CreateInventory = () => {
    const {
        productDetails,
        setProductDetails,
        stock,
        weightPerUnit,
        setInventoryDetails,
        createInventory,
        isSubmitting,
    } = useInventoryStore();

    const handleProductChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductDetails({
            ...productDetails,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleInventoryChange = (e) => {
        const { name, value } = e.target;
        setInventoryDetails({ [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createInventory();
    };

    return (
        <div className="w-full p-8 shadow-xl rounded-lg">
            <h1 className="text-3xl font-extrabold text-center text-emerald-400 mb-8">Create Product and Inventory</h1>
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Product Details Section */}
                <div className="bg-emerald-400 p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Product Details</h3>
                    <div className="space-y-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700" htmlFor="name">Product Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={productDetails.name}
                                onChange={handleProductChange}
                                className="mt-2 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700" htmlFor="description">Description</label>
                            <input
                                id="description"
                                type="text"
                                name="description"
                                value={productDetails.description}
                                onChange={handleProductChange}
                                className="mt-2 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700" htmlFor="price">Price</label>
                            <input
                                id="price"
                                type="number"
                                name="price"
                                value={productDetails.price}
                                onChange={handleProductChange}
                                className="mt-2 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700" htmlFor="image">Product Image</label>
                            <input
                                id="image"
                                type="file"
                                name="image"
                                onChange={(e) => setProductDetails({ ...productDetails, image: e.target.files[0] })}
                                className="mt-2 p-2 text-sm border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700" htmlFor="category">Category</label>
                            <input
                                id="category"
                                type="text"
                                name="category"
                                value={productDetails.category}
                                onChange={handleProductChange}
                                className="mt-2 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                id="isFeatured"
                                type="checkbox"
                                name="isFeatured"
                                checked={productDetails.isFeatured}
                                onChange={handleProductChange}
                                className="mr-2 w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Is Featured</label>
                        </div>
                    </div>
                </div>

                {/* Inventory Details Section */}
                <div className="bg-emerald-400 p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Inventory Details</h3>
                    <div className="space-y-6">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700" htmlFor="stock">Stock</label>
                            <input
                                id="stock"
                                type="number"
                                name="stock"
                                value={stock}
                                onChange={handleInventoryChange}
                                className="mt-2 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700" htmlFor="weightPerUnit">Weight Per Unit</label>
                            <input
                                id="weightPerUnit"
                                type="number"
                                name="weightPerUnit"
                                value={weightPerUnit}
                                onChange={handleInventoryChange}
                                className="mt-2 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-8 py-3 mt-6 rounded-lg text-white font-semibold text-lg ${isSubmitting ? 'bg-gray-400' : 'bg-emerald-400 hover:bg-emerald-200'} transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                    >
                        {isSubmitting ? 'Submitting...' : 'Create Product and Inventory'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateInventory;
