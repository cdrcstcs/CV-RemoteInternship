import React, { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useLineChartStore from "../../stores/useLineChartStore";

const Daily = () => {
  const [startDate, setStartDate] = useState(new Date("2024-05-01"));
  const [endDate, setEndDate] = useState(new Date("2025-05-15"));

  const {
    data,
    loading,
    isError,
    errorMessage,
    fetchLineChartData,
  } = useLineChartStore();

  useEffect(() => {
    if (startDate && endDate) {
      fetchLineChartData(startDate, endDate);
    }
  }, [startDate, endDate, fetchLineChartData]);

  /**
   * Format + Sort Data (Ascending by Date)
   */
  const formattedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    // 1️⃣ Keep only valid date records
    const safeData = data.filter(
      (item) =>
        item?.date &&
        !isNaN(new Date(item.date))
    );

    // 2️⃣ Sort ascending (oldest → newest)
    const sortedData = [...safeData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // 3️⃣ Map into chart structure
    return [
      {
        id: "Shipment",
        color: "yellow",
        data: sortedData
          .filter((item) => item.total_shipment_amount != null)
          .map((item) => ({
            x: new Date(item.date),
            y: Number(item.total_shipment_amount) || 0,
          })),
      },
      {
        id: "Vehicle Maintenance",
        color: "green",
        data: sortedData
          .filter((item) => item.total_maintenance_cost != null)
          .map((item) => ({
            x: new Date(item.date),
            y: Number(item.total_maintenance_cost) || 0,
          })),
      },
      {
        id: "Product Expenses",
        color: "red",
        data: sortedData
          .filter((item) => item.total_product_expenses != null)
          .map((item) => ({
            x: new Date(item.date),
            y: Number(item.total_product_expenses) || 0,
          })),
      },
    ];
  }, [data]);

  return (
    <Box m="1.5rem 2.5rem">
      <Box height="75vh">

        {/* Date Pickers */}
        <Box display="flex" justifyContent="flex-end" gap={2} mb={3}>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="bg-emerald-400 px-2 py-1 rounded"
          />

          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="bg-emerald-400 px-2 py-1 rounded"
          />
        </Box>

        {loading ? (
          <>Loading...</>
        ) : isError ? (
          <Box color="red">{errorMessage}</Box>
        ) : formattedData.length > 0 &&
          formattedData.some((serie) => serie.data.length > 0) ? (
          <ResponsiveLine
            data={formattedData}
            margin={{ top: 50, right: 50, bottom: 70, left: 60 }}

            /* Time Scale (Required for real dates) */
            xScale={{
              type: "time",
              format: "native",
              precision: "day",
            }}

            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}

            xFormat="time:%Y-%m-%d"
            yFormat=" >-.2f"
            curve="catmullRom"

            axisBottom={{
              format: "%b %d",
              tickValues: "every 1 month",
              tickRotation: 45,
              legend: "Date",
              legendOffset: 50,
              legendPosition: "middle",
            }}

            axisLeft={{
              legend: "Total",
              legendOffset: -50,
              legendPosition: "middle",
            }}

            enableGridX={false}
            enableGridY={true}

            pointSize={6}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            useMesh={true}

            colors={{ datum: "color" }}

            theme={{
              axis: {
                domain: { line: { stroke: "#9e9e9e" } },
                ticks: {
                  line: { stroke: "#9e9e9e" },
                  text: { fill: "#9e9e9e" },
                },
                legend: {
                  text: { fill: "#9e9e9e" },
                },
              },
              legends: {
                text: { fill: "#9e9e9e" },
              },
              tooltip: {
                container: {
                  color: "#1976d2",
                },
              },
            }}

            legends={[
              {
                anchor: "top-left",
                direction: "column",
                translateX: 50,
                itemWidth: 120,
                itemHeight: 20,
                symbolSize: 12,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0,0,0,0.03)",
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
