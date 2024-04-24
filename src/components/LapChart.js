import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const LapChart = (props) => {
    const { className, laps, driversDetails, driversColor, raceResults, driverCode } = props;

    // Initialize visibility state for drivers
    const [driverVisibility, setDriverVisibility] = useState({});

    const sortedDriverAcronyms = raceResults
        .sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10))
        .map(result => result.Driver.code);

    useEffect(() => {
        const initialVisibility = {};
        sortedDriverAcronyms.forEach((acronym, index) => {
            // Conditionally set visibility based on driverCode
            initialVisibility[acronym] = driverCode ? (acronym === driverCode) : (index < 3);
        });
        setDriverVisibility(initialVisibility);
    }, [laps, driversDetails, driverCode]);

    // const sessionKey = laps[0].session_key

    const prepareChartData = () => {
        const driverAcronyms = [...new Set(laps.map(lap => driversDetails[lap.driver_number]))];
        const lapNumbers = [...new Set(laps.map(lap => lap.lap_number))].sort((a, b) => a - b);
    
        // Step 1: Gather all valid lap durations in seconds
        let lapDurations = [];
        laps.forEach(lap => {
            const lapDuration = parseFloat(lap.lap_duration);
            if (!isNaN(lapDuration) && lapDuration > 0) {
                lapDurations.push(lapDuration);
            }
        });
    
        // Step 2: Calculate Q1, Q3, and IQR
        lapDurations.sort((a, b) => a - b);
        const q1 = lapDurations[Math.floor((lapDurations.length / 4))];
        const q3 = lapDurations[Math.floor((lapDurations.length * 3) / 4)];
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
    
        return lapNumbers.map(lapNumber => {
            const lapDataForAllDrivers = { name: `Lap ${lapNumber}` };
    
            driverAcronyms.forEach(acronym => {
                if (!driverCode || acronym === driverCode) {
                    const lapForDriver = laps.find(lap => lap.lap_number === lapNumber && driversDetails[lap.driver_number] === acronym);
                    if (lapForDriver) {
                        const lapDurationInSeconds = parseFloat(lapForDriver.lap_duration);
                        if (!isNaN(lapDurationInSeconds) && lapDurationInSeconds > 0 && lapDurationInSeconds >= lowerBound && lapDurationInSeconds <= upperBound) {
                            // Convert lap duration from seconds to minutes and exclude outliers
                            lapDataForAllDrivers[acronym] = (lapDurationInSeconds / 60).toFixed(5);
                        }
                    }
                }
            });
    
            return Object.keys(lapDataForAllDrivers).length > 1 ? lapDataForAllDrivers : null;
        }).filter(lapData => lapData !== null);
    };
    
    const chartData = prepareChartData();
    
    const minLapDuration = Math.min(...chartData.flatMap(lap => Object.values(lap).slice(1)));
    const maxLapDuration = Math.max(...chartData.flatMap(lap => Object.values(lap).slice(1)));
    const yAxisPadding = (maxLapDuration - minLapDuration) * 0.05;
    const minYAxisValue = parseFloat((minLapDuration - yAxisPadding).toFixed(3));
    const maxYAxisValue = parseFloat((maxLapDuration + yAxisPadding).toFixed(3));
       

    const handleDriverVisibilityChange = (acronym) => {
        setDriverVisibility(prevState => ({
            ...prevState,
            [acronym]: !prevState[acronym]
        }));
    };

    const formatMinutes = (decimalMinutes) => {
        const minutes = Math.floor(decimalMinutes);
        const seconds = Math.round((decimalMinutes - minutes) * 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ width: '100%', height: 300}} className="mb-64">
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[minYAxisValue, maxYAxisValue]} tickFormatter={formatMinutes} />
                    <Tooltip 
                    formatter={(value) => {
                        const decimalMinutes = parseFloat(value);
                        const minutes = Math.floor(decimalMinutes);
                        const totalSeconds = (decimalMinutes - minutes) * 60;
                        const seconds = Math.floor(totalSeconds);
                        const milliseconds = Math.round((totalSeconds - seconds) * 1000);
                    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
                    }}
                    contentStyle={{ backgroundColor: '#000000', borderColor: '#000000' }} 
                    />
                    {/*<Legend />*/}
                    {[...new Set(laps.map(lap => driversDetails[lap.driver_number]))].map((acronym, index) => (
                        driverVisibility[acronym] && <Line key={index} type="monotone" dataKey={acronym} stroke={`#${driversColor[acronym]}`} connectNulls={true} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            {driverCode == null && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {sortedDriverAcronyms.map((acronym, index) => (
                        <button
                            key={index}
                            className={`py-1 px-4 text-white font-semibold rounded`}
                            onClick={() => handleDriverVisibilityChange(acronym)}
                            style={{backgroundColor: driverVisibility[acronym] ? `#${driversColor[acronym]}` : '#333333'}}
                        >
                            {acronym}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

LapChart.propTypes = {
    className: PropTypes.string,
    laps: PropTypes.array,
    setLaps: PropTypes.func,
    driversDetails: PropTypes.object
};
