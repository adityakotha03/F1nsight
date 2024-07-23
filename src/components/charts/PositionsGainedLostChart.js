import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { lightenColor } from '../../utils/lightenColor';
import { darkenColor } from '../../utils/darkenColor';

const CustomizedXAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#f1f1f1"
        transform="rotate(-15) translate(8,0)"
        fontSize={12}
      >
        GP {payload.value + 1}
      </text>
    </g>
  );
};

export const PositionsGainedLostChart = ({ headToHeadData, teamColor }) => {
  const chartData = useMemo(() => {
    if (!headToHeadData) return [];
    
    return Object.keys(headToHeadData.driver1PositionsGainLost).map((race, index) => {
      const driver1Data = headToHeadData.driver1PositionsGainLost[race];
      const driver2Data = headToHeadData.driver2PositionsGainLost[race];

      return driver1Data !== undefined && driver2Data !== undefined ? {
        race,
        index,
        [headToHeadData.driver1Code]: driver1Data,
        [headToHeadData.driver2Code]: driver2Data
      } : null;
    }).filter(item => item !== null);
  }, [headToHeadData]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart width={730} height={250} data={chartData} margin={{ top: 20, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
        <XAxis dataKey="index" tick={<CustomizedXAxisTick />} />
        <YAxis tick={{ fontSize: 12, fill: '#f1f1f1' }} />
        <Tooltip
          labelFormatter={(index) => chartData[index] ? chartData[index].race : index}
          formatter={(value) => value}
        />
        <Legend verticalAlign="top" height={36} />
        <Bar dataKey={headToHeadData.driver1Code} fillOpacity={1} fill={darkenColor(teamColor)} />
        <Bar dataKey={headToHeadData.driver2Code} fillOpacity={1} fill={lightenColor(teamColor)} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PositionsGainedLostChart;