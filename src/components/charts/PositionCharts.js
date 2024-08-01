import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const lightenColor = (color, percent) => {
    let num = parseInt(color, 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;

    return '#' + (
        0x1000000 +
        (R < 255 ? R : 255) * 0x10000 +
        (G < 255 ? G : 255) * 0x100 +
        (B < 255 ? B : 255)
    ).toString(16).slice(1);
};

export const PositionCharts = ({ laps, pos, startGrid, driversDetails, driversColor, raceResults, driverCode }) => {
  const [chartData, setChartData] = useState([]);
  const [newDriversColor, setnewDriversColor] = useState({});
  const [driverVisibility, setDriverVisibility] = useState({});

  const sortedDriverAcronyms = raceResults
    .sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10))
    .map(result => result.Driver.code);

  useEffect(() => {
    const initialVisibility = {};
    sortedDriverAcronyms.forEach((acronym, index) => {
        initialVisibility[acronym] = driverCode ? (acronym === driverCode) : (index < 3);
    });
    setDriverVisibility(prevVisibility => ({ ...prevVisibility, ...initialVisibility }));

    const positionData = {};
    const newDriversColor = {};
    const colorCount = {};

    Object.entries(driversColor).forEach(([id, color]) => {
        if (!colorCount[color]) {
            colorCount[color] = { count: 1, indexModified: false };
            newDriversColor[id] = `#${color}`;
        } else {
            colorCount[color].count++;
            if (!colorCount[color].indexModified) {
                newDriversColor[id] = lightenColor(color, 30);
                colorCount[color].indexModified = true;
            } else {
                newDriversColor[id] = color;
            }
        }
    });

    setnewDriversColor(newDriversColor);

    if (!laps || laps.length < 2) {
      setChartData([]);
      return;
    }

    // Initialize positions with starting grid
    startGrid.forEach(entry => {
      positionData[entry.driver_number] = [{ lap: 2, position: entry.position }];
    });

    // Process position changes
    pos.forEach(posChange => {
      if (posChange.date && posChange.driver_number) {
        const changeTime = new Date(posChange.date);
        const driverLapTimes = laps.filter(lap => lap.driver_number === posChange.driver_number && lap.date_start);
        let lapNumber = 2; // Start lap number from 2
        
        for (let i = 0; i < driverLapTimes.length; i++) {
          const lapStartTime = new Date(driverLapTimes[i].date_start);
          if (changeTime < lapStartTime) {
            break;
          }
          lapNumber = driverLapTimes[i].lap_number;
        }

        if (!positionData[posChange.driver_number]) {
          positionData[posChange.driver_number] = [];
        }

        positionData[posChange.driver_number].push({
          lap: lapNumber,
          position: posChange.position
        });
      }
    });

    // Create final data structure
    const newChartData = [];
    const totalLaps = Math.max(...laps.map(lap => lap.lap_number));

    for (let lap = 2; lap <= totalLaps; lap++) {
      const lapData = { lap };
      Object.keys(positionData).forEach(driverNumber => {
        const lastPosition = positionData[driverNumber]
          .filter(p => p.lap <= lap)
          .slice(-1)[0];
        if (lastPosition) {
          lapData[driverNumber] = lastPosition.position;
        }
      });
      newChartData.push(lapData);
    }

    setChartData(newChartData);
  }, [laps, pos, startGrid, driversColor, raceResults, driverCode]);

  const renderLines = () => {
    if (!driversDetails || Object.keys(driversDetails).length === 0) return null;

    return Object.keys(driversDetails).map(driverNumber => (
      driverVisibility[driversDetails[driverNumber]] && (
        <Line
          key={driverNumber}
          type="linear"
          dataKey={driverNumber}
          stroke={`${newDriversColor[driversDetails[driverNumber]]}`}
          dot={false}
          connectNulls={true}
        />
      )
    ));
  };

  const getYAxisLabels = () => {
    const labels = {};
    startGrid.forEach(entry => {
      labels[entry.position] = driversDetails[entry.driver_number];
    });
    return labels;
  };

  const yAxisLabels = getYAxisLabels();

  const handleDriverVisibilityChange = (acronym) => {
    setDriverVisibility(prevState => ({
        ...prevState,
        [acronym]: !prevState[acronym]
    }));
  };

  return (
    <>
      <h3 className="heading-4 mb-16 text-neutral-400 ml-24">Lap Data</h3>
      <div className="mb-16 bg-glow-large max-sm:py-[3.2rem] sm:p-32 rounded-xlarge">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="lap" label={{ value: 'Lap', position: 'insideBottomRight', offset: 0 }} />
            <YAxis
              reversed
              type="number"
              interval={0}
              domain={[1, startGrid.length]}
              ticks={startGrid.map(entry => entry.position)}
              tickFormatter={tick => yAxisLabels[tick]}
              label={{ value: 'Position', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value, name) => [`P${value}`, driversDetails[name]]}
              labelFormatter={(label) => `Lap ${label}`}
            />
            {renderLines()}
          </LineChart>
        </ResponsiveContainer>
        {driverCode == null && (
          <div className="flex flex-wrap justify-center gap-4 mt-4 sm:max-w-[80%] sm:mx-auto">
            {sortedDriverAcronyms.map((acronym, index) => (
              <button
                key={index}
                className={`py-1 px-4 text-white font-semibold rounded font-display`}
                onClick={() => handleDriverVisibilityChange(acronym)}
                style={{backgroundColor: driverVisibility[acronym] ? `${newDriversColor[acronym]}` : '#333333'}}
              >
                {acronym}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

PositionCharts.propTypes = {
  laps: PropTypes.array.isRequired,
  pos: PropTypes.array.isRequired,
  startGrid: PropTypes.array.isRequired,
  driversDetails: PropTypes.object.isRequired,
  driversColor: PropTypes.object.isRequired,
  raceResults: PropTypes.array.isRequired,
  driverCode: PropTypes.string,
};

export default PositionCharts;