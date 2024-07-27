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

export const QualifyingLapTimesDeltaChart = ({ headToHeadData, teamColor }) => {
  const chartData = useMemo(() => {
    if (!headToHeadData) return [];
    return headToHeadData.driver1QualifyingTimes.map((q) => {
      const driver2Race = headToHeadData.driver2QualifyingTimes.find(r => r.race === q.race);
      if (driver2Race && driver2Race.race === q.race) {
        const getTime = (times) => {
          const validTimes = times.filter(t => t !== 'N/A');
          if (validTimes.length === 3) return validTimes[2];
          if (validTimes.length === 2) return validTimes[1];
          if (validTimes.length === 1) return validTimes[0];
          return null;
        };

        const convertToSeconds = (time) => {
          const [minutes, seconds] = time.split(':');
          const [secs, millis] = seconds.split('.');
          return parseInt(minutes) * 60 + parseInt(secs) + parseInt(millis) / 1000;
        };

        const bestTime1 = getTime(q.QualiTimes);
        const bestTime2 = getTime(driver2Race.QualiTimes);

        return { 
          race: q.race,
          [headToHeadData.driver1Code]: bestTime1 && bestTime2 ? Math.max(convertToSeconds(bestTime1) - convertToSeconds(bestTime2), 0) : null,
          [headToHeadData.driver2Code]: bestTime1 && bestTime2 ? Math.min(convertToSeconds(bestTime1) - convertToSeconds(bestTime2), 0) : null,
        };        
      }
      return null;
    }).filter(item => item !== null);
  }, [headToHeadData]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart width={730} height={250} data={chartData} margin={{ top: 20, right: 30 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={`#${teamColor}`} stopOpacity={1}/>
            <stop offset="95%" stopColor={`#${teamColor}`} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={lightenColor(teamColor)} stopOpacity={1}/>
            <stop offset="95%" stopColor={lightenColor(teamColor)} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
        <XAxis tick={<CustomizedXAxisTick />} />
        <YAxis 
          tickFormatter={(value) => value >= 0 ? `${value}` : `${Math.abs(value)}`}
        />
        <Tooltip
          labelFormatter={(name) => chartData[name] ? chartData[name].race : name}
          formatter={(value) => value === 0 ? 'Leader' : `+${Math.abs(value).toFixed(3)}`}
        />
        <Legend verticalAlign="top" height={32} />
        <Bar dataKey={headToHeadData.driver1Code} fillOpacity={1} fill={darkenColor(teamColor)} connectNulls={true} />
        <Bar dataKey={headToHeadData.driver2Code} fillOpacity={1} fill={lightenColor(teamColor)} connectNulls={true} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default QualifyingLapTimesDeltaChart;