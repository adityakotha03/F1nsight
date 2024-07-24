import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const BarChartTotal = ({ driver1Name, driver2Name, driver1Data, driver2Data }) => {
  const getPositionData = () => {
    const positionCounts = {};

    const countPositions = (positions, driverName) => {
      Object.values(positions).forEach(pos => {
        if (!positionCounts[pos]) {
          positionCounts[pos] = { position: pos, [driver1Name]: 0, [driver2Name]: 0 };
        }
        positionCounts[pos][driverName] += 1;
      });
    };

    Object.keys(driver1Data).forEach(year => {
      countPositions(driver1Data[year].positions, driver1Name);
    });

    Object.keys(driver2Data).forEach(year => {
      countPositions(driver2Data[year].positions, driver2Name);
    });

    return Object.values(positionCounts).sort((a, b) => a.position - b.position);
  };

  const positionData = getPositionData();

  return (
    <div className="bg-glow-large rounded-lg mb-96 p-8 md:px-32 md:pt-16 md:pb-32">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={positionData} margin={{ top: 20, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="position" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={driver1Name} fill="#8884d8" />
          <Bar dataKey={driver2Name} fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
