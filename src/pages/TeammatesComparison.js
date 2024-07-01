import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Legend, Bar, ComposedChart } from 'recharts';
import axios from 'axios';

import { fetchDriverStats } from '../utils/api';
import { lightenColor } from '../utils/lightenColor';
import { HeadToHeadChart, Select, Loading } from '../components';

export const TeammatesComparison = () => {
  const [year, setYear] = useState('');
  const [team, setTeam] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver1, setSelectedDriver1] = useState('');
  const [selectedDriver2, setSelectedDriver2] = useState('');
  const [headToHeadData, setHeadToHeadData] = useState(null);
  const [showDriverSelectors, setShowDriverSelectors] = useState(false);
  const [teamCache, setTeamCache] = useState({});
  const [ambQ, setAmbQ] = useState(true);
  const [ambR, setAmbR] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [teamColor, setTeamColor] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      if (year && !teamCache[year]) {
        const response = await axios.get(`https://praneeth7781.github.io/f1nsight-api-2/constructors/${year}.json`);
        const constructors = response.data;
        setTeamCache((prevCache) => ({ ...prevCache, [year]: constructors }));
      }
    };
    fetchTeams();
    setShowDriverSelectors(false);
    setSelectedDriver1('');
    setSelectedDriver2('');
    setAmbQ(true);
    setAmbR(true);
  }, [year, teamCache]);

  const teamsMemo = useMemo(() => teamCache[year] || [], [year, teamCache]);

  const handleYearChange = async (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);
    setTeam('');
    setDrivers([]);
    setHeadToHeadData(null);
  };

  const handleTeamChange = async (e) => {
    const selectedTeam = e.target.value;
    setTeam(selectedTeam);
    const response = await axios.get(`https://praneeth7781.github.io/f1nsight-api-2/constructors/${year}/${selectedTeam}.json`);
    const fetchedDrivers = response.data;
    setDrivers(fetchedDrivers);
    const colorsResponse = await axios.get('https://praneeth7781.github.io/f1nsight-api-2/colors/teams.json');
    const teamColors = colorsResponse.data;

    // Get the color for the selected team and year
    if(teamColors[year]){
      // console.log(teamColors[year]);
      setTeamColor(teamColors[year][selectedTeam]);
      // console.log(selectedTeam);
      // console.log(teamColors[year][selectedTeam]);
    } 
    else{
      setTeamColor('5F0B84');
    }
    if(fetchedDrivers.length > 2){
      setShowDriverSelectors(true);
    }
    else{
      fetchDriverData(fetchedDrivers);
      setShowDriverSelectors(false);
    }
  };

  const fetchDriverData = async (drivers) => {
    const driverPromises = drivers.map(driver => driver.driverId);
    const driverResults = await fetchDriverStats(driverPromises[0], driverPromises[1]);
    
    const filterDataByYear = (data, year) => {
      // console.log(data);
      return {
        qualifyingTimes: data.driverQualifyingTimes[year] || {},
        racePosition: data.racePosition[year] || {},
        qualiPosition: data.qualiPosition[year] || {},
        posAfterRace: data.posAfterRace[year] || {},
        podiums: data.podiums[year] || {},
        poles: data.poles[year] || {},
        lastUpdate: data.lastUpdate,
        positionsGainLost: data.positionsGainLost[year] || {},
        avgRacePositions: data.avgRacePositions[year] || {},
        avgQualiPositions: data.avgQualiPositions[year] || {},
        win_rates: data.rates.wins[year] || {},
        podium_rates: data.rates.podiums[year] || {},
        pole_rates: data.rates.poles[year] || {}
      };
    };

    const filteredDriver1Data = filterDataByYear(driverResults.driver1, year);
    const filteredDriver2Data = filterDataByYear(driverResults.driver2, year);

    const driverResultsMap = {
      [driverResults.driver1.driverId]: filteredDriver1Data,
      [driverResults.driver2.driverId]: filteredDriver2Data
    };

    if (drivers.length >= 2) {
      // const colorsResponse = await axios.get('https://praneeth7781.github.io/f1nsight-api-2/colors/teams.json');
      // const teamColors = colorsResponse.data;

      // Get the color for the selected team and year
      // if(teamColors[year]){
      //   setTeamColor(teamColors[year][drivers[0].driverId]);
      // } 
      // else {
      //   setTeamColor('5F0B84');
      // }
      await calculateHeadToHead(driverResultsMap, drivers[0].driverId, drivers[1].driverId, drivers);
    }
  };

  const handleDriver1Change = async (e) => {
    setSelectedDriver1(e.target.value);

    if (selectedDriver2) {
      setAmbQ(true);
      setAmbR(true);
      const driver1Data = drivers.find(driver => driver.driverId === e.target.value);
      const driver2Data = drivers.find(driver => driver.driverId === selectedDriver2);
      await fetchDriverData([driver1Data, driver2Data]);
    }
  };

  const handleDriver2Change = async (e) => {
    setSelectedDriver2(e.target.value);

    if (selectedDriver1) {
      setAmbQ(true);
      setAmbR(true);
      const driver1Data = drivers.find(driver => driver.driverId === selectedDriver1);
      const driver2Data = drivers.find(driver => driver.driverId === e.target.value);
      await fetchDriverData([driver1Data, driver2Data]);
    }
  };

  const calculateHeadToHead = async (driverResults, driver1Id, driver2Id, drivers) => {
    if (drivers.length < 2) return;

    let driver1QualifyingWins = 0;
    let driver2QualifyingWins = 0;
    let driver1RaceWins = 0;
    let driver2RaceWins = 0;

    const processQualifyingResults = (qualifyingResults) => {
      if (!qualifyingResults) return { qualifyingPos: [], qualifyingTimes: [] };

      const qualifyingTimes = [];

      Object.keys(qualifyingResults.QualiTimes).forEach((raceName) => {
        const times = qualifyingResults.QualiTimes[raceName];
        qualifyingTimes.push({
          race: raceName,
          QualiTimes: [times[0] || 'N/A', times[1] || 'N/A', times[2] || 'N/A']
        });
      });

      return { qualifyingTimes };
    };

    const processRaceResults = (raceResults) => {
      if (!raceResults) return { racePos: [] };

      const racePos = [];

      Object.keys(raceResults.positions).forEach((raceName) => {
        const result = raceResults.positions[raceName];
        const racePosition = parseInt(result);
        racePos.push({ raceName, pos: racePosition });
      });

      return { racePos };
    };

    const processQualiResults = (qualiResults) => {
      if (!qualiResults) return { qualiPos: [] };

      const qualiPos = [];

      Object.keys(qualiResults.positions).forEach((raceName) => {
        const result = qualiResults.positions[raceName];
        const racePosition = parseInt(result);
        qualiPos.push({ raceName, pos: racePosition });
      });

      return { qualiPos };
    };

    const { qualifyingTimes: driver1QualifyingTimesProcessed } = processQualifyingResults(driverResults[driver1Id]?.qualifyingTimes);
    const { qualifyingTimes: driver2QualifyingTimesProcessed } = processQualifyingResults(driverResults[driver2Id]?.qualifyingTimes);

    const { qualiPos: driver1QualifyingPos } = processQualiResults(driverResults[driver1Id]?.qualiPosition);
    const { qualiPos: driver2QualifyingPos } = processQualiResults(driverResults[driver2Id]?.qualiPosition);
    
    driver1QualifyingPos.forEach(race1 => {
      let race2 = driver2QualifyingPos.find(el => el.raceName === race1.raceName);
      if (race2) {
        setAmbQ(false);
        if (race1.pos < race2.pos) driver1QualifyingWins++;
        if (race2.pos < race1.pos) driver2QualifyingWins++;
      }
    });

    const { racePos: driver1RacePosProcessed } = processRaceResults(driverResults[driver1Id]?.racePosition);
    const { racePos: driver2RacePosProcessed } = processRaceResults(driverResults[driver2Id]?.racePosition);
    
    driver1RacePosProcessed.forEach(race1 => {
      let race2 = driver2RacePosProcessed.find(el => el.raceName === race1.raceName);
      if (race2) {
        setAmbR(false);
        if (race1.pos < race2.pos) driver1RaceWins++;
        if (race2.pos < race1.pos) driver2RaceWins++;
      }
    });

    // console.log(driverResults);

    const driver1TotalPoints = parseInt(driverResults[driver1Id]?.posAfterRace.pos[Object.keys(driverResults[driver1Id]?.posAfterRace.pos).pop()]?.points) || 0;
    const driver2TotalPoints = parseInt(driverResults[driver2Id]?.posAfterRace.pos[Object.keys(driverResults[driver2Id]?.posAfterRace.pos).pop()]?.points) || 0;        

    setHeadToHeadData({
      lastUpdate: driverResults[driver1Id]?.lastUpdate,
      driver1: drivers.find(d => d.driverId === driver1Id).givenName + ' ' + drivers.find(d => d.driverId === driver1Id).familyName,
      driver2: drivers.find(d => d.driverId === driver2Id).givenName + ' ' + drivers.find(d => d.driverId === driver2Id).familyName,
      driver1Code: drivers.find(d => d.driverId === driver1Id).code,
      driver2Code: drivers.find(d => d.driverId === driver2Id).code,
      driver1QualifyingWins,
      driver2QualifyingWins,
      driver1RaceWins,
      driver2RaceWins,
      driver1Points: driver1TotalPoints,
      driver2Points: driver2TotalPoints,
      driver1Podiums: Object.keys(driverResults[driver1Id]?.podiums || {}).length,
      driver2Podiums: Object.keys(driverResults[driver2Id]?.podiums || {}).length,
      driver1Poles: Object.keys(driverResults[driver1Id]?.poles || {}).length,
      driver2Poles: Object.keys(driverResults[driver2Id]?.poles || {}).length,
      driver1QualifyingTimes: driver1QualifyingTimesProcessed,
      driver2QualifyingTimes: driver2QualifyingTimesProcessed,
      driver1QualifyingPosList: driverResults[driver1Id]?.qualiPosition.positions || {},
      driver2QualifyingPosList: driverResults[driver2Id]?.qualiPosition.positions || {},
      driver1RacePosList: driverResults[driver1Id]?.racePosition.positions || {},
      driver2RacePosList: driverResults[driver2Id]?.racePosition.positions || {},
      driver1AvgRacePosition: isNaN(parseFloat(driverResults[driver1Id]?.avgRacePositions)) ? "0.00" : parseFloat(driverResults[driver1Id]?.avgRacePositions).toFixed(2),
      driver2AvgRacePosition: isNaN(parseFloat(driverResults[driver2Id]?.avgRacePositions)) ? "0.00" : parseFloat(driverResults[driver2Id]?.avgRacePositions).toFixed(2),
      driver1AvgQualiPositions: isNaN(parseFloat(driverResults[driver1Id]?.avgQualiPositions)) ? "0.00" : parseFloat(driverResults[driver1Id]?.avgQualiPositions).toFixed(2),
      driver2AvgQualiPositions: isNaN(parseFloat(driverResults[driver2Id]?.avgQualiPositions)) ? "0.00" : parseFloat(driverResults[driver2Id]?.avgQualiPositions).toFixed(2),
      driver1_win_rates: isNaN(parseFloat(driverResults[driver1Id]?.win_rates)) ? "0.00" : parseFloat(driverResults[driver1Id]?.win_rates).toFixed(2),
      driver2_win_rates: isNaN(parseFloat(driverResults[driver2Id]?.win_rates)) ? "0.00" : parseFloat(driverResults[driver2Id]?.win_rates).toFixed(2),
      driver1_podium_rates: isNaN(parseFloat(driverResults[driver1Id]?.podium_rates)) ? "0.00" : parseFloat(driverResults[driver1Id]?.podium_rates).toFixed(2),
      driver2_podium_rates: isNaN(parseFloat(driverResults[driver2Id]?.podium_rates)) ? "0.00" : parseFloat(driverResults[driver2Id]?.podium_rates).toFixed(2),
      driver1_pole_rates: isNaN(parseFloat(driverResults[driver1Id]?.pole_rates)) ? "0.00" : parseFloat(driverResults[driver1Id]?.pole_rates).toFixed(2),
      driver2_pole_rates: isNaN(parseFloat(driverResults[driver2Id]?.pole_rates)) ? "0.00" : parseFloat(driverResults[driver2Id]?.pole_rates).toFixed(2),
      driver1PositionsGainLost: driverResults[driver1Id]?.positionsGainLost || {},
      driver2PositionsGainLost: driverResults[driver2Id]?.positionsGainLost || {}
    });
  };

  const memoizedHeadToHeadData = useMemo(() => headToHeadData, [headToHeadData]);
  // console.log(memoizedHeadToHeadData);
  
  const prepareChartData = () => {
    if (!memoizedHeadToHeadData) return [];
    const races = memoizedHeadToHeadData.driver1QualifyingTimes.map((q) => {
      const driver2Race = memoizedHeadToHeadData.driver2QualifyingTimes.find(r => r.race === q.race);
      if (driver2Race && driver2Race.race === q.race) {
        const getTime = (times) => {
          const validTimes = times.filter(t => t !== 'N/A');
          if (validTimes.length === 3) return validTimes[2];
          if (validTimes.length === 2) return validTimes[1];
          if (validTimes.length === 1) return validTimes[0];
          return null;
        };

        const bestTime1 = getTime(q.QualiTimes);
        const bestTime2 = getTime(driver2Race.QualiTimes);

        const convertToSeconds = (time) => {
          const [minutes, seconds] = time.split(':');
          const [secs, millis] = seconds.split('.');
          return parseInt(minutes) * 60 + parseInt(secs) + parseInt(millis) / 1000;
        };

        return {
          race: q.race,
          [memoizedHeadToHeadData.driver1Code]: bestTime1 ? convertToSeconds(bestTime1) : null,
          [memoizedHeadToHeadData.driver2Code]: bestTime2 ? convertToSeconds(bestTime2) : null,
        };
      }
      return null;
    }).filter(item => item !== null);
    return races;
  };

  const chartData = prepareChartData();

  const yAxisLimits = useMemo(() => {
    if (!chartData.length) return [0, 10]; // default values if no data
    let allValues = chartData.flatMap(data => Object.values(data).filter(val => typeof val === 'number'));
    let minVal = Math.min(...allValues);
    let maxVal = Math.max(...allValues);
    let padding = (maxVal - minVal) * 0.1; // 10% padding
    return [minVal - padding, maxVal + padding];
  }, [chartData]);

  const preparePositionChartData = (driver1PosList, driver2PosList, driver1Code, driver2Code) => {
    const races = Object.keys(driver1PosList).map((raceName) => {
      const driver1Pos = driver1PosList[raceName];
      const driver2Pos = driver2PosList[raceName];
  
      return {
        race: raceName,
        [driver1Code]: driver1Pos ? parseInt(driver1Pos) : null,
        [driver2Code]: driver2Pos ? parseInt(driver2Pos) : null,
      };
    });
    return races;
  };  

