import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const LapChart = (props) => {
    const { className, laps, setLaps, driversDetails } = props;

    const prepareChartData = () => {
        const driverAcronyms = [...new Set(laps.map(lap => driversDetails[lap.driver_number]))];
        const lapNumbers = [...new Set(laps.map(lap => lap.lap_number))].sort((a, b) => a - b);
      
        return lapNumbers.map(lapNumber => {
          const lapDataForAllDrivers = { name: `Lap ${lapNumber}` };
      
          driverAcronyms.forEach(acronym => {
            const lapForDriver = laps.find(lap => lap.lap_number === lapNumber && driversDetails[lap.driver_number] === acronym);
            if (lapForDriver && !isNaN(lapForDriver.lap_duration) && parseFloat(lapForDriver.lap_duration) > 0) {
              lapDataForAllDrivers[acronym] = parseFloat(lapForDriver.lap_duration);
            }
          });
      
          return Object.keys(lapDataForAllDrivers).length > 1 ? lapDataForAllDrivers : null;
        }).filter(lapData => lapData !== null);
    };
      
    const chartData = prepareChartData();
    
    // Determine the minimum and maximum lap durations, with a buffer for the Y-axis domain
    const minLapDuration = Math.min(...chartData.flatMap(lap => Object.values(lap).slice(1)));
    const maxLapDuration = Math.max(...chartData.flatMap(lap => Object.values(lap).slice(1)));
    const yAxisPadding = (maxLapDuration - minLapDuration) * 0.05; // 5% padding for example
    // Calculate adjusted domain values with 3 decimal places
    const minYAxisValue = parseFloat((minLapDuration - yAxisPadding).toFixed(3));
    const maxYAxisValue = parseFloat((maxLapDuration + yAxisPadding).toFixed(3));

    const handleLapsChartLegendClick = (e) => {
        // TODO: Implement logic to toggle visibility of driver data. lets only show the P1 - P3 drivers by default
        console.log(e.dataKey);
    }

    return (
        <div style={{ width: '100%', height: 300 }} className="mb-64">
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[minYAxisValue, maxYAxisValue]} />
                    <Tooltip />
                    <Legend onClick={(e) => handleLapsChartLegendClick(e)} />
                    {[...new Set(laps.map(lap => lap.driver_acronym))].map((acronym, index) => (
                        <Line key={index} type="monotone" dataKey={acronym} stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

LapChart.propTypes = {
    className: PropTypes.string,
    laps: PropTypes.array,
    setLaps: PropTypes.func,
    driversDetails: PropTypes.object
};