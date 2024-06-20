import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Select } from './Select';
import { Loading } from './Loading';
import { HeadToHeadChart } from './HeadToHeadChart';
import { fetchDriverStats } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const F1HeadToHead = () => {
  const [year, setYear] = useState('');
  const [team, setTeam] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver1, setSelectedDriver1] = useState('');
  const [selectedDriver2, setSelectedDriver2] = useState('');
  const [driverData, setDriverData] = useState({});
  const [headToHeadData, setHeadToHeadData] = useState(null);
  const [showDriverSelectors, setShowDriverSelectors] = useState(false);
  const [teamCache, setTeamCache] = useState({});
  const [ambQ, setAmbQ] = useState(true);
  const [ambR, setAmbR] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      if (year && !teamCache[year]) {
        const response = await axios.get(`https://ergast.com/api/f1/${year}/constructors.json`);
        const constructors = response.data.MRData.ConstructorTable.Constructors;
        setTeamCache((prevCache) => ({ ...prevCache, [year]: constructors }));
      }
    };
    fetchTeams();
  }, [year, teamCache]);

  const teamsMemo = useMemo(() => teamCache[year] || [], [year, teamCache]);

  const handleYearChange = async (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);
    setTeam('');
    setDrivers([]);
    setDriverData({});
    setHeadToHeadData(null);
    setShowDriverSelectors(false);
  };

  const handleTeamChange = async (e) => {
    const selectedTeam = e.target.value;
    setTeam(selectedTeam);
    const response = await axios.get(`https://ergast.com/api/f1/${year}/constructors/${selectedTeam}/drivers.json`);
    const fetchedDrivers = response.data.MRData.DriverTable.Drivers;
    setDrivers(fetchedDrivers);
    setShowDriverSelectors(fetchedDrivers.length > 2);
    fetchDriverData(fetchedDrivers);
  };

  const fetchDriverData = async (drivers) => {
    const driverPromises = drivers.map(driver => driver.driverId);
    const driverResults = await fetchDriverStats(driverPromises[0], driverPromises[1]);
    
    const filterDataByYear = (data, year) => {
      console.log(data);
      return {
        qualifyingTimes: data.driverQualifyingTimes[year] || {},
        racePosition: data.racePosition[year] || {},
        qualiPosition: data.qualiPosition[year] || {},
        posAfterRace: data.posAfterRace[year] || {},
        podiums: data.podiums[year] || {},
        poles: data.poles[year] || {},
        lastUpdate: data.lastUpdate
      };
    };

    const filteredDriver1Data = filterDataByYear(driverResults.driver1, year);
    const filteredDriver2Data = filterDataByYear(driverResults.driver2, year);

    const driverResultsMap = {
      [driverResults.driver1.driverId]: filteredDriver1Data,
      [driverResults.driver2.driverId]: filteredDriver2Data
    };

    setDriverData(driverResultsMap);
    if (drivers.length === 2) {
      await calculateHeadToHead(driverResultsMap, drivers[0].driverId, drivers[1].driverId, drivers);
    }
  };

  const handleDriver1Change = async (e) => {
    setSelectedDriver1(e.target.value);
    if (selectedDriver2) {
      await calculateHeadToHead(driverData, e.target.value, selectedDriver2, drivers);
    }
  };

  const handleDriver2Change = async (e) => {
    setSelectedDriver2(e.target.value);
    if (selectedDriver1) {
      await calculateHeadToHead(driverData, selectedDriver1, e.target.value, drivers);
    }
  };

  const calculateHeadToHead = async (driverResults, driver1Id, driver2Id, drivers) => {
    setAmbQ(true);
    setAmbR(true);
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

    const driver1TotalPoints = driverResults[driver1Id]?.posAfterRace.pos[Object.keys(driverResults[driver1Id]?.posAfterRace.pos).pop()]?.points || 0;
    const driver2TotalPoints = driverResults[driver2Id]?.posAfterRace.pos[Object.keys(driverResults[driver2Id]?.posAfterRace.pos).pop()]?.points || 0;

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
      driver1Podiums: Object.keys(driverResults[driver1Id]?.podiums).length,
      driver2Podiums: Object.keys(driverResults[driver2Id]?.podiums).length,
      driver1Poles: Object.keys(driverResults[driver1Id]?.poles).length,
      driver2Poles: Object.keys(driverResults[driver2Id]?.poles).length,
      driver1QualifyingTimes: driver1QualifyingTimesProcessed,
      driver2QualifyingTimes: driver2QualifyingTimesProcessed,
      driver1QualifyingPosList: driverResults[driver1Id]?.qualiPosition.positions,
      driver2QualifyingPosList: driverResults[driver2Id]?.qualiPosition.positions,
      driver1RacePosList: driverResults[driver1Id]?.racePosition.positions,
      driver2RacePosList: driverResults[driver2Id]?.racePosition.positions
    });
  };

  const memoizedHeadToHeadData = useMemo(() => headToHeadData, [headToHeadData]);
  console.log(memoizedHeadToHeadData);
  
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

  // console.log(chartData);
  // console.log(preparePositionChartData(memoizedHeadToHeadData.driver1QualifyingPosList, memoizedHeadToHeadData.driver2QualifyingPosList, memoizedHeadToHeadData.driver1Code, memoizedHeadToHeadData.driver2Code));


  return (
    <div className='global-container'>
      <div className='flex items-center gap-8'>
        <Select label="Year" value={year} onChange={handleYearChange}>
          <option value="">Select Year</option>
          {[...Array(50).keys()].map(i => (
            <option key={i} value={2024 - i}>{2024 - i}</option>
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
        <div>
          <p>This team had more than 2 drivers competing this season. Please select two drivers to compare.</p>
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
        <div>
        {memoizedHeadToHeadData && (
          <div>
          <table>
            <thead>
              <tr>
                <th>
                  <div style={{textAlign : 'center'}}>
                    <img 
                      alt="" 
                      src={`${process.env.PUBLIC_URL + "/images/2024/drivers/" + memoizedHeadToHeadData.driver1Code + ".png"}`}
                      width={150} 
                      height={150} 
                    />
                    <div className='font-display pl-16 mr-4'>{memoizedHeadToHeadData.driver1}</div>
                  </div>
                </th>
                <th className="font-display pl-16 mr-4" style={{textAlign : 'center'}}>HEAD-TO-HEAD</th>
                <th>
                  <div style={{textAlign : 'center'}}>
                    <img 
                      alt="" 
                      src={`${process.env.PUBLIC_URL + "/images/2024/drivers/" + memoizedHeadToHeadData.driver2Code + ".png"}`}
                      width={150} 
                      height={150} 
                    />
                    <div className='font-display pl-16 mr-4'>{memoizedHeadToHeadData.driver2}</div>
                  </div>
                </th>
              </tr>
            </thead>
          </table>
          <p>Last Updated {memoizedHeadToHeadData.lastUpdate}</p>
          <HeadToHeadChart headToHeadData={memoizedHeadToHeadData} />
          <p>{ambQ || ambR ? "* denotes that the drivers have not competed against each other this season" : ''}</p>
          <h1>Qualifying Lap Times Comparision</h1>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis dataKey="race" />
              <YAxis 
                domain={yAxisLimits} 
                tickFormatter={(value) => {
                  const minutes = Math.floor(value / 60);
                  const seconds = Math.floor(value % 60);
                  const milliseconds = Math.round((value - Math.floor(value)) * 1000);
                  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
                }} 
              />
              <Tooltip 
                formatter={(value) => {
                  const minutes = Math.floor(value / 60);
                  const totalSeconds = (value % 60);
                  const seconds = Math.floor(totalSeconds);
                  const milliseconds = Math.round((totalSeconds - seconds) * 1000);
                  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
                }}
              />
              <Line type="monotone" dataKey={memoizedHeadToHeadData.driver1Code} stroke="#8884d8" connectNulls={true}/>
              <Line type="monotone" dataKey={memoizedHeadToHeadData.driver2Code} stroke="#82ca9d" connectNulls={true}/>
            </LineChart>
          </ResponsiveContainer>
          <h1>Qualifying Positions Comparison</h1>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={preparePositionChartData(memoizedHeadToHeadData.driver1QualifyingPosList, memoizedHeadToHeadData.driver2QualifyingPosList, memoizedHeadToHeadData.driver1Code, memoizedHeadToHeadData.driver2Code)} margin={{ top: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis dataKey="raceName" />
              <YAxis reversed={true} domain={[1, 'dataMax']} />
              <Tooltip />
              <Line type="monotone" dataKey={memoizedHeadToHeadData.driver1Code} stroke="#8884d8" connectNulls={true}/>
              <Line type="monotone" dataKey={memoizedHeadToHeadData.driver2Code} stroke="#82ca9d" connectNulls={true}/>
            </LineChart>
          </ResponsiveContainer>
          <h1>Race Positions Comparison</h1>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={preparePositionChartData(memoizedHeadToHeadData.driver1RacePosList, memoizedHeadToHeadData.driver2RacePosList, memoizedHeadToHeadData.driver1Code, memoizedHeadToHeadData.driver2Code)} margin={{ top: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis dataKey="raceName" />
              <YAxis reversed={true} domain={[1, 'dataMax']} />
              <Tooltip />
              <Line type="monotone" dataKey={memoizedHeadToHeadData.driver1Code} stroke="#8884d8" connectNulls={true}/>
              <Line type="monotone" dataKey={memoizedHeadToHeadData.driver2Code} stroke="#82ca9d" connectNulls={true}/>
            </LineChart>
          </ResponsiveContainer>
          </div>
      )}
      </div>
      )}
    </div>
  );
};

export default F1HeadToHead;