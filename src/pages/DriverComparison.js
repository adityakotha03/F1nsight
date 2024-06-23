import React, { useEffect, useState } from 'react';
import { fetchDriverStats, fetchDriversList } from '../utils/api';
import { Loading } from "../components"
import Select from 'react-select';

export function DriverComparison(){
    const [driversList, setDriversList] = useState([]);
    const [driver1, setDriver1] = useState('');
    const [driver2, setDriver2] = useState('');
    const [inputdriver1, setInputDriver1] = useState('');
    const [inputdriver2, setInputDriver2] = useState('');
    const [driver1Data, setDriver1Data] = useState(null);
    const [driver2Data, setDriver2Data] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


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
                // console.log("blah", DriversData);
                setDriver1Data(DriversData.driver1);
                setDriver2Data(DriversData.driver2);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [driver1, driver2]);

    const handleCompare = () => {
        setDriver1(inputdriver1.value);
        setDriver2(inputdriver2.value);
        console.log("herewego", driver1);
        setInputDriver1('');
        setInputDriver2('');
    };

    const customStyles = {
        option: (provided) => ({
            ...provided,
            color: 'black'
        })
    };

    const renderDriverStats = (driverData, driverLabel) => (
        <div>
            <h2>{driverLabel}</h2>
            <h3>Final Standings</h3>
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Position</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(driverData.finalStandings).map(([year, data]) => (
                        <tr key={year}>
                            <td>{year}</td>
                            <td>{data.position}</td>
                            <td>{data.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    
            <h3>Race Positions</h3>
            {Object.entries(driverData.racePosition).map(([year, data]) => (
                <div key={year}>
                    <h4>{year}</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Race Name</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(data.positions).map(([raceName, position]) => (
                                <tr key={raceName}>
                                    <td>{raceName}</td>
                                    <td>{position}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            <h3>Positions After Each Race</h3>
                {Object.entries(driverData.posAfterRace).map(([year, data]) => (
                    <div key={year}>
                        <h4>{year}</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Race Name</th>
                                    <th>Position In Driver Standings</th>
                                    <th>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data.pos).map(([raceName, details]) => (
                                    <tr key={raceName}>
                                        <td>{raceName}</td>
                                        <td>{details.positionInDriverStandings}</td>
                                        <td>{details.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            <h3>Qualifying Positions</h3>
            {Object.entries(driverData.qualiPosition).map(([year, data]) => (
                <div key={year}>
                    <h4>{year}</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Race Name</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(data.positions).map(([raceName, position]) => (
                                <tr key={raceName}>
                                    <td>{raceName}</td>
                                    <td>{position}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
    
            <h3>Total Statistics</h3>
            <ul>
                <li>Total Wins: {driverData.totalWins}</li>
                <li>Total Podiums: {driverData.totalPodiums}</li>
                <li>Total Poles: {driverData.totalPoles}</li>
            </ul>
        </div>
      );

    const renderFinalStandings = () => {
        
        const allYears = new Set([
            ...Object.keys(driver1Data.finalStandings),
            ...Object.keys(driver2Data.finalStandings)
        ])
        
        return (
            <table className='comparison-table'>
                <thead>
                    <tr className='table-header'>
                    <th>Year</th>
                    <th>{driversList.find(q => q.id === driver1Data.driverId).name}</th>
                    <th>{driversList.find(q => q.id === driver2Data.driverId).name}</th>
                    </tr>
                </thead>
                <tbody>
                    {[...allYears].map((year) => (
                    <tr key={year} className='table-row'>
                        <td>{year}</td>
                        <td>
                        {driver1Data.finalStandings[year] ? (
                            `${driver1Data.finalStandings[year].position} (${driver1Data.finalStandings[year].points} points)`
                        ) : (
                            "DNC"
                        )}
                        </td>
                        <td>
                        {driver2Data.finalStandings[year] ? (
                            `${driver2Data.finalStandings[year].position} (${driver2Data.finalStandings[year].points} points)`
                        ) : (
                            "DNC"
                        )}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        );
    };
    return(
        <div className='global-container'>
            <h2 className='heading-2 text-center mb-40 text-neutral-400'>Drivers Comparison</h2>
            {isLoading ? (
                <Loading className="mt-[20rem] mb-[20rem]" message={`Comparing ${driversList.find(q=> q.id === driver1).name} and ${driversList.find(q=> q.id === driver2).name}`} />
            ) : (
                <div>
                    <Select
                        placeholder="Select Driver 1"
                        options={driversList.map(driver => ({ value: driver.id, label: driver.name }))}
                        onChange={(selectedOption) => setInputDriver1(selectedOption)}
                        styles={customStyles}
                    />
                    <Select
                        placeholder="Select Driver 2"
                        options={driversList.map(driver => ({ value: driver.id, label: driver.name }))}
                        onChange={(selectedOption) => setInputDriver2(selectedOption)}
                        styles={customStyles}
                    />
                    {/* <input
                        type='text'
                        placeholder='Enter Driver 1 ID'
                        value={inputdriver1}
                        onChange={(e) => setInputDriver1(e.target.value)}
                    />
                    <input
                        type='text'
                        placeholder='Enter Driver 2 ID'
                        value={inputdriver2}
                        onChange={(e) => setInputDriver2(e.target.value)}
                    /> */}
                    <button onClick={handleCompare} type='submit'>Compare</button>
                    {driver1Data && driver2Data && (
                        <div>
                            <div className='comparison-container'>
                                <h2 className='heading-2 text-center mb-40 text-neutral-400'>{driversList.find(q=> q.id === driver1).name} vs {driversList.find(q=> q.id === driver2).name}</h2>
                                <h3 className="comparison-title">Final Standings</h3>
                                {renderFinalStandings()}
                            </div>
                            {renderDriverStats(driver1Data, driversList.find(q=> q.id === driver1).name)}
                            {renderDriverStats(driver2Data, driversList.find(q=> q.id === driver2).name)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};