import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Select } from './Select';

const TeammatesComparison = () => {
  const [year, setYear] = useState('');
  const [team, setTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driverData, setDriverData] = useState({});
  const [headToHeadData, setHeadToHeadData] = useState(null);
  const [ambQ, setAmbQ] = useState(false);
  const [ambR, setAmbR] = useState(false);

  const handleYearChange = async (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);
    setAmbQ(false);
    setAmbR(false);

    const response = await axios.get(`https://ergast.com/api/f1/${selectedYear}/constructors.json`);
    const constructors = response.data.MRData.ConstructorTable.Constructors;
    setTeams(constructors);
  };

  const handleTeamChange = async (e) => {
    const selectedTeam = e.target.value;
    setTeam(selectedTeam);

    const response = await axios.get(`https://ergast.com/api/f1/${year}/constructors/${selectedTeam}/drivers.json`);
    const fetchedDrivers = response.data.MRData.DriverTable.Drivers;
    setDrivers(fetchedDrivers);

    fetchDriverData(selectedTeam, fetchedDrivers);
  };

  const fetchDriverData = async (team, drivers) => {

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
    calculateHeadToHead(driverResultsMap, drivers);
  };

  const calculateHeadToHead = (driverResults, drivers) => {
    if (drivers.length < 2) return;
    const driver1Id = drivers[0].driverId;
    const driver2Id = drivers[1].driverId;

    const driver1QualiPos = [];
    const driver2QualiPos = [];
    const driver1RacePos = [];
    const driver2RacePos = [];
    let driver1QualifyingWins = 0;
    let driver2QualifyingWins = 0;
    let driver1RaceWins = 0;
    let driver2RaceWins = 0;


    driverResults[driver1Id].qualifyingResults.forEach((race) => {
      const driver1Qualifying = parseInt(race.QualifyingResults[0].position);
      driver1QualiPos.push({raceName: race.raceName, pos: driver1Qualifying});
    //   console.log(race);
    });
    driverResults[driver2Id].qualifyingResults.forEach((race) => {
        const driver2Qualifying = parseInt(race.QualifyingResults[0].position);
        driver2QualiPos.push({raceName: race.raceName, pos: driver2Qualifying});
    });

    driver1QualiPos.forEach(race1 => {
        let race2 = driver2QualiPos.find(el => el.raceName === race1.raceName);
        if(race2){
            if (race1.pos < race2.pos) driver1QualifyingWins++;
            if (race2.pos < race1.pos) driver2QualifyingWins++;
        } else {
            setAmbQ(true);
        }
    });


    driverResults[driver1Id].raceResults.forEach((race) => {
      const driver1Race = parseInt(race.Results[0].position);
      driver1RacePos.push({raceName: race.raceName, pos: driver1Race});
    });
    
    driverResults[driver2Id].raceResults.forEach((race) => {
        const driver2Race = parseInt(race.Results[0].position);
        driver2RacePos.push({raceName: race.raceName, pos: driver2Race});
    });

    driver1RacePos.forEach(race1 => {
        let race2 = driver2RacePos.find(el => el.raceName === race1.raceName);
        if(race2){
            console.log(race1, race2);
            if (race1.pos < race2.pos) driver1RaceWins++;
            if (race2.pos < race1.pos) driver2RaceWins++;
        } else {
            setAmbR(true);
        }
    });

    if(driver1QualiPos.length !== driver2QualiPos.length) setAmbQ(true);
    if(driver1RacePos.length !== driver2RacePos.length) setAmbR(true);

    setHeadToHeadData({
      driver1: drivers[0].givenName + ' ' + drivers[0].familyName,
      driver2: drivers[1].givenName + ' ' + drivers[1].familyName,
      driver1QualifyingWins,
      driver2QualifyingWins,
      driver1RaceWins,
      driver2RaceWins,
      driver1Points: driverResults[driver1Id].points,
      driver2Points: driverResults[driver2Id].points,
      driver1Position: driverResults[driver1Id].position,
      driver2Position: driverResults[driver2Id].position,
    });
  };

  const memoizedHeadToHeadData = useMemo(() => headToHeadData, [headToHeadData]);

  return (
    <div className="global-container">
      <div className="flex items-center gap-8">
        <Select label="Year" value={year} onChange={handleYearChange}>
          <option value="">Select Year</option>
          {[...Array(50).keys()].map(i => (
            <option key={i} value={2024 - i}>{2024 - i}</option>
          ))}
        </Select>
        <Select label="Team" value={team} onChange={handleTeamChange} disabled={!year}>
          <option value="">Select Team</option>
          {teams.map(t => (
            <option key={t.constructorId} value={t.constructorId}>{t.name}</option>
          ))}
        </Select>
      </div>
      {memoizedHeadToHeadData && (
        <table>
          <thead>
            <tr>
              <th>{memoizedHeadToHeadData.driver1}</th>
              <th>Head-to-Head</th>
              <th>{memoizedHeadToHeadData.driver2}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{memoizedHeadToHeadData.driver1QualifyingWins}{ambQ ? "*" : '' }</td>
              <td>Qualifying</td>
              <td>{memoizedHeadToHeadData.driver2QualifyingWins}{ambQ ? "*" : '' }</td>
            </tr>
            <tr>
              <td>{memoizedHeadToHeadData.driver1RaceWins}{ambR ? "*" : '' }</td>
              <td>Races</td>
              <td>{memoizedHeadToHeadData.driver2RaceWins}{ambR ? "*" : '' }</td>
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
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeammatesComparison;
