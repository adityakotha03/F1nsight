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

export const LapChart = (props) => {
    const { laps, driversDetails, driversColor, raceResults, driverCode } = props;

    // Initialize visibility state for drivers
    const [driverVisibility, setDriverVisibility] = useState({});
    const [newDriversColor, setnewDriversColor] = useState({});

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

        const newDriversColor = {};
        const colorCount = {};

        Object.entries(driversColor).forEach(([id, color]) => {
            // Increase the count or initialize if first occurrence
            if (!colorCount[color]) {
                colorCount[color] = { count: 1, indexModified: false };
                newDriversColor[id] = `#${color}`; // Use original color on first occurrence
            } else {
                colorCount[color].count++;

                // Modify color only if it's the second time we've encountered this color
                if (!colorCount[color].indexModified) {
                    newDriversColor[id] = lightenColor(color, 30); 
                    colorCount[color].indexModified = true; 
                } else {
                    newDriversColor[id] = {color}; 
                }
            }
        });

        setnewDriversColor(newDriversColor);

    }, [laps, driversDetails, driverCode, driversColor]);


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
                        if (!isNaN(lapDurationInSeconds) && lapDurationInSeconds > 0 && lapDurationInSeconds <= 180 && lapDurationInSeconds >= lowerBound && lapDurationInSeconds <= upperBound) {
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
        <>
        <h3 className="heading-4 mt-32 mb-16 text-neutral-400 ml-24">Lap Data</h3>
        <div className="mb-16 bg-glow-large max-sm:py-[3.2rem] sm:p-32 rounded-md sm:rounded-xlarge">
            <ResponsiveContainer width="100%" height={299}>
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30 }}
                    width="100%"
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
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
                    />
                    {[...new Set(laps.map(lap => driversDetails[lap.driver_number]))].map((acronym, index) => (
                        driverVisibility[acronym] && <Line key={index} type="monotone" dataKey={acronym} stroke={`${newDriversColor[acronym]}`} connectNulls={true} />
                    ))}
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

LapChart.propTypes = {
    className: PropTypes.string,
    laps: PropTypes.array,
    setLaps: PropTypes.func,
    driversDetails: PropTypes.object
};
