import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const LineChartByYear = ({ driver1Name, driver2Name, driver1Data, driver2Data, competingYears, displayCompetingYears, type, raceNamesByYear }) => {
  const [selectedYear, setSelectedYear] = useState(competingYears[0]);

  useEffect(() => {
    if (competingYears.length > 0) {
      setSelectedYear(competingYears[0]);
    }
  }, [competingYears]);

  if (!displayCompetingYears) {
    return null;
  }

  const getPositionData = (year) => {
    const driver1Positions = driver1Data[year]?.positions || {};
    const driver2Positions = driver2Data[year]?.positions || {};
    
    const races = raceNamesByYear[year] && raceNamesByYear[year].length > 0 ? raceNamesByYear[year] : Object.keys(driver1Positions); // Use race names if available

    const data = races.map(race => ({
      race,
      [driver1Name]: driver1Positions[race] ? parseInt(driver1Positions[race], 10) : undefined,
      [driver2Name]: driver2Positions[race] ? parseInt(driver2Positions[race], 10) : undefined,
    })).filter(data => data[driver1Name] !== undefined || data[driver2Name] !== undefined); // Exclude entries with no data

    return data.map(data => ({
      race: data.race,
      [driver1Name]: data[driver1Name] !== undefined ? data[driver1Name] : 'DNP', // Default to Did not pariticpate (DNP) if not found
      [driver2Name]: data[driver2Name] !== undefined ? data[driver2Name] : 'DNP', 
    }));
  };

  const getCumulativePointsData = (year) => {
    const driver1Points = driver1Data[year]?.pos || {};
    const driver2Points = driver2Data[year]?.pos || {};
    
    const races = raceNamesByYear[year] && raceNamesByYear[year].length > 0 ? raceNamesByYear[year] : Object.keys(driver1Points); // Use race names if available

    const data = races.map(race => ({
      race,
      [driver1Name]: driver1Points[race]?.points || undefined,
      [driver2Name]: driver2Points[race]?.points || undefined,
    })).filter(data => data[driver1Name] !== undefined || data[driver2Name] !== undefined); // Exclude entries with no data

    return data.map(data => ({
      race: data.race,
      [driver1Name]: data[driver1Name] !== undefined ? data[driver1Name] : 'DNP', 
      [driver2Name]: data[driver2Name] !== undefined ? data[driver2Name] : 'DNP', 
    }));
  };

  const positionData = getPositionData(selectedYear);
  const cumulativePointsData = getCumulativePointsData(selectedYear);

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
          GP {payload.index + 1}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-glow-large rounded-lg mb-96 p-8 md:px-32 md:pt-16 md:pb-32">
      <div className="flex justify-center flex-wrap">
        {competingYears.map(year => (
          <button key={year} onClick={() => setSelectedYear(year)} className={classNames("py-4 px-8 rounded", year === selectedYear ? 'bg-glow-sm' : '')}>
            {year}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={type === 'position' ? positionData : cumulativePointsData} margin={{ top: 20, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
          <XAxis dataKey="race" tick={<CustomizedXAxisTick />} />
          <YAxis reversed={type === 'position'} domain={[1, 'dataMax']} />
          <Tooltip 
            labelFormatter={(name) => name} 
            formatter={(value) => {
              if (value === 'DNP') {
                return 'DNP';
              }
              return type === 'position' ? `P${value}` : `${value} points`;
            }}
          />
          <Legend verticalAlign="top" height={32} />
          <Line type="monotone" dataKey={driver1Name} stroke="#8884d8" connectNulls={true}/>
          <Line type="monotone" dataKey={driver2Name} stroke="#82ca9d" connectNulls={true}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};