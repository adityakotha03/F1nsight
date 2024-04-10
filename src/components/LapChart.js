import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const LapChart = (props) => {
    const { className, laps, driversDetails, raceResults } = props;

    // Initialize visibility state for drivers
    const [driverVisibility, setDriverVisibility] = useState({});

    const sortedDriverAcronyms = raceResults
    .sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10))
    .map(result => result.Driver.code);
    
    useEffect(() => {
        const initialVisibility = {};
        sortedDriverAcronyms.forEach((acronym, index) => {
            initialVisibility[acronym] = index < 3; // Only the top 3 drivers are visible initially
        });
        setDriverVisibility(initialVisibility);
    }, [laps, driversDetails]);    

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

    return (
        <div style={{ width: '100%', height: 300 }} className="mb-64">
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid stroke="#ccc" strokeDasharray="0" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[minYAxisValue, maxYAxisValue]} />
                    <Tooltip contentStyle={{ backgroundColor: '#000000', borderColor: '#000000' }} />
                    <Legend />
                    {[...new Set(laps.map(lap => driversDetails[lap.driver_number]))].map((acronym, index) => (
                        driverVisibility[acronym] && <Line key={index} type="monotone" dataKey={acronym} stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-2 mt-4">
                {sortedDriverAcronyms.map((acronym, index) => (
                    <button
                        key={index}
                        className={`py-1 px-4 text-white font-semibold rounded ${driverVisibility[acronym] ? 'bg-green-500' : 'bg-red-500'}`}
                        onClick={() => handleDriverVisibilityChange(acronym)}
                    >
                        {acronym}
                    </button>
                ))}
            </div>
        </div>
    );
};

LapChart.propTypes = {
    className: PropTypes.string,
    laps: PropTypes.array,
    setLaps: PropTypes.func,
    driversDetails: PropTypes.object
};