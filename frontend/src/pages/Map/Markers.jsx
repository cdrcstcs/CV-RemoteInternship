import React from "react";
import { Marker } from "react-map-gl";
import { FaMapMarkerAlt } from "react-icons/fa";  // Importing a marker icon from react-icons

const Markers = ({ shipment, onSelectedRoute }) => {
  const handleMarkerClick = (routeDetail) => {
    // Call the onSelectedRoute with the clicked routeDetail
    onSelectedRoute(routeDetail);
  };
  return (
    <div>
      {/* Iterate over route details and display start/end markers */}
      {shipment.routeOptimizations.map((routeOptimization) =>
        routeOptimization.routeDetails.map((routeDetail) => (
          <div key={routeDetail.routeDetail.id}>
            {/* Start Location Marker with Icon from react-icons */}
            {  console.log(routeDetail.routeDetail)
            }
            <Marker
              longitude={routeDetail.routeDetail.start_longitude}
              latitude={routeDetail.routeDetail.start_latitude}
              anchor="bottom"
              onClick={() => handleMarkerClick(routeDetail.routeDetail)} // Handle start marker click
            >
              <FaMapMarkerAlt size={30} color="green" /> {/* Start marker */}
            </Marker>

            {/* End Location Marker with Icon from react-icons */}
            <Marker
              longitude={routeDetail.routeDetail.end_longitude}
              latitude={routeDetail.routeDetail.end_latitude}
              anchor="bottom"
              onClick={() => handleMarkerClick(routeDetail.routeDetail)} // Handle end marker click
            >
              <FaMapMarkerAlt size={30} color="red" /> {/* End marker */}
            </Marker>
          </div>
        ))
      )}
    </div>
  );
};

export default Markers;
