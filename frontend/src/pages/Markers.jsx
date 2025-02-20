import React from "react";
import { Marker } from "react-map-gl";
import { FaMapMarkerAlt } from "react-icons/fa"; // Importing a marker icon from react-icons

const Markers = ({ routeDetails }) => {
  return (
    <div>
      {/* Iterate over routeDetails and display start/end markers */}
      {routeDetails.map((routeDetail) => (
        <div key={routeDetail.id}> {/* Use the route ID as the key */}
          {/* Start Location Marker with Icon from react-icons */}
          {routeDetail.start_latitude && routeDetail.start_longitude && (
            <Marker
              longitude={parseFloat(routeDetail.start_longitude)}  // Ensure longitude is a float
              latitude={parseFloat(routeDetail.start_latitude)}   // Ensure latitude is a float
              anchor="bottom"
            >
              <FaMapMarkerAlt size={30} color="green" /> {/* Start marker */}
            </Marker>
          )}

          {/* End Location Marker with Icon from react-icons */}
          {routeDetail.end_latitude && routeDetail.end_longitude && (
            <Marker
              longitude={parseFloat(routeDetail.end_longitude)}  // Ensure longitude is a float
              latitude={parseFloat(routeDetail.end_latitude)}   // Ensure latitude is a float
              anchor="bottom"
            >
              <FaMapMarkerAlt size={30} color="red" /> {/* End marker */}
            </Marker>
          )}
        </div>
      ))}
    </div>
  );
};

export default Markers;
