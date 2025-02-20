import React from "react";
import { Layer, Source } from "react-map-gl";

const MapBoxRoute = ({ coordinates, routeColor }) => {
  return (
    <Source type="geojson" data={{ type: "Feature", geometry: { type: "LineString", coordinates } }}>
      <Layer
        type="line"
        layout={{ "line-join": "round", "line-cap": "square" }}
        paint={{
          "line-color": routeColor,
          "line-width": 4,
        }}
      />
    </Source>
  );
};

export default MapBoxRoute;
