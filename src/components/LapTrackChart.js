import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LapTrackChart = ({ driver1Data, driver2Data }) => {
  const [driver1TrackData, setDriver1TrackData] = useState([]);
  const [driver2TrackData, setDriver2TrackData] = useState([]);

  useEffect(() => {
    setDriver1TrackData(driver1Data);  // Set the data for driver 1
    setDriver2TrackData(driver2Data);  // Set the data for driver 2
  }, [driver1Data, driver2Data]);

  // Get min and max values for X and Y to make sure the graph is adjusted
  const minX = Math.min(
    ...[...driver1TrackData, ...driver2TrackData].map((d) => d.x)
  );
  const minY = Math.min(
    ...[...driver1TrackData, ...driver2TrackData].map((d) => d.y)
  );
  const maxX = Math.max(
    ...[...driver1TrackData, ...driver2TrackData].map((d) => d.x)
  );
  const maxY = Math.max(
    ...[...driver1TrackData, ...driver2TrackData].map((d) => d.y)
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="x"
          domain={[minX - 100, maxX + 100]} // Adjust domain for X-axis
          name="X Coordinate"
          label={{ value: "X", position: "bottom" }}
        />
        <YAxis
          type="number"
          dataKey="y"
          domain={[minY - 100, maxY + 100]} // Adjust domain for Y-axis
          name="Y Coordinate"
          label={{ value: "Y", angle: -90, position: "left" }}
        />
        {/* <Tooltip cursor={{ strokeDasharray: '3 3' }} /> */}
        <Legend />
        
        {/* Driver 1 Path */}
        <Scatter
          name="Driver 1"
          data={driver1TrackData}
          fill="#8884d8"
          shape="circle"
          line={{stroke: '#8884d8', strokeWidth: 1}}
        />
        
        {/* Driver 2 Path */}
        <Scatter
          name="Driver 2"
          data={driver2TrackData}
          fill="#82ca9d"
          shape="circle"
          line={{stroke: '#82ca9d', strokeWidth: 1}}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default LapTrackChart;