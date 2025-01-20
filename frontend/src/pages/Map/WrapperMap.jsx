import React, { useEffect, useState } from "react";
import Navbar from "../../components/Map/Navbar";
import Sidebar from "../../components/Map/Sidebar";
import StoreProvider, { useAppSelector } from "../State/Redux";
import useDeliveryStore from "../../stores/useDeliveryStore";
import MapboxMap from "./MapBoxMap";
import RouteDetailPage from "./RouteDetailPage";

const DashboardLayout = () => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Use the custom hook to fetch shipments and vehicle
  const { shipments, isLoading, errorMessage, fetchShipmentsWithRouteDetails, getVehicleForAuthenticatedUser, vehicle } = useDeliveryStore();
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [route, setRoute] = useState(null);

  const onSelectedRoute = (route) => {
    setRoute(route);
  }

  // Callback to set the selected shipment
  const handleSetSelectedShipment = (shipment) => {
    setSelectedShipment(shipment);
  };

  useEffect(() => {
    // Fetch shipments when the component mounts
    if (shipments.length === 0) {
      fetchShipmentsWithRouteDetails();
    }

    // Fetch the vehicle for the authenticated user
    getVehicleForAuthenticatedUser();

    // Handle dark mode toggling
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode, shipments.length, fetchShipmentsWithRouteDetails, getVehicleForAuthenticatedUser]);

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-900 text-gray-900 w-full h-full`}
    >
      {/* Pass the shipments data to the Sidebar */}
      {!isSidebarCollapsed && (
        <Sidebar
          shipments={shipments}
          isLoading={isLoading}
          errorMessage={errorMessage}
          setSelectedShipment={handleSetSelectedShipment}
        />
      )}
      
      <main
        className={"flex flex-col w-full h-full py-7 px-9 bg-gray-900"}
      >
        <Navbar />
        <div className="flex flex-col">
          <MapboxMap shipment={selectedShipment} onSelectedRoute={onSelectedRoute} />
          {/* Pass the route and vehicle to the RouteDetailPage */}
          <RouteDetailPage routeDetail={route} vehicle={vehicle} />
        </div>
      </main>
    </div>
  );
};

const WrapperMap = ({ children }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default WrapperMap;
