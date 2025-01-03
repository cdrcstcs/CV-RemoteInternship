import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useLineChartStore from "../../stores/useLineChartStore";
const Daily = () => {
  const [startDate, setStartDate] = useState(new Date("2024-05-01"));
  const [endDate, setEndDate] = useState(new Date("2025-05-15"));
  const { data, loading, isError, errorMessage, fetchLineChartData } = useLineChartStore();

  useEffect(() => {
    // Fetch data when the date range changes
    fetchLineChartData(startDate, endDate);
  }, [startDate, endDate, fetchLineChartData]);

  // Format the data for the chart
  const formattedData = [
    {
      id: "Shipment",
      color: 'yellow', // Hardcoded color for Shipment
      data: data.map((item) => ({
        x: item.date, // Assuming `item.date` is in a format like "2023-05-01"
        y: item.total_shipment_amount, // Change this if necessary to the correct field
      })),
    },
    {
      id: "Vehicle Maintenance",
      color: "green", // Hardcoded color for Vehicle Maintenance
      data: data.map((item) => ({
        x: item.date, // Assuming `item.date` is in a format like "2023-05-01"
        y: item.total_maintenance_cost, // Change this if necessary to the correct field
      })),
    },
    {
      id: "Product Expenses",
      color: "red", // Hardcoded color for Product Expenses
      data: data.map((item) => ({
        x: item.date, // Assuming `item.date` is in a format like "2023-05-01"
        y: item.total_product_expenses, // Change this if necessary to the correct field
      })),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Box height="75vh">
        <Box display="flex" justifyContent="flex-end">
          <Box>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="bg-emerald-400"
            />
          </Box>
          <p className="w-4 bg-gray-900"></p>
          <Box>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="bg-emerald-400"
            />
          </Box>
        </Box>

        {loading ? (
          <>Loading...</>
        ) : isError ? (
          <Box color="red">{errorMessage}</Box>
        ) : formattedData.length ? (
          <ResponsiveLine
            data={formattedData}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: "#9e9e9e", // Hardcoded color for axis line
                  },
                },
                legend: {
                  text: {
                    fill: "#9e9e9e", // Hardcoded color for legend text
                  },
                },
                ticks: {
                  line: {
                    stroke: "#9e9e9e", // Hardcoded color for ticks
                    strokeWidth: 1,
                  },
                  text: {
                    fill: "#9e9e9e", // Hardcoded color for ticks text
                  },
                },
              },
              legends: {
                text: {
                  fill: "#9e9e9e", // Hardcoded color for legend text
                },
              },
              tooltip: {
                container: {
                  color: "#1976d2", // Hardcoded color for tooltip
                },
              },
            }}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: "Date",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "top-left",
                direction: "column",
                justify: false,
                translateX: 50,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <>No Data Available</>
        )}
      </Box>
    </Box>
  );
};

export default Daily;