const driverLockup = (driverId, driverName) => {
  const driverSplitName = driverName.split(" ");
  return (
    <div 
      className="flex justify-center relative text-center group rounded-lg px-16"
      style={{ boxShadow: "inset 0px 0px 32px 0px rgba(0,0,0,0.5)" }}
    >
      <img 
        alt="NotAvailable" 
        src={year >= 2023 ? 
          `${process.env.PUBLIC_URL + "/images/2024/drivers/" + driverId +  ".png"}` 
          : `${process.env.PUBLIC_URL + "/images/2024/drivers/default.png"}`}
        width={150} 
        height={150} 
        className={classNames("-mt-32", {"group-[:first-of-type]:scale-x-[-1]" : year <= 2023 })}
      />
      <div className="absolute top-full leading-none w-full mt-8">
        <div className="text-sm tracking-sm uppercase text-gradient-light">{driverSplitName[0]}</div>
        <div className="font-display text-gradient-light">{driverSplitName[1]}</div>
      </div>
    </div>
  )
}

const CustomizedXAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
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
        fill="#666"
        transform="rotate(-15) translate(-8,-12)"
        fontSize={12}
      >
        {`${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`}
      </text>
    </g>
  );
};

const GridRow = (label, driver1, driver2, title) => {
  const driver1SplitName = driver1.split(" ");
  const driver2SplitName = driver2.split(" ")

  return (
    <>
      <div className={classNames("grid grid-cols-3 gap-4 mb-16 text-neutral-400 items-center", {'text-xs': title})}>
        <span className="tracking-xs uppercase text-xs">{label}</span>
        <span className="tracking-xs uppercase text-center">
          {title ? driver1SplitName[1] : driver1}
        </span>
        <span className="tracking-xs uppercase text-center">
          {title ? driver2SplitName[1] : driver2}
        </span>
      </div>
      <div className='divider-glow-medium ' />
    </>
  );
}

