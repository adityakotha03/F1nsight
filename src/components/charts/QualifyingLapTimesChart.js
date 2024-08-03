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

const CustomizedYAxisTick = ({ x, y, payload }) => {
  const minutes = Math.floor(payload.value / 60);
  const seconds = Math.floor(payload.value % 60);
  const milliseconds = Math.round((payload.value - Math.floor(payload.value)) * 1000);
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#f1f1f1"
        transform="rotate(-15) translate(-8,-12)"
        fontSize={10}
      >
        {`${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`}
      </text>
    </g>
  );
};

export const QualifyingLapTimesChart = ({ headToHeadData, teamColor }) => {
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
          [headToHeadData.driver1Code]: bestTime1 ? convertToSeconds(bestTime1) : null,
          [headToHeadData.driver2Code]: bestTime2 ? convertToSeconds(bestTime2) : null,
        };
      }
      return null;
    }).filter(item => item !== null);
  }, [headToHeadData]);

  const yAxisLimits = useMemo(() => {
    if (!chartData.length) return [0, 10]; // default values if no data
    let allValues = chartData.flatMap(data => Object.values(data).filter(val => typeof val === 'number'));
    let minVal = Math.min(...allValues);
    let maxVal = Math.max(...allValues);
    let padding = (maxVal - minVal) * 0.1; // 10% padding
    return [minVal - padding, maxVal + padding];
  }, [chartData]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart width={730} height={250} data={chartData} margin={{ top: 20, right: 30 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={darkenColor(teamColor)} stopOpacity={1}/>
            <stop offset="95%" stopColor={darkenColor(teamColor)} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={lightenColor(teamColor)} stopOpacity={1}/>
            <stop offset="95%" stopColor={lightenColor(teamColor)} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
        <XAxis tick={<CustomizedXAxisTick />} />
        <YAxis
          domain={yAxisLimits}
          tick={<CustomizedYAxisTick />}
        />
        <Tooltip
          labelFormatter={(name) => chartData[name] ? chartData[name].race : name}
          formatter={(value) => {
            const minutes = Math.floor(value / 60);
            const totalSeconds = (value % 60);
            const seconds = Math.floor(totalSeconds);
            const milliseconds = Math.round((totalSeconds - seconds) * 1000);
            return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
          }}
        />
        <Legend verticalAlign="top" height={32} />
        <Bar dataKey={headToHeadData.driver1Code} fillOpacity={1} fill={darkenColor(teamColor)} connectNulls={true} />
        <Bar dataKey={headToHeadData.driver2Code} fillOpacity={1} fill={lightenColor(teamColor)} connectNulls={true} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default QualifyingLapTimesChart;