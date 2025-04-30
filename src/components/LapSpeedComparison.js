import React, { useEffect, useRef, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Scatter,
    ScatterChart,
} from "recharts";
import LapTrackChart from "./LapTrackChart";

const gapConvertion = (driver1LapData, driver2LapData) => {
    const timeToSeconds = (time) => {
        const [minutes, seconds] = time.split(":");
        const [sec, ms] = seconds.split(".");
        return parseInt(minutes) * 60 + parseFloat(`${sec}.${ms}`);
      };
      
      // Function to convert total seconds back into "mm:ss.sss" format
      const secondsToTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = (seconds % 60).toFixed(3); // To get milliseconds as well
        return `${minutes}:${remainingSeconds.padStart(6, "0")}`; // Ensures format is consistent
      };
      
      // Calculate the gap in time between the two lap times
      const driver1TimeInSeconds = timeToSeconds(driver1LapData?.fastestLapTime);
      const driver2TimeInSeconds = timeToSeconds(driver2LapData?.fastestLapTime);
      
      const gapInSeconds = driver1TimeInSeconds - driver2TimeInSeconds;
      
      // Convert the gap back to "mm:ss.sss" format
      return secondsToTime(Math.abs(gapInSeconds));
}

const LapSpeedComparison = ({ driver1LapData, driver2LapData }) => {
    const [driver1SpeedData, setDriver1SpeedData] = useState([]);
    const [driver2SpeedData, setDriver2SpeedData] = useState([]);
    const [longestLapDuration, setLongestLapDuration] = useState(0);
    const [activeCoordinates, setActiveCoordinates] = useState(null);  // Track the active tooltip index
    const [deltaData, setDeltaData] = useState([]);

    const lastActiveCoordinatesRef = useRef(null);


    // Function to fetch lap data (speed during a specific lap for a given driver)
    const fetchLapData = async (driverNumber, lapNumber, sessionKey) => {
        try {
            const lapStartResponse = await fetch(
                `https://api.openf1.org/v1/laps?driver_number=${driverNumber}&lap_number=${lapNumber}&session_key=${sessionKey}`
            );
            const lapStartData = await lapStartResponse.json();
            const lapStartTime = lapStartData[0]?.date_start;
            const lapDuration = lapStartData[0]?.lap_duration;

            const lapStartTimestamp = new Date(lapStartTime).getTime(); // Convert lapStartTime to timestamp (milliseconds)
            const lapEndTimestamp = lapStartTimestamp + lapDuration * 1000; // Add lap duration (converted to milliseconds)

            // Update the longest lap duration
            setLongestLapDuration((prev) => Math.max(prev, lapDuration));

            // Fetch the car data within the lap timeframe
            const carDataResponse = await fetch(
                `https://api.openf1.org/v1/car_data?driver_number=${driverNumber}&session_key=${sessionKey}`
            );
            const carData = await carDataResponse.json();

            // Find the closest timestamp that is greater than or equal to lapEndTime
            let closestEndTime = carData.find(
                (item) => new Date(item.date).getTime() >= lapEndTimestamp
            );
            // If no timestamp is greater than or equal to lapEndTime, use the last available timestamp
            if (!closestEndTime) {
                closestEndTime = carData[carData.length - 1];
            }
            const adjustedLapEndTime = new Date(
                closestEndTime.date
            ).toISOString();

            //Fetch Car coodinates from lapStartTime to adjustedLapEndTime
            const carCoordinatesResponse = await fetch(
                `https://api.openf1.org/v1/location?session_key=${sessionKey}&driver_number=${driverNumber}&date%3E${lapStartTime}&date%3C${adjustedLapEndTime}`
            );
            const carCoordinates = await carCoordinatesResponse.json();

            // Filter car data for the time within the lap duration (using adjustedLapEndTime)
            const filteredCarData = carData.filter((data) => {
                const lapStartDate = new Date(lapStartTime).getTime();
                const dataTime = new Date(data.date).getTime();
                return (
                    dataTime >= lapStartDate &&
                    dataTime <= new Date(adjustedLapEndTime).getTime()
                ); // Filter by time range between lapStartTime and adjustedLapEndTime
            });

            // Merge telemetry data with car coordinates
            const mergedData = filteredCarData.map((item, index) => {
                // Find the closest car coordinate based on timestamp
                const closestCoordinate = carCoordinates.find(
                    (coord) =>
                        new Date(coord.date).getTime() >=
                        new Date(item.date).getTime()
                );

                return {
                    driverNumber: driverNumber,
                    lapNumber: lapNumber,
                    time: new Date(item.date).getTime() - lapStartTimestamp, // x-axis as time difference from lap start
                    speed: item.speed,
                    rpm: item.rpm,
                    n_gear: item.n_gear,
                    throttle: item.throttle,
                    brake: item.brake,
                    x: closestCoordinate?.x, // Coordinate x from car data
                    y: closestCoordinate?.y, // Coordinate y from car data
                    timestamp: closestCoordinate?.date ? new Date(closestCoordinate.date).toLocaleTimeString() : null
                };
            });

            return mergedData;
        } catch (error) {
            console.error("Error fetching lap data:", error);
            return [];
        }
    };

    // Function to calculate delta between Driver 1 and Driver 2
    const calculateDelta = () => {
        const delta = driver1SpeedData.map((driver1Data, index) => {
        const driver2Data = driver2SpeedData[index];
        
        if (driver2Data) {
            const timeDriver1 = driver1Data.time;  // Assuming time is the x-axis
            const timeDriver2 = driver2Data.time;

            // Calculate delta in seconds (Driver 2 - Driver 1)
            const deltaInSeconds = (timeDriver2 - timeDriver1) / 1000; // Convert to seconds

            return {
            time: driver1Data.time,  // Using Driver 1's time as the base for the x-axis
            delta: deltaInSeconds,   // The difference between Driver 2 and Driver 1
            };
        }
        return null;  // If there's no corresponding data for Driver 2, return null
        }).filter((entry) => entry !== null);  // Remove null values if any
        
        setDeltaData(delta);
    };

    useEffect(() => {
        calculateDelta();  // Calculate delta when the data changes
    }, [driver1LapData, driver2LapData]);


    // Fetch data for both drivers when the component mounts
    useEffect(() => {
        const getDriverLapData = async () => {
            const driver1Data = await fetchLapData(
                driver1LapData.driverNumber,
                driver1LapData.lap,
                driver1LapData.sessionKey
            );
            const driver2Data = await fetchLapData(
                driver2LapData.driverNumber,
                driver2LapData.lap,
                driver2LapData.sessionKey
            );

            setDriver1SpeedData(driver1Data);
            setDriver2SpeedData(driver2Data);
        };

        getDriverLapData();
    }, [driver1LapData, driver2LapData]);

    // Normalize times for both drivers to ensure they align on the x-axis
    const normalizeLapData = (driverData, offset = 0) => {
        return driverData.map((data, index) => ({
            ...data,
            time: data.time + offset, // Add offset to align data for both drivers
        }));
    };

    // Calculate the offset for driver 2 to align with driver 1's timeline
    const driver1Duration = driver1SpeedData.reduce(
        (acc, data) => acc + data.time,
        0
    );
    const normalizedDriver1Data = driver1SpeedData;
    // const normalizedDriver2Data = driver2SpeedData;
    
    // console.log("Driver 1 Speed Data:", driver1SpeedData);
    // console.log("Driver 2 Speed Data:", driver2SpeedData);
    const normalizedDriver2Data = normalizeLapData(
        driver2SpeedData,
        driver1Duration
    );
    
    // console.log(normalizedDriver1Data, normalizedDriver2Data)
    // Custom Tooltip Formatter
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const timeInSeconds = (label / 1000).toFixed(2); // Convert time from ms to seconds
            const driver1Value = payload[0]?.value;
            const driver2Value = payload[1]?.value;

            // Determine the metric for dynamic labels
            const metric = payload[0]?.name.split(" ")[2]; // Get the metric name (e.g., "speed", "throttle", etc.)

            let driver1Label = driver1Value;
            let driver2Label = driver2Value;
            let unit = ""; // Default unit

            // Adjust labels based on the metric type
            if (metric === "speed") {
                unit = "km/h"; // Speed is in km/h
            } else if (metric === "throttle" || metric === "brake") {
                unit = "%"; // Throttle and brake are percentages
            } else if (metric === "rpm") {
                unit = "rpm"; // RPM
            } else if (metric === "n_gear") {
                unit = "gear"; // Gear
            }

            const newCoordinates = {
                driver1Location: [
                  {
                    x: payload[0]?.payload.x,
                    y: payload[0]?.payload.y
                  }
                ],
                driver2Location: [
                  {
                    x: payload[1]?.payload.x,
                    y: payload[1]?.payload.y
                  }
                ]
              };
        
              // Update the state only if the coordinates change
              if (
                !lastActiveCoordinatesRef.current ||
                JSON.stringify(lastActiveCoordinatesRef.current) !== JSON.stringify(newCoordinates)
              ) {
                setActiveCoordinates(newCoordinates);
                lastActiveCoordinatesRef.current = newCoordinates; // Store the current active coordinates in ref
              }

            return (
                <div className="custom-tooltip bg-white p-2 rounded shadow text-[8px]">
                    <p>{`Time: ${timeInSeconds} s`}</p>

                    <div>
                        <p>{`Driver ${payload[0]?.payload.driverNumber}`}</p>
                        <p>{driver1Label ? driver1Label : "0"} ${unit}</p>
                        <p>{payload[0]?.payload.timestamp}</p>
                    </div>
                    <div>
                        <p>{`Driver ${payload[1]?.payload.driverNumber}`}</p>
                        <p>{driver1Label ? driver1Label : "0"} ${unit}</p>
                        <p>{payload[1]?.payload.timestamp}</p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // console.log("activeCoordinates:", activeCoordinates);

    const metrics = ["coordinates", "delta", "speed", "throttle", "brake", "rpm", "n_gear" ];

     // Get min and max values for X and Y to make sure the graph is adjusted
    const minX = Math.min(
        ...[...normalizedDriver1Data, ...normalizedDriver2Data].map((d) => d.x)
    );
    const minY = Math.min(
        ...[...normalizedDriver1Data, ...normalizedDriver2Data].map((d) => d.y)
    );
    const maxX = Math.max(
        ...[...normalizedDriver1Data, ...normalizedDriver2Data].map((d) => d.x)
    );
    const maxY = Math.max(
        ...[...normalizedDriver1Data, ...normalizedDriver2Data].map((d) => d.y)
    );


    const RenderNoShape = (props)=>{ 
        return null; 
       }
    
    return (
        <div>
            <h3 className="heading-4 mt-32 mb-16 text-neutral-400 ml-24">
                Lap Metrics Comparison
            </h3>
            <div className="mb-16 bg-glow-large max-sm:py-[3.2rem] sm:p-32 rounded-md sm:rounded-xlarge">
                <div>
                    <div className="text-center">
                        {driver1LapData?.driverNumber} vs {driver2LapData?.driverNumber}
                    </div>
                    <div className="text-center">
                        {driver1LapData?.fastestLapTime} vs {driver2LapData?.fastestLapTime}
                    </div>
                    <div>
                        {gapConvertion(driver1LapData, driver2LapData)}
                    </div>
                </div>
                {metrics.map((metric, index) => (
                    <div key={index}>
                        <ResponsiveContainer 
                            width="100%" 
                            height={metric === 'speed' ? 299 : metric === 'coordinates' ? 500 : 120}
                        >
                            {metric === 'coordinates' ? (
                                <ScatterChart
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    syncId="anyId"
                                    className="hide-grid"
                                >
                                    <CartesianGrid fillOpacity={0} />
                                    <XAxis
                                        type="number"
                                        dataKey="x"
                                        domain={[minX - 100, maxX + 100]} // Adjust domain for X-axis
                                        name="X Coordinate"
                                        label={{ value: "X", position: "bottom" }}
                                    />
                                    <YAxis
                                        type="number"
                                        dataKey="y"
                                        domain={[minY - 100, maxY + 100]} // Adjust domain for Y-axis
                                        name="Y Coordinate"
                                        label={{ value: "Y", angle: -90, position: "left" }}
                                    />
                                    <Tooltip cursor={false} />
                                    <Legend />
                                    <Scatter
                                        name="track"
                                        data={normalizedDriver2Data}
                                        shape={<RenderNoShape />}
                                        line={{stroke: '#333333', strokeWidth: 12}}
                                        dot={false}
                                    />
                                
                                    {/* Driver 1 Path */}
                                    <Scatter
                                        name="Driver 1"
                                        data={normalizedDriver1Data}
                                        // fill="#524f82"
                                        shape={<RenderNoShape />}  
                                        line={{stroke: '#8884d8', strokeWidth: 1}}
                                        dot={false}
                                    />
                                    {/* Driver 2 Path */}
                                    <Scatter
                                        name="Driver 2"
                                        data={normalizedDriver2Data}
                                        // fill="#4e795e"
                                        shape={<RenderNoShape />}
                                        line={{stroke: '#82ca9d', strokeWidth: 1}}
                                        dot={false}
                                    />
                                    
                                    {/* Driver 1 Active coordinates */}
                                    <Scatter
                                        name="Driver 1"
                                        data={activeCoordinates?.driver2Location}
                                        fill="#cfceef"
                                        isAnimationActive={false}
                                    />  
                                    {/* Driver 2 Active coordinates */}
                                    <Scatter
                                        name="Driver 2"
                                        data={activeCoordinates?.driver1Location}
                                        fill="#c1e5ce"
                                        isAnimationActive={false}
                                    />
                                </ScatterChart>
                            ) : metric === 'delta' ? (
                                <LineChart
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    width="100%"
                                    syncId="anyId"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="time"
                                        tickFormatter={(tick) => `${(tick / 1000).toFixed(2)}s`} // Format time in seconds
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        data={deltaData}
                                        dataKey="delta"
                                        stroke="#8884d8"
                                        name="Driver 2 Delta"
                                        isAnimationActive={false}
                                        dot={false}
                                    />
                                </LineChart>
                            ) : (                           
                                <LineChart
                                    margin={{ top: 20, right: 30 }}
                                    width="100%"
                                    syncId="anyId"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="time"
                                        tickFormatter={(tick) =>
                                            `${(tick / 1000).toFixed(2)}s`
                                        } // Format time in seconds
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        content={<CustomTooltip />} 
                                    />
                                    {metric === 'speed' && <Legend className="text-xs" verticalAlign="top" height={32} />}
                                    {/* Driver 1 Metric Line */}
                                    <Line
                                        type="monotone"
                                        data={normalizedDriver1Data}
                                        dataKey={metric}
                                        stroke="#8884d8"
                                        name={`Driver 1 ${metric}`}
                                        isAnimationActive={false}
                                        dot={false}
                                    />
                                    {/* Driver 2 Metric Line */}
                                    <Line
                                        type="monotone"
                                        data={normalizedDriver2Data}
                                        dataKey={metric}
                                        stroke="#82ca9d"
                                        name={`Driver 2 ${metric}`}
                                        isAnimationActive={false}
                                        dot={false}
                                    />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LapSpeedComparison;
