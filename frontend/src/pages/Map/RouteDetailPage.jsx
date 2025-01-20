import React from 'react';
import useDeliveryStore from '../../stores/useDeliveryStore';

const RouteDetailPage = ({ routeDetail, vehicle }) => {
    const { handleSaveVehicleId, isLoading, isError, errorMessage } = useDeliveryStore();

    // Check if routeDetail or vehicle is null or undefined
    if (!routeDetail) {
        return <div className="text-center py-8 text-lg text-gray-500">Loading route details...</div>;
    }

    if (!vehicle) {
        return <div className="text-center py-8 text-lg text-gray-500">Loading vehicle information...</div>;
    }

    const assignedVehicleId = vehicle.id;

    const handleSave = () => {
        handleSaveVehicleId(routeDetail.id, assignedVehicleId);
    };

    return (
        <div className="mt-10 max-w-6xl mx-auto p-6 bg-transparent rounded-lg shadow-xl border-2 border-gray-300">
            <h1 className="text-4xl font-bold text-center mb-6 text-emerald-400">Route Detail</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Route Information */}
                <div className="bg-transparent p-6 rounded-lg shadow-md border-2 border-gray-300 space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">Route Information</h2>
                    <div className="space-y-2">
                        <p className='text-white'><strong className="text-emerald-400">Route Name:</strong> {routeDetail.route_name || 'N/A'}</p>
                        <p className='text-white'><strong className="text-emerald-400">Supplier Name:</strong> {routeDetail.supplier_name || 'N/A'}</p>
                        <p className='text-white'><strong className="text-emerald-400">Warehouse 1:</strong> {routeDetail.warehouse_name_1 || 'N/A'}</p>
                        <p className='text-white'><strong className="text-emerald-400">Warehouse 2:</strong> {routeDetail.warehouse_name_2 || 'N/A'}</p>
                        <p className='text-white'><strong className="text-emerald-400">Start Location:</strong> {routeDetail.start_location || 'N/A'}</p>
                        <p className='text-white'><strong className="text-emerald-400">End Location:</strong> {routeDetail.end_location || 'N/A'}</p>
                        <p className='text-white'><strong className="text-emerald-400">Estimated Time:</strong> {routeDetail.estimated_time || 'N/A'}</p>
                        <p className='text-white'><strong className="text-emerald-400">Distance:</strong> {routeDetail.distance ? `${routeDetail.distance} km` : 'N/A'}</p>
                        <p className='text-white'><strong className="text-emerald-400">Route Condition:</strong> {routeDetail.route_condition?.name || 'N/A'}</p>
                    </div>
                </div>

                {/* Assigned Vehicle Information */}
                <div className="bg-transparent p-6 rounded-lg shadow-md border-2 border-gray-300 space-y-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">Assigned Vehicle</h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <img
                                src={vehicle.image_url || "/path/to/default-image.jpg"}
                                alt={vehicle.name}
                                className="w-20 h-20 object-cover rounded-md shadow-lg border-2 border-gray-300"
                            />
                        </div>
                        <div>
                            <p className='text-white'><strong className="text-emerald-400">Vehicle Name:</strong> {vehicle.name || 'N/A'}</p>
                            <p className='text-white'><strong className="text-emerald-400">Model:</strong> {vehicle.model || 'N/A'}</p>
                            <p className='text-white'><strong className="text-emerald-400">License Plate:</strong> {vehicle.license_plate || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 text-center">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className={`border-2 border-white px-6 py-3 text-lg font-semibold rounded-md ${isLoading ? 'bg-gray-500' : 'bg-emtext-emerald-400'} text-white hover:bg-emtext-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 transition duration-300`}
                >
                    {isLoading ? 'Saving...' : 'Pick This Route'}
                </button>
            </div>

            {/* Error Message */}
            {isError && (
                <div className="mt-6 text-center text-red-600 text-lg font-medium">
                    <p className='text-white'>{errorMessage || 'Something went wrong. Please try again.'}</p>
                </div>
            )}
        </div>
    );
};

export default RouteDetailPage;
