import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

import { fetchDriverStats } from '../utils/api';
import { HeadToHeadChart, PositionsGainedLostChart, QualifyingLapTimesChart, PositionsComparisonChart, Select, Loading } from '../components';


export const TeammatesComparison = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1975 + 1 }, (_, i) => currentYear - i);

  const { state } = useLocation();
  const { urlYear, urlTeam } = useParams();
  const navigate = useNavigate();

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
  const [teamColor, setTeamColor] = useState('5F0B84');
  const [renderHead, setRenderHead] = useState(true);

  useEffect(() => {
    const validYear = urlYear && parseInt(urlYear) <= currentYear ? urlYear : '';
    setYear(validYear);
    setTeam(urlTeam || '');
  }, [urlYear, urlTeam, currentYear]);

  useEffect(() => {
    if (year) {
      fetchTeams();
      if (team) {
        submit(team);
      }
    }
  }, [year, team]);

  const fetchTeams = async () => {
    if (year && !teamCache[year]) {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://praneeth7781.github.io/f1nsight-api-2/constructors/${year}.json`);
        const constructors = response.data;
        setTeamCache(prevCache => ({ ...prevCache, [year]: constructors }));

        if (team && !constructors.some(constructor => constructor.constructorId === team)) {
          window.alert(`${team} did not participate in ${year}`);
          setTeam('');
          navigate(`/teammates-comparison/${year}`, { replace: true });
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const teamsMemo = useMemo(() => teamCache[year] || [], [year, teamCache]);

  const handleYearChange = (e) => {
    const selectedYear = e.target.value;
    setYear(selectedYear);
    setTeam('');
    setDrivers([]);
    setHeadToHeadData(null);
    navigate(team ? `/teammates-comparison/${selectedYear}/${team}` : `/teammates-comparison/${selectedYear}`, { replace: true });
  };

  const handleTeamChange = (e) => {
    const selectedTeam = e.target.value;
    setTeam(selectedTeam);
    navigate(`/teammates-comparison/${year}/${selectedTeam}`, { replace: true });
    submit(selectedTeam);
  };

  const submit = async (selectedTeam) => {
    try {
      const response = await axios.get(`https://praneeth7781.github.io/f1nsight-api-2/constructors/${year}/${selectedTeam}.json`);
      const fetchedDrivers = response.data;
      setDrivers(fetchedDrivers);

      const colorsResponse = await axios.get('https://praneeth7781.github.io/f1nsight-api-2/colors/teams.json');
      const teamColors = colorsResponse.data;

      setTeamColor(teamColors[year]?.[selectedTeam] || '5F0B84');

      if (fetchedDrivers.length > 2) {
        setShowDriverSelectors(true);
        setRenderHead(false);
      } else {
        fetchDriverData(fetchedDrivers);
        setShowDriverSelectors(false);
      }
    } catch (error) {
      console.error("Error submitting team data:", error);
    }
  };

  const fetchDriverData = async (drivers) => {
    setIsLoading(true);
    try {
      const driverPromises = drivers.map(driver => driver.driverId);
      const driverResults = await fetchDriverStats(driverPromises[0], driverPromises[1]);
      
      const filterDataByYear = (data, year) => ({
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
      });

      const filteredDriver1Data = filterDataByYear(driverResults.driver1, year);
      const filteredDriver2Data = filterDataByYear(driverResults.driver2, year);

      const driverResultsMap = {
        [driverResults.driver1.driverId]: filteredDriver1Data,
        [driverResults.driver2.driverId]: filteredDriver2Data
      };

      if (drivers.length >= 2) {
        await calculateHeadToHead(driverResultsMap, drivers[0].driverId, drivers[1].driverId, drivers);
      }
    } catch (error) {
      console.error("Error fetching driver data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriver1Change = async (e) => {
    setSelectedDriver1(e.target.value);
    if (selectedDriver2) {
      setAmbQ(true);
      setAmbR(true);
      setRenderHead(true);
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
      setRenderHead(true);
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
      if (!qualifyingResults) return { qualifyingTimes: [] };

      const qualifyingTimes = Object.entries(qualifyingResults.QualiTimes).map(([raceName, times]) => ({
        race: raceName,
        QualiTimes: [times[0] || 'N/A', times[1] || 'N/A', times[2] || 'N/A']
      }));

      return { qualifyingTimes };
    };

    const processPositions = (positions) => {
      if (!positions) return { pos: [] };

      return {
        pos: Object.entries(positions.positions).map(([raceName, pos]) => ({
          raceName,
          pos: parseInt(pos)
        }))
      };
    };

    const { qualifyingTimes: driver1QualifyingTimesProcessed } = processQualifyingResults(driverResults[driver1Id]?.qualifyingTimes);
    const { qualifyingTimes: driver2QualifyingTimesProcessed } = processQualifyingResults(driverResults[driver2Id]?.qualifyingTimes);

    const { pos: driver1QualifyingPos } = processPositions(driverResults[driver1Id]?.qualiPosition);
    const { pos: driver2QualifyingPos } = processPositions(driverResults[driver2Id]?.qualiPosition);
    
    driver1QualifyingPos.forEach(race1 => {
      let race2 = driver2QualifyingPos.find(el => el.raceName === race1.raceName);
      if (race2) {
        setAmbQ(false);
        if (race1.pos < race2.pos) driver1QualifyingWins++;
        if (race2.pos < race1.pos) driver2QualifyingWins++;
      }
    });

    const { pos: driver1RacePosProcessed } = processPositions(driverResults[driver1Id]?.racePosition);
    const { pos: driver2RacePosProcessed } = processPositions(driverResults[driver2Id]?.racePosition);
    
    driver1RacePosProcessed.forEach(race1 => {
      let race2 = driver2RacePosProcessed.find(el => el.raceName === race1.raceName);
      if (race2) {
        setAmbR(false);
        if (race1.pos < race2.pos) driver1RaceWins++;
        if (race2.pos < race1.pos) driver2RaceWins++;
      }
    });

    const driver1TotalPoints = parseInt(driverResults[driver1Id]?.posAfterRace.pos[Object.keys(driverResults[driver1Id]?.posAfterRace.pos).pop()]?.points) || 0;
    const driver2TotalPoints = parseInt(driverResults[driver2Id]?.posAfterRace.pos[Object.keys(driverResults[driver2Id]?.posAfterRace.pos).pop()]?.points) || 0;        

    const driver1QualifyingPosList = driverResults[driver1Id]?.qualiPosition.positions || {};
    const driver2QualifyingPosList = driverResults[driver2Id]?.qualiPosition.positions || {};
    const driver1RacePosList = driverResults[driver1Id]?.racePosition.positions || {};
    const driver2RacePosList = driverResults[driver2Id]?.racePosition.positions || {};
    
    const commonQualifyingRaces = Object.keys(driver1QualifyingPosList).filter(race => race in driver2QualifyingPosList);
    const commonRaceRaces = Object.keys(driver1RacePosList).filter(race => race in driver2RacePosList);
    
    const filteredDriver1QualifyingPosList = commonQualifyingRaces.reduce((result, race) => {
        result[race] = driver1QualifyingPosList[race];
        return result;
    }, {});
    
    const filteredDriver2QualifyingPosList = commonQualifyingRaces.reduce((result, race) => {
        result[race] = driver2QualifyingPosList[race];
        return result;
    }, {});
    
    const filteredDriver1RacePosList = commonRaceRaces.reduce((result, race) => {
        result[race] = driver1RacePosList[race];
        return result;
    }, {});
    
    const filteredDriver2RacePosList = commonRaceRaces.reduce((result, race) => {
        result[race] = driver2RacePosList[race];
        return result;
    }, {});
    
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
      driver1QualifyingPosList: filteredDriver1QualifyingPosList,
      driver2QualifyingPosList: filteredDriver2QualifyingPosList,
      driver1RacePosList: filteredDriver1RacePosList,
      driver2RacePosList: filteredDriver2RacePosList,
      driver1AvgRacePosition: isNaN(parseFloat(driverResults[driver1Id]?.avgRacePositions)) ? 0.00 : parseFloat(driverResults[driver1Id]?.avgRacePositions).toFixed(2),
      driver2AvgRacePosition: isNaN(parseFloat(driverResults[driver2Id]?.avgRacePositions)) ? 0.00 : parseFloat(driverResults[driver2Id]?.avgRacePositions).toFixed(2),
      driver1AvgQualiPositions: isNaN(parseFloat(driverResults[driver1Id]?.avgQualiPositions)) ? 0.00 : parseFloat(driverResults[driver1Id]?.avgQualiPositions).toFixed(2),
      driver2AvgQualiPositions: isNaN(parseFloat(driverResults[driver2Id]?.avgQualiPositions)) ? 0.00 : parseFloat(driverResults[driver2Id]?.avgQualiPositions).toFixed(2),
      driver1_win_rates: isNaN(parseFloat(driverResults[driver1Id]?.win_rates)) ? 0.00 : parseFloat(driverResults[driver1Id]?.win_rates).toFixed(2),
      driver2_win_rates: isNaN(parseFloat(driverResults[driver2Id]?.win_rates)) ? 0.00 : parseFloat(driverResults[driver2Id]?.win_rates).toFixed(2),
      driver1_podium_rates: isNaN(parseFloat(driverResults[driver1Id]?.podium_rates)) ? 0.00 : parseFloat(driverResults[driver1Id]?.podium_rates).toFixed(2),
      driver2_podium_rates: isNaN(parseFloat(driverResults[driver2Id]?.podium_rates)) ? 0.00 : parseFloat(driverResults[driver2Id]?.podium_rates).toFixed(2),
      driver1_pole_rates: isNaN(parseFloat(driverResults[driver1Id]?.pole_rates)) ? 0.00 : parseFloat(driverResults[driver1Id]?.pole_rates).toFixed(2),
      driver2_pole_rates: isNaN(parseFloat(driverResults[driver2Id]?.pole_rates)) ? 0.00 : parseFloat(driverResults[driver2Id]?.pole_rates).toFixed(2),
      driver1PositionsGainLost: driverResults[driver1Id]?.positionsGainLost || {},
      driver2PositionsGainLost: driverResults[driver2Id]?.positionsGainLost || {}
    });
  };

  const memoizedHeadToHeadData = useMemo(() => headToHeadData, [headToHeadData]);
  // console.log(memoizedHeadToHeadData);


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


const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

const GridRow = (label, driver1, driver2, title) => {
  const driver1SplitName = String(driver1).split(" ");
  const driver2SplitName = String(driver2).split(" ");

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
            {!selectedDriver1 && <option value="">Select Driver</option>}
            {drivers.map(d => (
              <option key={d.driverId} value={d.driverId} disabled={d.driverId === selectedDriver2}>
                {d.givenName} {d.familyName}
              </option>
            ))}
          </Select>
          <Select label="Driver 2" value={selectedDriver2} onChange={handleDriver2Change} disabled={!selectedDriver1}>
            {!selectedDriver2 && <option value="">Select Driver</option>}
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

        {memoizedHeadToHeadData && renderHead && urlTeam && urlYear && (
        <>
          <button onClick={() => {navigator.clipboard.writeText(`http://localhost:3000/#/teammates-comparison/${year}/${team}`)}}   style={{ cursor: 'pointer', padding: '10px 20px', backgroundColor: '#007BFF', color: '#FFF', border: 'none', borderRadius: '4px' }}>Share</button>

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


          {(!ambQ && !ambR) && (<div>
            <div>
              <div>
                <h3 className="heading-4 mb-16 text-neutral-400 ml-24">Positions Gained or Lost During Race</h3>
                <div className="bg-glow-large rounded-lg mb-64 p-8 md:px-32 md:pt-16 md:pb-32">
                  <PositionsGainedLostChart 
                    headToHeadData={memoizedHeadToHeadData}
                    teamColor={teamColor}
                  />
                </div>
                
                <h3 className="heading-4 mb-16 text-neutral-400 ml-24">Qualifying Lap Times Comparison</h3>
                <div className="bg-glow-large rounded-lg mb-64 p-8 md:px-32 md:pt-16 md:pb-32">
                  <QualifyingLapTimesChart 
                    headToHeadData={memoizedHeadToHeadData}
                    teamColor={teamColor}
                  />
                </div>
              </div>

              <h3 className="heading-4 mb-16 text-neutral-400 ml-24">Qualifying Positions Comparison</h3>
              <div className="bg-glow-large rounded-lg mb-64 p-8 md:px-32 md:pt-16 md:pb-32">
                <PositionsComparisonChart
                  headToHeadData={memoizedHeadToHeadData}
                  teamColor={teamColor}
                  isQualifying={true}
                />
              </div>

              <h3 className="heading-4 mb-16 text-neutral-400 ml-24">Race Positions Comparison</h3>
              <div className="bg-glow-large rounded-lg mb-96 p-8 md:px-32 md:pt-16 md:pb-32">
                <PositionsComparisonChart
                  headToHeadData={memoizedHeadToHeadData}
                  teamColor={teamColor}
                  isQualifying={false}
                />
              </div>
              </div>
          </div>)}
        </>
      )}
      </div>
      )}
    </div>
  );
};