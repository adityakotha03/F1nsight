import React, { useState, useEffect, useMemo} from 'react';
import axios from 'axios';
import { Select } from './Select';
import { Loading } from './Loading';
import { HeadToHeadChart } from './HeadToHeadChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const F1HeadToHead = () => {
  const [year, setYear] = useState('');
  const [team, setTeam] = useState('');
  const [teams, setTeams] = useState([]);
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

  useEffect(()=>{
    const fetchTeams = async () => {
      if(year && !teamCache[year]) {
        const response = await axios.get(`https://ergast.com/api/f1/${year}/constructors.json`);
        const constructors = response.data.MRData.ConstructorTable.Constructors;
        setTeamCache((prevCache) => ({...prevCache, [year]: constructors}));
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
    fetchDriverData(selectedTeam, fetchedDrivers);
  };

  const fetchDriverData = async (team, drivers) => {
    //setIsLoading(true);
    // console.log("Fetching driver data", drivers);
    const driverPromises = drivers.map(async (driver) => {
      const driverId = driver.driverId;
      const [qualifyingResponse, raceResponse, standingsResponse] = await Promise.all([
        axios.get(`https://ergast.com/api/f1/${year}/drivers/${driverId}/qualifying.json`),
        axios.get(`https://ergast.com/api/f1/${year}/drivers/${driverId}/results.json`),
        axios.get(`https://ergast.com/api/f1/${year}/drivers/${driverId}/driverStandings.json`)
      ]);

      const qualifyingResults = qualifyingResponse.data.MRData.RaceTable.Races;
      const raceResults = raceResponse.data.MRData.RaceTable.Races;
      const standings = standingsResponse.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0];

      return {
        driverId,
        qualifyingResults,
        raceResults,
        points: standings.points,
        position: standings.position,
      };
    });

    const driverResults = await Promise.all(driverPromises);
    const driverResultsMap = driverResults.reduce((acc, data) => {
      acc[data.driverId] = data;
      return acc;
    }, {});

    setDriverData(driverResultsMap);
    if (drivers.length === 2) {
      // console.log("rcb");
      await calculateHeadToHead(driverResultsMap, drivers[0].driverId, drivers[1].driverId, drivers);
    }
    //setIsLoading(false);
  };

  const handleDriver1Change = async (e) => {
    setSelectedDriver1(e.target.value);
    if (selectedDriver2) {
      //setIsLoading(true);
      await calculateHeadToHead(driverData, e.target.value, selectedDriver2, drivers);
      //setIsLoading(false);
    }
  };

  const handleDriver2Change = async (e) => {
    setSelectedDriver2(e.target.value);
    if (selectedDriver1) {
      //setIsLoading(true);
      await calculateHeadToHead(driverData, selectedDriver1, e.target.value, drivers);
      //setIsLoading(false);
    }
  };

  const calculateHeadToHead = async (driverResults, driver1Id, driver2Id, drivers) => {
    setAmbQ(true);
    setAmbR(true);
    if (drivers.length < 2) return;
    // const driver1Id = drivers[0].driverId;
    // const driver2Id = drivers[1].driverId;
    // console.log("Entered", drivers.find(d => d.driverId === driver1Id));
    const driver1QualiPos = [];
    const driver2QualiPos = [];
    const driver1RacePos = [];
    const driver2RacePos = [];
    let driver1QualifyingWins = 0;
    let driver2QualifyingWins = 0;
    let driver1RaceWins = 0;
    let driver2RaceWins = 0;

    const driver1QualifyingTimes = [];
    const driver2QualifyingTimes = [];
    const driver1AverageSpeeds = [];
    const driver2AverageSpeeds = [];


    driverResults[driver1Id].qualifyingResults.forEach((race) => {
      const driver1Qualifying = parseInt(race.QualifyingResults[0].position);
      driver1QualiPos.push({raceName: race.raceName, pos: driver1Qualifying});
      // console.log("Kolaveri", race.QualifyingResults[0].Q1);
      driver1QualifyingTimes.push({
        race: race.raceName,
        QualiTimes: [race.QualifyingResults[0].Q1 || 'N/A', race.QualifyingResults[0].Q2 || 'N/A', race.QualifyingResults[0].Q3 || 'N/A']
      });
    //   console.log(race);
    });
    driverResults[driver2Id].qualifyingResults.forEach((race) => {
        const driver2Qualifying = parseInt(race.QualifyingResults[0].position);
        driver2QualiPos.push({raceName: race.raceName, pos: driver2Qualifying});
        driver2QualifyingTimes.push({
          race: race.raceName,
          QualiTimes: [race.QualifyingResults[0].Q1 || 'N/A', race.QualifyingResults[0].Q2 || 'N/A', race.QualifyingResults[0].Q3 || 'N/A']
        });
    });

    driver1QualiPos.forEach(race1 => {
        let race2 = driver2QualiPos.find(el => el.raceName === race1.raceName);
        if(race2){
            setAmbQ(false);
            if (race1.pos < race2.pos) driver1QualifyingWins++;
            if (race2.pos < race1.pos) driver2QualifyingWins++;
        }
    });


    driverResults[driver1Id].raceResults.forEach((race) => {
      const driver1Race = parseInt(race.Results[0].position);
      driver1RacePos.push({raceName: race.raceName, pos: driver1Race});
      if (race.Results[0].FastestLap && race.Results[0].FastestLap.AverageSpeed) {
        driver1AverageSpeeds.push({
          race: race.raceName,
          speed: parseFloat(race.Results[0].FastestLap.AverageSpeed.speed)
        });
      }
    });
    
    driverResults[driver2Id].raceResults.forEach((race) => {
        const driver2Race = parseInt(race.Results[0].position);
        driver2RacePos.push({raceName: race.raceName, pos: driver2Race});
        if (race.Results[0].FastestLap && race.Results[0].FastestLap.AverageSpeed) {
          driver2AverageSpeeds.push({
            race: race.raceName,
            speed: parseFloat(race.Results[0].FastestLap.AverageSpeed.speed)
          });
        }
    });

    driver1RacePos.forEach(race1 => {
        let race2 = driver2RacePos.find(el => el.raceName === race1.raceName);
        if(race2){
            setAmbR(false);
            // console.log(race1, race2);
            if (race1.pos < race2.pos) driver1RaceWins++;
            if (race2.pos < race1.pos) driver2RaceWins++;
        }
    });

    // if(driver1QualiPos.length !== driver2QualiPos.length) setAmbQ(true);
    // if(driver1RacePos.length !== driver2RacePos.length) setAmbR(true);
    
    setHeadToHeadData({
      driver1: drivers.find(d => d.driverId === driver1Id).givenName + ' ' + drivers.find(d => d.driverId === driver1Id).familyName,
      driver2: drivers.find(d => d.driverId === driver2Id).givenName + ' ' + drivers.find(d => d.driverId === driver2Id).familyName,
      driver1Code: drivers.find(d => d.driverId === driver1Id).code,
      driver2Code: drivers.find(d => d.driverId === driver2Id).code,
      driver1QualifyingWins,
      driver2QualifyingWins,
      driver1RaceWins,
      driver2RaceWins,
      driver1Points: driverResults[driver1Id].points,
      driver2Points: driverResults[driver2Id].points,
      driver1Position: driverResults[driver1Id].position,
      driver2Position: driverResults[driver2Id].position,
      driver1QualifyingTimes,
      driver2QualifyingTimes,
      driver1AverageSpeeds,
      driver2AverageSpeeds
    });
    return;
  };

  const memoizedHeadToHeadData = useMemo(() => headToHeadData, [headToHeadData]);
  console.log(memoizedHeadToHeadData);


  const prepareChartData = () => {
    if (!memoizedHeadToHeadData) return [];
    const races = memoizedHeadToHeadData.driver1QualifyingTimes.map((q, index) => {
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
  console.log(chartData);

  const yAxisLimits = useMemo(() => {
    if (!chartData.length) return [0, 10]; // default values if no data
    let allValues = chartData.flatMap(data => Object.values(data).filter(val => typeof val === 'number'));
    let minVal = Math.min(...allValues);
    let maxVal = Math.max(...allValues);
    let padding = (maxVal - minVal) * 0.1; // 10% padding
    return [minVal - padding, maxVal + padding];
}, [chartData]);


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
            {/* <tbody>
              <tr>
                <td>{memoizedHeadToHeadData.driver1QualifyingWins}{ambQ? "*" : ''}</td>
                <td>Qualifying</td>
                <td>{memoizedHeadToHeadData.driver2QualifyingWins}{ambQ? "*" : ''}</td>
              </tr>
              <tr>
                <td>{memoizedHeadToHeadData.driver1RaceWins}{ambR? "*" : ''}</td>
                <td>Races</td>
                <td>{memoizedHeadToHeadData.driver2RaceWins}{ambR? "*" : ''}</td>
              </tr>
              <tr>
                <td>{memoizedHeadToHeadData.driver1Points}</td>
                <td>Points</td>
                <td>{memoizedHeadToHeadData.driver2Points}</td>
              </tr>
              <tr>
                <td>{memoizedHeadToHeadData.driver1Position}</td>
                <td>Driver Standings</td>
                <td>{memoizedHeadToHeadData.driver2Position}</td>
              </tr>
            </tbody> */}
          </table>
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
          </div>
      )}
      </div>
      )}
    </div>
  );
};

export default F1HeadToHead;
