import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { lightenColor } from '../../utils/lightenColor';

const CustomizedXAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-15) translate(8,0)"
        fontSize={12}
      >
        GP {payload.value + 1}
      </text>
    </g>
  );
};

export const PositionsComparisonChart = ({ headToHeadData, teamColor, isQualifying }) => {
  const chartData = useMemo(() => {
    if (!headToHeadData) return [];

    const driver1PosList = isQualifying ? headToHeadData.driver1QualifyingPosList : headToHeadData.driver1RacePosList;
    const driver2PosList = isQualifying ? headToHeadData.driver2QualifyingPosList : headToHeadData.driver2RacePosList;

    return Object.keys(driver1PosList).map((raceName) => {
      const driver1Pos = driver1PosList[raceName];
      const driver2Pos = driver2PosList[raceName];
  
      return {
        race: raceName,
        [headToHeadData.driver1Code]: driver1Pos ? parseInt(driver1Pos) : null,
        [headToHeadData.driver2Code]: driver2Pos ? parseInt(driver2Pos) : null,
      };
    });
  }, [headToHeadData, isQualifying]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 20, right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
        <XAxis tick={<CustomizedXAxisTick />} />
        <YAxis reversed={true} domain={[1, 'dataMax']} />
        <Tooltip 
          labelFormatter={(name) => chartData[name] && chartData[name].race ? chartData[name].race : name} 
          formatter={(value) => `P${value}`}
        />
        <Legend verticalAlign="top" height={32} />
        <Line type="monotone" dataKey={headToHeadData.driver1Code} stroke={`#${teamColor}`} connectNulls={true}/>
        <Line type="monotone" dataKey={headToHeadData.driver2Code} stroke={lightenColor(teamColor)} connectNulls={true}/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PositionsComparisonChart;