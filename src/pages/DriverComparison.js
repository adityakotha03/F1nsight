import React, { useEffect, useState } from 'react';
import { fetchDriverStats, fetchDriversList } from '../utils/api';
import { Loading, LineChartByYear, BarChartTotal } from "../components";
import Select from 'react-select';
import classNames from 'classnames';

export function DriverComparison(){
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

    useEffect(() => {
        const loadDrivers = async () => {
            const drivers = await fetchDriversList();
            setDriversList(drivers);
        };
        loadDrivers();
    },[])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if(driver1 && driver2){
                const DriversData = await fetchDriverStats(driver1, driver2);

                setDriver1Data(DriversData.driver1);
                setDriver2Data(DriversData.driver2);

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
        setDriver1(inputdriver1.value);
        setDriver2(inputdriver2.value);
        setInputDriver1('');
        setInputDriver2('');
    };

    const customStyles = {
        option: (provided) => ({
            ...provided,
            color: 'black'
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#e5e5e5' : '#737373',
            background: 'rgb(38 38 38 / 0.1)',
            boxShadow: 'inset 0 0 2.4rem 0 rgba(255, 255, 255, .25), 0 0 2.4rem 0 rgba(0, 0, 0, .55)',
            color: '#f1f1f1',
            borderRadius: '1.2rem',
            padding: '.8rem',
        }),
        input: (styles, state) => ({
            ...styles,
            color: '#f1f1f1',
        }),
        placeholder: (styles) => ({ 
            ...styles, 
            color: '#cccccc',
        }),
        singleValue: (styles) => ({ 
            ...styles, 
            color: '#f1f1f1',
        }),
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
        const imageUrl = driverCode ? 
          `${process.env.PUBLIC_URL + "/images/2024/drivers/" + driverCode + ".png"}` 
          : `${process.env.PUBLIC_URL + "/images/2024/drivers/default.png"}`;
      
        const handleError = (event) => {
          event.target.src = `${process.env.PUBLIC_URL + "/images/2024/drivers/default.png"}`;
        };
      
        return (
          <img 
            alt="Driver" 
            src={imageUrl}
            width={150} 
            height={150} 
            onError={handleError}
          />
        );
    };

    const splitName = (name) => {
        return name.split(' ');
    }
    const statLine = (label, stat, rate) => (
        <div className={classNames(
            "bg-glow-dark-shadow bg-gradient-to-r from-neutral-900 to-neutral-700 rounded-[1rem] -mx-8 py-8 px-12 mb-8",
            "flex max-sm:flex-col-reverse max-sm:justify-center sm:justify-between items-center"
        )}>
            <div className="tracking-xs uppercase gradient-text-light sm:mr-32 text-sm">{label}</div>
            <div className="gradient-text-white">
                <span className="font-display max-sm:text-[3.2rem] sm:text-[2rem] leading-none">{stat}</span>
                <span className="text-sm"> / {rate}</span></div>
            </div>
    );

    const driverCard = (firstName, LastName, driverData) => {
        return (
            <div> 
                <div 
                    className={classNames(
                        "flex flex-col items-center max-w-[30rem] bg-glow-dark px-16 rounded-[1.2rem] relative",
                        "before:content-[''] before:absolute before:top-[0] before:left-[0] before:w-full before:h-full before:bg-gradient-to-t before:from-neutral-950 before:to-neutral-950/0 before:rounded-b-[1.2rem]"
                    )}
                >
                    <div className="-mt-32">{DriverImage(driverData.driverCode)}</div>
                    <div className="flex items-center flex-col absolute bottom-[0]">
                        <p className="gradient-text-light uppercase tracking-wide -mb-8">{firstName}</p>
                        <h2 className="font-display text-[2rem] mb-6 gradient-text-white">{LastName}</h2>
                    </div>
                </div>
                <div className="bg-glow-dark rounded-b-[1.2rem] mx-8 py-16">
                    {statLine('Wins', driverData.totalWins, `${parseFloat(driverData.winRate * 100).toFixed()}%`)}
                    {statLine('Podiums', driverData.totalPodiums, `${parseFloat(driverData.podiumRate * 100).toFixed()}%`)}
                    {statLine('Poles', driverData.totalPoles, `${parseFloat(driverData.poleRate * 100).toFixed()}%`)}
                    {statLine('DNFs', driverData.totalDNFs, `${parseFloat(driverData.dnfRate * 100).toFixed()}%`)}
                </div>
            </div>
        )
    }


    return(
        <div className='global-container'>
            <h2 className='heading-2 text-center mb-40 text-neutral-400'>Drivers Comparison</h2>
            {isLoading ? (
                <Loading className="mt-[20rem] mb-[20rem]" message={`Comparing ${driversList.find(q=> q.id === driver1).name} and ${driversList.find(q=> q.id === driver2).name}`} />
            ) : (
                <div>
                    <div className="flex max-md:flex-col items-center gap-16">
                        <Select
                            placeholder="Select Driver 1"
                            options={driversList.map(driver => ({ value: driver.id, label: driver.name }))}
                            onChange={(selectedOption) => setInputDriver1(selectedOption)}
                            styles={customStyles}
                            className="w-full"
                        />
                        <Select
                            placeholder="Select Driver 2"
                            options={driversList.map(driver => ({ value: driver.id, label: driver.name }))}
                            onChange={(selectedOption) => setInputDriver2(selectedOption)}
                            styles={customStyles}
                            className="w-full"
                        />
                    </div>

                    <button className="bg-plum-500 shadow-12-dark py-8 px-16 rounded mt-16 mb-32 mx-auto block" onClick={handleCompare} type='submit'>Compare</button>

                    {driver1Data && driver2Data && (
                        <div>

                            <div className='flex justify-center gap-16 mt-64 mb-64'>
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
                                    <button
                                        className={`px-16 py-8 rounded ${displayCompetingYears ? 'bg-plum-500 shadow-12-dark' : 'bg-glow-dark bg-neutral-900'}`}
                                        onClick={() => setDisplayCompetingYears(true)}
                                    >
                                        Show Competing Years
                                    </button>
                                    <button
                                        className={`px-16 py-8 rounded ${!displayCompetingYears ? 'bg-plum-500 shadow-12-dark' : 'bg-glow-dark bg-neutral-900'}`}
                                        onClick={() => setDisplayCompetingYears(false)}
                                    >
                                        Show All Years
                                    </button>
                                </div>
                                 <div className="divider-glow-dark -mt-20 mb-64 max-md:w-[200%] max-md:ml-[-50%]" />
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