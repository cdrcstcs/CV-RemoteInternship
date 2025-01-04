import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useGeographyStore } from "../../stores/useGeographyStore";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoData } from "../../stores/geoData";
const Geography = () => {
  const { geographyData, isLoading, isError, errorMessage, fetchGeography } = useGeographyStore();

  // Fetch geography data on component mount
  useEffect(() => {
    fetchGeography();
  }, [fetchGeography]);

  // If loading, show a loading message
  if (isLoading) {
    return (
      <Box m="1.5rem 2.5rem">
        <Box mt="40px" height="75vh" border="1px solid #ccc" borderRadius="4px">
          <p>Loading...</p>
        </Box>
      </Box>
    );
  }

  // If there's an error, show an error message
  if (isError) {
    return (
      <Box m="1.5rem 2.5rem">
        <Box mt="40px" height="75vh" border="1px solid #ccc" borderRadius="4px">
          <p style={{ color: "red" }}>{errorMessage}</p>
        </Box>
      </Box>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Box
        mt="40px"
        height="75vh"
        border="1px solid #ccc"
        borderRadius="4px"
      >
        {geographyData.length > 0 ? (
          <ResponsiveChoropleth
            data={geographyData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: "#ccc", // Light grey line color
                  },
                },
                legend: {
                  text: {
                    fill: "#ccc", // Light grey text color
                  },
                },
                ticks: {
                  line: {
                    stroke: "#ccc",
                    strokeWidth: 1,
                  },
                  text: {
                    fill: "#ccc", // Light grey text color
                  },
                },
              },
              legends: {
                text: {
                  fill: "#ccc", // Light grey text color
                },
              },
              tooltip: {
                container: {
                  color: "#333", // Dark color for tooltip text
                },
              },
            }}
            features={geoData.features}
            margin={{ top: 0, right: 0, bottom: 0, left: -50 }}
            domain={[0, 60]}
            unknownColor="#666666"
            label="properties.name"
            valueFormat=".2s"
            projectionScale={80}
            projectionTranslation={[0.45, 0.5]}
            projectionRotation={[0, 0, 0]}
            borderWidth={1.3}
            borderColor="#ffffff"
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: true,
                translateX: 0,
                translateY: -125,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: "#ccc", // Light grey text for legend items
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#fff", // White text on hover
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <p>No data available</p>
        )}
      </Box>
    </Box>
  );
};

export default Geography;
