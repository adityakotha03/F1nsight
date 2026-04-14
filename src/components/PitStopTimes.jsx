import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { fetchPitStops } from '../utils/api';

const STOP_COLORS = {
  1: '#3B82F6', // Blue
  2: '#EF4444', // Red
  3: '#10B981', // Green
  4: '#F59E0B', // Orange
  5: '#EC4899', // Pink
  6: '#6B7280', // Grey
};

const FASTEST_COLOR = '#A855F7'; // Purple

export const PitStopTimes = ({
  sessionKey,
  raceResults,
  driversDetails,
  driversColor,
  driverCode,
  showTitle = true,
}) => {
  const [pitData, setPitData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPitData = async () => {
      if (!sessionKey) return;
      setIsLoading(true);
      try {
        const data = await fetchPitStops(sessionKey);
        setPitData(data);
      } catch (error) {
        console.error('Error fetching pit data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getPitData();
  }, [sessionKey]);

  const sortedDriverAcronyms = useMemo(() => {
    return (raceResults || [])
      .sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10))
      .map((result) => result.Driver.code);
  }, [raceResults]);

  const chartData = useMemo(() => {
    if (!pitData.length || !driversDetails) return [];

    const sortedPits = [...pitData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const seen = new Set();
    const uniquePits = sortedPits.filter(pit => {
      const acronym = driversDetails[pit.driver_number];
      if (!acronym || !sortedDriverAcronyms.includes(acronym)) return false;
      const key = `${pit.driver_number}-${pit.lap_number}`;
      if (seen.has(key) || pit.pit_duration < 15) return false;
      seen.add(key);
      return true;
    });

    const stopsByDriver = {};
    const formattedData = uniquePits.map((pit) => {
      const acronym = driversDetails[pit.driver_number];
      if (!stopsByDriver[acronym]) stopsByDriver[acronym] = 0;
      stopsByDriver[acronym]++;
      const yIndex = sortedDriverAcronyms.indexOf(acronym);

      return {
        acronym,
        duration: pit.pit_duration,
        stopNumber: stopsByDriver[acronym],
        lap: pit.lap_number,
        y: yIndex,
      };
    }).filter((item) => item !== null && item.y !== -1);

    // Identify fastest pit stop
    const minDur = Math.min(...formattedData.map(d => d.duration));
    const finalData = formattedData.map(d => ({
      ...d,
      isFastest: d.duration === minDur
    }));

    if (driverCode) {
      return finalData.filter((item) => item.acronym === driverCode);
    }
    return finalData;
  }, [pitData, driversDetails, driverCode, sortedDriverAcronyms]);

  const displayAcronyms = driverCode
    ? sortedDriverAcronyms.filter((a) => a === driverCode)
    : sortedDriverAcronyms;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip bg-slate-900 border border-slate-700 p-16 rounded shadow-lg z-50">
          <p className="font-display text-white text-md mb-4">{`${data.acronym}: ${data.duration.toFixed(3)}s`}</p>
          <p className="text-xs text-slate-400 font-display uppercase">{`Stop ${data.stopNumber} - Lap ${data.lap}`}</p>
          {data.isFastest && <p className="text-[10px] text-purple-400 font-display uppercase mt-4">Fastest Pit Stop</p>}
        </div>
      );
    }
    return null;
  };

  const Legend = () => (
    <div className="flex flex-col gap-12 w-[110px] sm:w-[130px] shrink-0 border-l border-slate-800 pl-16 sm:pl-24 ml-16 sm:ml-24">
      <h3 className="text-xs font-display uppercase text-white tracking-widest mb-4">Pit Stop Legend</h3>
      {Object.entries(STOP_COLORS).map(([num, color]) => (
        <div key={num} className="flex items-center gap-8">
          <div
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-[10px] text-neutral-400 font-display uppercase whitespace-nowrap">{`Stop ${num}`}</span>
        </div>
      ))}
      <div className="flex items-center gap-8 mt-8 pt-8 border-t border-slate-800">
        <div
          className="w-10 h-10 rounded-full border-2"
          style={{ borderColor: FASTEST_COLOR, backgroundColor: 'transparent' }}
        />
        <span className="text-[10px] text-purple-400 font-display uppercase leading-tight">Fastest Pit Stop</span>
      </div>
    </div>
  );

  const yTicks = useMemo(() => {
    return displayAcronyms.map(acronym => sortedDriverAcronyms.indexOf(acronym));
  }, [displayAcronyms, sortedDriverAcronyms]);

  if (isLoading && pitData.length === 0) return null;
  if (!isLoading && chartData.length === 0) return null;

  return (
    <div className={classNames("bg-glow-dark p-16 sm:p-32 rounded-md sm:rounded-xlarge relative overflow-hidden", { "mb-32": showTitle })}>
      {showTitle && (
        <div className="flex flex-col gap-4 mb-24 relative z-10">
          <h2 className="heading-3 gradient-text-light uppercase tracking-sm">Pit Stop Times</h2>
          <div className="w-full h-2 bg-red-600 rounded-full" />
        </div>
      )}

      <div className="flex flex-row items-stretch">
        <div className="grow min-w-0" style={{ height: Math.max(displayAcronyms.length * 40 + 100, 400) }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 10, bottom: 40, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={true} horizontal={true} />
              <XAxis
                type="number"
                dataKey="duration"
                name="Time"
                unit="s"
                stroke="#A0AEC0"
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
                label={{ value: 'Time (s)', position: 'bottom', fill: '#A0AEC0', offset: 20 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Driver"
                stroke="#A0AEC0"
                axisLine={false}
                tickLine={false}
                ticks={yTicks}
                domain={[Math.min(...yTicks), Math.max(...yTicks)]}
                reversed={true}
                interval={0}
                width={50}
                tickFormatter={(index) => sortedDriverAcronyms[index]}
                label={{ value: 'Drivers', angle: -90, position: 'insideLeft', fill: '#A0AEC0', offset: -10 }}
              />
              <ZAxis type="number" range={[140, 140]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="Pit Stops" data={chartData}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STOP_COLORS[entry.stopNumber] || STOP_COLORS[6]}
                    stroke={entry.isFastest ? FASTEST_COLOR : "none"}
                    strokeWidth={entry.isFastest ? 3 : 0}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <Legend />
      </div>
    </div>
  );
};

PitStopTimes.propTypes = {
  sessionKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  raceResults: PropTypes.array,
  driversDetails: PropTypes.object,
  driversColor: PropTypes.object,
  driverCode: PropTypes.string,
  showTitle: PropTypes.bool,
};

export default PitStopTimes;
