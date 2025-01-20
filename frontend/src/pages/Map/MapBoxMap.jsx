import React, { useEffect, useState, useRef } from "react";
import { Map } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapBoxRoute from "./MapBoxRoute";
import Markers from "./Markers";

const MAPBOX_DRIVING_ENDPOINT =
  "https://api.mapbox.com/directions/v5/mapbox/driving/";

const MapboxMap = ({ shipment, onSelectedRoute }) => {
  const mapRef = useRef();
  const mapContainerRef = useRef();  // Ref to the parent container for resize detection
  const [routesData, setRoutesData] = useState([]);
  const [routeColors, setRouteColors] = useState({});

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    if (shipment && shipment.routeOptimizations) {
      const routePromises = shipment.routeOptimizations.flatMap((routeOptimization) => {
        return routeOptimization.routeDetails.map((routeDetail) => {
          const { start_latitude, start_longitude, end_latitude, end_longitude, id } = routeDetail.routeDetail;

          const routeRequestUrl = `${MAPBOX_DRIVING_ENDPOINT}${start_longitude},${start_latitude};${end_longitude},${end_latitude}?geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_API_KEY}`;

          return fetch(routeRequestUrl)
            .then((response) => response.json())
            .then((data) => {
              if (data.routes && data.routes.length > 0) {
                setRouteColors((prevColors) => {
                  if (!prevColors[id]) {
                    return {
                      ...prevColors,
                      [id]: generateRandomColor(),
                    };
                  }
                  return prevColors;
                });

                return {
                  routeId: id,
                  coordinates: data.routes[0].geometry.coordinates,
                };
              }
              return null;
            })
            .catch((error) => {
              console.error("Error fetching route:", error);
              return null;
            });
        });
      });

      Promise.all(routePromises).then((routeDetails) => {
        const validRouteDetails = routeDetails.filter((route) => route !== null);
        setRoutesData(validRouteDetails);
      });

      const firstRoute = shipment.routeOptimizations[0].routeDetails[0].routeDetail;
      const { start_latitude, start_longitude } = firstRoute;
      mapRef.current?.flyTo({
        center: [start_longitude, start_latitude],
        duration: 2500,
      });
    }
  }, [shipment]);

  const getRouteColor = (routeId) => {
    return routeColors[routeId] || "#1e90ff";
  };

  // Handle window resize or container resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize(); // Resize the map when the container size changes
      }
    };
    
    // Listen for resize events on the window and the parent container
    window.addEventListener("resize", handleResize);
    if (mapContainerRef.current) {
      new ResizeObserver(handleResize).observe(mapContainerRef.current); // Observe parent container resize
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mapContainerRef.current) {
        // Cleanup observer on unmount
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <div className="w-full" style={{ height: "100vh" }} ref={mapContainerRef}> {/* Parent container ref for resize detection */}
      <h2 className="text-[20px] font-semibold">Map</h2>
      <div style={{ height: "100%" }} className="rounded-lg">
        {shipment ? (
          <Map
            ref={mapRef}
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_API_KEY}
            initialViewState={{
              longitude: shipment.routeOptimizations[0]?.routeDetails[0]?.routeDetail?.start_longitude || -74.0060,
              latitude: shipment.routeOptimizations[0]?.routeDetails[0]?.routeDetail?.start_latitude || 40.7128,
              zoom: 5,
            }}
            style={{ width: "100%", height: "100%", borderRadius: "10px" }} // Ensure the map takes full height of its parent container
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            <Markers shipment={shipment} onSelectedRoute={onSelectedRoute} />
            {routesData.map((route) => (
              <MapBoxRoute
                key={route.routeId}
                coordinates={route.coordinates}
                routeColor={getRouteColor(route.routeId)}
              />
            ))}
          </Map>
        ) : null}
      </div>
    </div>
  );
};

export default MapboxMap;