const chartData_posGainorLost = useMemo(() => {
  if (!memoizedHeadToHeadData) return [];
  
  return Object.keys(memoizedHeadToHeadData.driver1PositionsGainLost).map(race => {
    const driver1Data = memoizedHeadToHeadData.driver1PositionsGainLost[race];
    const driver2Data = memoizedHeadToHeadData.driver2PositionsGainLost[race];

    return driver1Data !== undefined && driver2Data !== undefined ? {
      race,
      [memoizedHeadToHeadData.driver1Code]: driver1Data,
      [memoizedHeadToHeadData.driver2Code]: driver2Data
    } : null;
  }).filter(item => item !== null);
}, [memoizedHeadToHeadData]);

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1975 + 1 }, (_, i) => currentYear - i);

  // console.log(chartData);
  // console.log(preparePositionChartData(memoizedHeadToHeadData.driver1QualifyingPosList, memoizedHeadToHeadData.driver2QualifyingPosList, memoizedHeadToHeadData.driver1Code, memoizedHeadToHeadData.driver2Code));

  return (
    <div className='global-container'>

      <div className="flex items-center justify-center gap-8">
        <Select label="Year" value={year} onChange={handleYearChange}>
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Select>
        <Select label="Team" value={team} onChange={handleTeamChange} disabled={!year}>
          <option value="">Select Team</option>
          {teamsMemo.map(t => (
            <option key={t.constructorId} value={t.constructorId}>{t.name}</option>
          ))}
        </Select>
      </div>

      {showDriverSelectors && (
        <div className="flex flex-col items-center justify-center gap-8">
          <p className="pt-24 pb-16">This team had more than 2 drivers competing this season. Please select two drivers to compare.</p>
          <div className='flex items-center gap-8'>
            <Select label="Driver 1" value={selectedDriver1} onChange={handleDriver1Change}>
              <option value="">Select Driver</option>
              {drivers.map(d => (
                <option key={d.driverId} value={d.driverId } disabled={d.driverId === selectedDriver2}>{d.givenName} {d.familyName}</option>
              ))}
            </Select>
            <Select label="Driver 2" value={selectedDriver2} onChange={handleDriver2Change} disabled={!selectedDriver1}>
              <option value="">Select Driver</option>
              {drivers.map(d => (
                <option key={d.driverId} value={d.driverId} disabled={d.driverId === selectedDriver1}>
                  {d.givenName} {d.familyName}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {isLoading ? (
        <Loading className="mt-[20rem] mb-[20rem]" message={`Comparing selected drivers`} />
      ) : (
        <div className="max-md:px-8">

        {memoizedHeadToHeadData && (
        <>
          <div 
              className="text-center leading-none mt-48 mb-48 w-1/2 m-auto"
            >
            <p className="font-display text-[2.4rem] gradient-text-light">{team}</p>
            <p className="text-sm tracking-xs gradient-text-light">HEAD-TO-HEAD</p>
            <div className="divider-glow-dark mt-8" />
          </div>
          <div 
            className="flex items-center justify-center gap-64 mb-64 md:w-2/3 m-auto relative px-16"
          >
            {driverLockup(memoizedHeadToHeadData.driver1Code, memoizedHeadToHeadData.driver1)}
            <div 
              className="text-center leading-none rounded-md absolute top-48 left-1/2 -translate-x-1/2 -z-[1] w-1/2"
            >
              <p className="font-display text-[2.4rem] gradient-text-light">VS</p>
            </div>
            {driverLockup(memoizedHeadToHeadData.driver2Code, memoizedHeadToHeadData.driver2)}
          </div>

          {(ambQ || ambR) &&( 
            <p className="text-center text-sm tracking-xs gradient-text-light mb-32">
              The drivers have not competed against each other this season
            </p>
          )}

          <p className="text-center text-sm tracking-xs gradient-text-light mb-32">
            Last Updated {formatDate(memoizedHeadToHeadData.lastUpdate)}
          </p>
          <HeadToHeadChart headToHeadData={memoizedHeadToHeadData} color={`#${teamColor}`} />

          <h3 className="heading-4 mb-16 text-neutral-400 ml-24">Driver Statistics Comparison</h3>
          <div className="bg-glow-large rounded-lg mb-64 p-8 md:px-32 md:pt-16 md:pb-32"> 
            {GridRow( " ", memoizedHeadToHeadData.driver1, memoizedHeadToHeadData.driver2, true)}
            {GridRow( "Average Race Position", memoizedHeadToHeadData.driver1AvgRacePosition, memoizedHeadToHeadData.driver2AvgRacePosition)}
            {GridRow( "Average Qualifying Position", memoizedHeadToHeadData.driver1AvgQualiPositions, memoizedHeadToHeadData.driver2AvgQualiPositions)}
            {GridRow( "Win Rate", memoizedHeadToHeadData.driver1_win_rates, memoizedHeadToHeadData.driver2_win_rates)}
            {GridRow( "Podium Rate", memoizedHeadToHeadData.driver1_podium_rates, memoizedHeadToHeadData.driver2_podium_rates)}
            {GridRow( "Pole Rate", memoizedHeadToHeadData.driver1_pole_rates, memoizedHeadToHeadData.driver2_pole_rates)}
          </div>

          <h3 className="heading-4 mb-16 text-neutral-400 ml-24">Positions Gained or Lost During Race</h3>
          <div className="bg-glow-large rounded-lg mb-64 p-8 md:px-32 md:pt-16 md:pb-32">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart width={730} height={250} data={chartData_posGainorLost} margin={{ top: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis tick={<CustomizedXAxisTick />} />
                <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                <Tooltip 
                  labelFormatter={(name) => chartData[name] && chartData[name].race ? chartData[name].race : name} 
                  formatter={(value) => {
                    return value;
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey={memoizedHeadToHeadData.driver1Code} fillOpacity={1} fill={`#${teamColor}`} />
                <Bar dataKey={memoizedHeadToHeadData.driver2Code} fillOpacity={1} fill={lightenColor(teamColor)} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <h3 className="heading-4 mb-16 text-neutral-400 ml-24">Qualifying Lap Times Comparision</h3>
          <div className="bg-glow-large rounded-lg mb-64 p-8 md:px-32 md:pt-16 md:pb-32">
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
                  domain={yAxisLimits} 
                  tick={<CustomizedYAxisTick />}
                  // tickFormatter={(value) => {
                  //   const minutes = Math.floor(value / 60);
                  //   const seconds = Math.floor(value % 60);
                  //   const milliseconds = Math.round((value - Math.floor(value)) * 1000);
                  //   return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
                  // }} 
                />
                <Tooltip 
                  labelFormatter={(name) => chartData[name] && chartData[name].race ? chartData[name].race : name} 
                  formatter={(value) => {
                    const minutes = Math.floor(value / 60);
                    const totalSeconds = (value % 60);
                    const seconds = Math.floor(totalSeconds);
                    const milliseconds = Math.round((totalSeconds - seconds) * 1000);
                    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
                  }}
                />
                <Legend verticalAlign="top" height={32} />
                <Bar dataKey={memoizedHeadToHeadData.driver1Code} fillOpacity={1} fill={`#${teamColor}`} connectNulls={true} />
                <Bar dataKey={memoizedHeadToHeadData.driver2Code} fillOpacity={1} fill={lightenColor(teamColor)} connectNulls={true} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h3 className="heading-4 mb-16 text-neutral-400 ml-24">Qualifying Positions Comparison</h3>
          <div className="bg-glow-large rounded-lg mb-64 p-8 md:px-32 md:pt-16 md:pb-32">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={preparePositionChartData(memoizedHeadToHeadData.driver1QualifyingPosList, memoizedHeadToHeadData.driver2QualifyingPosList, memoizedHeadToHeadData.driver1Code, memoizedHeadToHeadData.driver2Code)} margin={{ top: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis tick={<CustomizedXAxisTick />} />
                <YAxis reversed={true} domain={[1, 'dataMax']} />
                <Tooltip 
                  labelFormatter={(name) => chartData[name] && chartData[name].race ? chartData[name].race : name} 
                  formatter={(value) => {
                    return `P${value}`;
                  }}
                />
                <Legend verticalAlign="top" height={32} />
                <Line type="monotone" dataKey={memoizedHeadToHeadData.driver1Code} stroke={`#${teamColor}`} connectNulls={true}/>
                <Line type="monotone" dataKey={memoizedHeadToHeadData.driver2Code} stroke={lightenColor(teamColor)} connectNulls={true}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <h3 className="heading-4 mb-16 text-neutral-400 ml-24">Race Positions Comparison</h3>
          <div className="bg-glow-large rounded-lg mb-96 p-8 md:px-32 md:pt-16 md:pb-32">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={preparePositionChartData(memoizedHeadToHeadData.driver1RacePosList, memoizedHeadToHeadData.driver2RacePosList, memoizedHeadToHeadData.driver1Code, memoizedHeadToHeadData.driver2Code)} margin={{ top: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis tick={<CustomizedXAxisTick />} />
                <YAxis reversed={true} domain={[1, 'dataMax']} />
                <Tooltip 
                  labelFormatter={(name) => chartData[name] && chartData[name].race ? chartData[name].race : name} 
                  formatter={(value) => {
                    return `P${value}`;
                  }}
                />
                <Legend verticalAlign="top" height={32} />
                <Line type="monotone" dataKey={memoizedHeadToHeadData.driver1Code} stroke={`#${teamColor}`} connectNulls={true}/>
                <Line type="monotone" dataKey={memoizedHeadToHeadData.driver2Code} stroke={lightenColor(teamColor)} connectNulls={true}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
      </div>
      )}
    </div>
  );
};
