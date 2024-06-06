import React, { useEffect, useState } from 'react';
import { fetchDriverQualifying, fetchDriverResults, fetchDriverStandings, fetchDriverStats, getDriverStandings, fetchDriversList } from '../utils/api';

import { ConstructorDriver } from './ConstructorDriver';
import { Loading } from "./Loading"
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
        setInputDriver1('');
        setInputDriver2('');
    };

    const customStyles = {
        option: (provided) => ({
            ...provided,
            color: 'black' // Set text color to black
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

    return(
        <div className='global-container'>
            <h2 className='heading-2 text-center mb-40 text-neutral-400'>Drivers Comparison</h2>
            {isLoading ? (
                <Loading className="mt-[20rem] mb-[20rem]" message={`Comparing ${driver1} and ${driver2}`} />
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
                            <h2>Driver 1 vs Driver 2</h2>
                            <div className='driver-stats'>
                                {renderDriverStats(driver1Data, driver1)}
                                {renderDriverStats(driver2Data, driver2)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};