import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchDriverStats, fetchDriversList } from '../utils/api';
import { Loading, LineChartByYear, BarChartTotal, Button, ReactSelectComponent } from "../components";

export function DriverComparison(){
    const {urlDriver1, urlDriver2} = useParams();
    const [urlDriverName1, setURLDriverName1] = useState(null);
    const [urlDriverName2, setURLDriverName2] = useState(null);
    const [driversList, setDriversList] = useState([]);
    const [driver1, setDriver1] = useState('');
    const [driver2, setDriver2] = useState('');
    const [inputdriver1, setInputDriver1] = useState('');
    const [inputdriver2, setInputDriver2] = useState('');
    const [driver1Data, setDriver1Data] = useState(null);
    const [driver2Data, setDriver2Data] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [competingYears, setCompetingYears] = useState([]);
    const [allYears, setAllYears] = useState([]);
    const [displayCompetingYears, setDisplayCompetingYears] = useState(false);
    let navigate = useNavigate();

    function compare( a, b ) {
        if ( a.name < b.name ){
            return -1;
        }
        if ( a.name > b.name ){
            return 1;
        }
            return 0;
        }

    useEffect(() => {
        const loadDrivers = async () => {
            const drivers = await fetchDriversList();
            setDriversList(drivers.sort(compare));
            if(urlDriver1){
                setURLDriverName1(drivers.find(driver => driver.id === urlDriver1).name);
                setInputDriver1({value : urlDriver1, label : urlDriverName1});
            }
            if(urlDriver2){
                setURLDriverName2(drivers.find(driver => driver.id === urlDriver2).name);
                setInputDriver2({value : urlDriver2, label : urlDriverName2});
            }
            if(urlDriver1 && urlDriver2){
                setDriver1(urlDriver1);
                setDriver2(urlDriver2);
            }
        };
        loadDrivers();
    },[urlDriver1, urlDriver2])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if(driver1 && driver2){
                const DriversData = await fetchDriverStats(driver1, driver2);

                setDriver1Data(DriversData.driver1);
                setDriver2Data(DriversData.driver2);

                // console.log(DriversData.driver1);

                // Convert finalStandings objects to arrays of years
                const driver1Years = Object.keys(DriversData.driver1.finalStandings);
                const driver2Years = Object.keys(DriversData.driver2.finalStandings);

                // Determine overlapping years
                const overlappingYears = driver1Years.filter(year => driver2Years.includes(year));

                // Determine all years combined
                const combinedYears = Array.from(new Set([...driver1Years, ...driver2Years])).sort();

                setCompetingYears(overlappingYears);
                setDisplayCompetingYears(overlappingYears.length > 0)
                setAllYears(combinedYears);

                // console.log({ overlappingYears, combinedYears });
            }
            setIsLoading(false);
        };

        fetchData();
    }, [driver1, driver2]);

    // Determine which years to display
    const yearsToDisplay = displayCompetingYears && competingYears.length > 0 ? competingYears : allYears;

    const handleCompare = () => {
        navigate(`/driver-comparison/${inputdriver1.value}/${inputdriver2.value}`, {replace : true});
        setDriver1(inputdriver1.value);
        setDriver2(inputdriver2.value);
        setInputDriver1('');
        setInputDriver2('');
    };

    const renderFinalStandings = () => {
        return (
            <>
                {yearsToDisplay.map(year => (
                    <div key={year} className="driver-comparison-row w-[38rem] m-auto mb-16">
                        <div className="text-center gradient-text-light text-sm">{year}</div>
                        
                        <div className="flex item-center justify-center gap-4">
                            <div>
                                {driver1Data.finalStandings[year] ? (
                                    <div className="flex items-center justify-center font-display">
                                        <div className="w-48 bg-black px-16 py-2 rounded-l-[1rem]"><span className="gradient-text-white">{driver1Data.finalStandings[year].position}</span></div>
                                        <div className="w-[10rem] text-right bg-glow pr-16 py-2 gradient-text-white">{driver1Data.finalStandings[year].points}</div>
                                    </div>
                                ) : (
                                    <div className="w-[14.8rem] bg-glow-dark pr-16 py-2 gradient-text-white rounded-l-[1rem] text-right">DNC</div>
                                )}
                            </div>
                            <div>
                                {driver2Data.finalStandings[year] ? (
                                    <div className="flex items-center justify-center font-display">
                                        <div className="w-[10rem] bg-glow pl-16 py-2 gradient-text-white">{driver2Data.finalStandings[year].points}</div>
                                        <div className="w-48 bg-black px-16 py-2 rounded-r-[1rem]"><span className="gradient-text-white">{driver2Data.finalStandings[year].position}</span></div>
                                    </div>
                                ) : (
                                    <div className="w-[14.8rem] bg-glow-dark pl-16 py-2 gradient-text-white rounded-r-[1rem]">DNC</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </>
        );
    };

    const DriverImage = (driverCode) => {
        const randomNumber = Math.floor(Math.random() * 5) + 1;
    
        const imageUrl = driverCode ? 
          `${process.env.PUBLIC_URL + "/images/2024/drivers/" + driverCode + ".png"}` 
          : `${process.env.PUBLIC_URL + "/images/2024/drivers/default" + randomNumber + ".png"}`;
      
        const handleError = (event) => {
          event.target.src = `${process.env.PUBLIC_URL + "/images/2024/drivers/default" + randomNumber + ".png"}`;
        };
      
        return (
          <img 
            alt="Driver" 
            className="w-[15rem] md:w-[22rem]"
            src={imageUrl}
            onError={handleError}
          />
        );
    };

    const splitName = (name) => {
        return name.split(' ');
    }
    const statLine = (label, stat, rate, last) => (
        <>
        <div className={classNames(
            "",
        )}>
            <div className={classNames(
                "gradient-text-white",
                "flex flex-col md:flex-row items-center justify-center", 
            )}>
                <span className="tracking-xs uppercase gradient-text-light text-sm md:text-right md:w-96">{label}</span>
                <span className="font-display text-[2rem] sm:text-[2rem] leading-none md:text-center md:w-64">{stat}</span>
                <span className="text-sm md:w-32">{rate && rate}</span>
            </div>
        </div>
        {!last && <div className="divider-glow-dark mt-8" />}
        </>
    );

    const driverCard = (firstName, LastName, driverData) => {

        const mainData = (
            <div className="flex flex-col justify-center py-16 w-full md:-ml-32">
                {statLine('Wins', driverData.totalWins, `${parseFloat(driverData.winRate * 100).toFixed()}%`)}
                {statLine('Podiums', driverData.totalPodiums, `${parseFloat(driverData.podiumRate * 100).toFixed()}%`)}
                {statLine('Poles', driverData.totalPoles, `${parseFloat(driverData.poleRate * 100).toFixed()}%`)}
                {statLine('DNFs', driverData.totalDNFs, `${parseFloat(driverData.dnfRate * 100).toFixed()}%`, true)}
            </div>
        )
        const otherData = (
            <div className="flex flex-col justify-center py-16 w-full">
                {/* {statLine('Wins', driverData.totalWins, `${parseFloat(driverData.winRate * 100).toFixed()}%`)}
                {statLine('Podiums', driverData.totalPodiums, `${parseFloat(driverData.podiumRate * 100).toFixed()}%`)}
                {statLine('Poles', driverData.totalPoles, `${parseFloat(driverData.poleRate * 100).toFixed()}%`)}
                {statLine('DNFs', driverData.totalDNFs, null, true)} */}
            </div>
        )

        return (
            <div> 
                <div 
                    className={classNames(
                        "flex flex-col items-center max-w-[16rem] md:max-w-[60rem] bg-glow-dark rounded-[2.4rem] relative",
                        // "before:content-[''] before:absolute before:top-[0] before:left-[0] before:w-full before:h-full before:bg-gradient-to-t before:from-neutral-950 before:to-neutral-950/0 before:rounded-b-[1.2rem]"
                    )}
                >
                    <div className="-mt-32 z-[1] md:flex md:items-end">
                        {DriverImage(driverData.driverCode)}
                        <div className="max-md:hidden">{mainData}</div>
                    </div>
                    <div className="constructor-stand bg-glow-md py-8 md:py-16 mt-4 w-[110%] text-center">
                        <p className="gradient-text-light uppercase tracking-xs -mb-8">{firstName}</p>
                        <h2 className="font-display md:text-[3.2rem] gradient-text-white">{LastName}</h2>
                    </div>
                    <div className="md:hidden w-full">{mainData}</div>
                    <div className="divider-glow-dark -mt-4 -mb-12 md:hidden " />
                    {otherData}
                </div>
            </div>
        )
    }

    const StatRow = ({ label, value1, value2 }) => (
        <tr className="border-b border-neutral-700">
          <td className="py-2 px-4 text-left text-neutral-400">{label}</td>
          <td className="py-2 px-4 text-right gradient-text-white">{value1}</td>
          <td className="py-2 px-4 text-right gradient-text-white">{value2}</td>
        </tr>
      );
      
    const PeakSeasonRow = ({ category, data1, data2 }) => (
        <tr className="border-b border-neutral-700">
          <td className="py-2 px-4 text-left text-neutral-400">{category.charAt(0).toUpperCase() + category.slice(1)}</td>
          <td className="py-2 px-4 text-right gradient-text-white">
            {data1.season} ({data1[category]})
          </td>
          <td className="py-2 px-4 text-right gradient-text-white">
            {data2.season} ({data2[category]})
          </td>
        </tr>
    );

    const ConsistencyTable = ({ title, data1, data2, driver1, driver2, formatFunc }) => (
        <div className="mb-8">
          <h2 className="heading-4 text-neutral-400 ml-24 mt-8 mb-4">{title}</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-glow-dark rounded-[1.2rem]">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="py-4 px-4 text-left text-neutral-400">Metric (Per Season)</th>
                  <th className="py-4 px-4 text-right gradient-text-white">{driver1}</th>
                  <th className="py-4 px-4 text-right gradient-text-white">{driver2}</th>
                </tr>
              </thead>
              <tbody>
                <StatRow label="Wins" value1={formatFunc(data1.wins)} value2={formatFunc(data2.wins)} />
                <StatRow label="Podiums" value1={formatFunc(data1.podiums)} value2={formatFunc(data2.podiums)} />
                <StatRow label="Poles" value1={formatFunc(data1.poles)} value2={formatFunc(data2.poles)} />
                <StatRow label="Points" value1={formatFunc(data1.points)} value2={formatFunc(data2.points)} />
              </tbody>
            </table>
          </div>
        </div>
    );
      
    const DriverStatsSection = ({ driver1, driver2, driver1Data, driver2Data }) => {
        // const formatDecimal = (value) => (value * 100).toFixed(2) + '%';
        const formatNumber = (value) => value.toFixed(2);
      
        return (
          <div className="mb-96">
            <h2 className="heading-4 text-neutral-400 ml-24 mb-8">Driver Statistics Comparison</h2>
            
            <ConsistencyTable 
              title="Coefficient of Variation (lower is more consistent)"
              data1={driver1Data.consistency.cv} 
              data2={driver2Data.consistency.cv} 
              driver1={driver1} 
              driver2={driver2} 
              formatFunc={formatNumber}
            />
      
            <ConsistencyTable 
              title="Mean"
              data1={driver1Data.consistency.mean} 
              data2={driver2Data.consistency.mean} 
              driver1={driver1} 
              driver2={driver2} 
              formatFunc={formatNumber}
            />
      
            <ConsistencyTable 
              title="Standard Deviation"
              data1={driver1Data.consistency.std} 
              data2={driver2Data.consistency.std} 
              driver1={driver1} 
              driver2={driver2} 
              formatFunc={formatNumber}
            />
      
            <h2 className="heading-4 text-neutral-400 ml-24 mt-16 mb-8">Peak Seasons</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-glow-dark rounded-[1.2rem]">
                <thead>
                  <tr className="border-b border-neutral-700">
                    <th className="py-4 px-4 text-left text-neutral-400">Category</th>
                    <th className="py-4 px-4 text-right gradient-text-white">{driver1}</th>
                    <th className="py-4 px-4 text-right gradient-text-white">{driver2}</th>
                  </tr>
                </thead>
                <tbody>
                  <PeakSeasonRow category="wins" data1={driver1Data.peakSeason.wins} data2={driver2Data.peakSeason.wins} />
                  <PeakSeasonRow category="podiums" data1={driver1Data.peakSeason.podiums} data2={driver2Data.peakSeason.podiums} />
                  <PeakSeasonRow category="poles" data1={driver1Data.peakSeason.poles} data2={driver2Data.peakSeason.poles} />
                </tbody>
              </table>
            </div>
          </div>
        );
    };


    return(
        <div className='global-container px-8'>
            <h2 className='heading-2 text-center mb-40 text-neutral-400'>Drivers Comparison</h2>
            {isLoading ? (
                <Loading className="mt-[20rem] mb-[20rem]" message={`Comparing ${driversList.find(q=> q.id === driver1).name} and ${driversList.find(q=> q.id === driver2).name}`} />
            ) : (
                <div>
                    <div className="flex max-md:flex-col justify-center items-center gap-16 z-[2] relative max-w-[45rem] m-auto">
                        <ReactSelectComponent
                            placeholder="Select Driver 1"
                            options={driversList.sort((a,b) => a.name-b.name).map(driver => ({ value: driver.id, label: driver.name }))}
                            onChange={(selectedOption) => setInputDriver1(selectedOption)}
                        />
                        <ReactSelectComponent
                            placeholder="Select Driver 2"
                            options={driversList.map(driver => ({ value: driver.id, label: driver.name }))}
                            onChange={(selectedOption) => setInputDriver2(selectedOption)}
                        />
                    </div>

                    <Button className="mx-auto block mt-16" onClick={handleCompare} buttonStyle="solid" type='submit'>Compare</Button>

                    {driver1Data && driver2Data && (
                        <div>

                            <div className='flex justify-center gap-24 md:gap-48 mt-64 mb-64'>
                                {driverCard(
                                    splitName(driversList.find(q=> q.id === driver1).name)[0], 
                                    splitName(driversList.find(q=> q.id === driver1).name)[1], 
                                    driver1Data
                                )}
                                {driverCard(
                                    splitName(driversList.find(q=> q.id === driver2).name)[0], 
                                    splitName(driversList.find(q=> q.id === driver2).name)[1], 
                                    driver2Data
                                )}
                            </div>

                            {competingYears.length > 0 && (
                                <>
                                    <div className="flex justify-center gap-32">
                                        <Button 
                                            className={classNames({'active' : displayCompetingYears})} 
                                            onClick={() => setDisplayCompetingYears(true)} 
                                            buttonStyle="solid" 
                                            active={displayCompetingYears}
                                        >
                                            Show Competing Years
                                        </Button>
                                        <Button 
                                            className={classNames({'active' : displayCompetingYears})} 
                                            onClick={() => setDisplayCompetingYears(false)} 
                                            buttonStyle="solid" 
                                            active={!displayCompetingYears}
                                        >
                                            Show All Years
                                        </Button>
                                    </div>
                                    <div className="divider-glow-dark -mt-[3rem] mb-64 max-md:w-[200%] max-md:ml-[-50%]" />
                                </>
                            )}
                            
                            <div className="comparison-container mb-96">
                                <h2 className="heading-4 text-neutral-400 text-center mb-24">Season Points & Standings</h2>
                                <div className="driver-comparison-row w-[38rem] m-auto mb-24">
                                    <div className="flex justify-center gap-64 gradient-text-light text-sm">
                                        <div>{driversList.find(q => q.id === driver1)?.name}</div>
                                        Year
                                        <div>{driversList.find(q => q.id === driver2)?.name}</div>
                                    </div>
                                    <div className="flex items-center justify-center font-display">
                                        <div className="bg-black px-16 py-2 rounded-l-[1rem]"><span className="gradient-text-white">position</span></div>
                                        <div className="bg-glow bg-neutral-900 max-sm:px-24 sm:px-48 py-2"><span className="gradient-text-white">points</span></div>
                                        <div className="bg-black px-16 py-2 rounded-r-[1rem]"><span className="gradient-text-white">position</span></div>
                                    </div>
                                </div>
                                {renderFinalStandings()}
                            </div>

                            {displayCompetingYears && ( 
                                <>
                                    <h2 className="heading-4 text-neutral-400 ml-24">Race Position Comparison</h2>
                                    <p className="text-sm text-neutral-400 mb-16 ml-24 leading-none">* Only seasons both drivers competed against each other</p> 
                                    <LineChartByYear
                                        className="mb-96"
                                        driver1Name={driversList.find(q=> q.id === driver1).name}
                                        driver2Name={driversList.find(q=> q.id === driver2).name}
                                        driver1Data={driver1Data.racePosition}
                                        driver2Data={driver2Data.racePosition}
                                        competingYears={competingYears}
                                        displayCompetingYears={displayCompetingYears}
                                        type="position"
                                    />
                                    <h2 className="heading-4 text-neutral-400 ml-24">Qualifying Position Comparison</h2>
                                    <p className="text-sm text-neutral-400 mb-16 ml-24 leading-none">* Only seasons both drivers competed against each other</p> 
                                    <LineChartByYear
                                        className="mb-96"
                                        driver1Name={driversList.find(q=> q.id === driver1).name}
                                        driver2Name={driversList.find(q=> q.id === driver2).name}
                                        driver1Data={driver1Data.qualiPosition}
                                        driver2Data={driver2Data.qualiPosition}
                                        competingYears={competingYears}
                                        displayCompetingYears={displayCompetingYears}
                                        type="position"
                                    />
                                    <h2 className="heading-4 text-neutral-400 ml-24">Points after each race</h2>
                                    <p className="text-sm text-neutral-400 mb-16 ml-24 leading-none">* Only seasons both drivers competed against each other</p> 
                                    <LineChartByYear
                                        className="mb-96"
                                        driver1Name={driversList.find(q=> q.id === driver1).name}
                                        driver2Name={driversList.find(q=> q.id === driver2).name}
                                        driver1Data={driver1Data.posAfterRace}
                                        driver2Data={driver2Data.posAfterRace}
                                        competingYears={competingYears}
                                        displayCompetingYears={displayCompetingYears}
                                    />
                                </>
                            )}

                            <DriverStatsSection
                                driver1={driversList.find(q => q.id === driver1)?.name}
                                driver2={driversList.find(q => q.id === driver2)?.name}
                                driver1Data={driver1Data}
                                driver2Data={driver2Data}
                            />

                            <h2 className="heading-4 text-neutral-400 ml-24">Finish positions</h2>
                            <p className="mb-16 text-neutral-400 ml-24">Number of times position achieved</p>
                            <BarChartTotal
                                className="mb-96"
                                driver1Name={driversList.find(q => q.id === driver1)?.name}
                                driver2Name={driversList.find(q => q.id === driver2)?.name}
                                driver1Data={driver1Data.racePosition} 
                                driver2Data={driver2Data.racePosition}
                            />

                            <h2 className="heading-4 text-neutral-400 ml-24">Qualifying positions</h2>
                            <p className="mb-16 text-neutral-400 ml-24">Number of times position achieved</p>
                            <BarChartTotal
                                className="mb-96"
                                driver1Name={driversList.find(q => q.id === driver1)?.name}
                                driver2Name={driversList.find(q => q.id === driver2)?.name}
                                driver1Data={driver1Data.qualiPosition}
                                driver2Data={driver2Data.qualiPosition}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};