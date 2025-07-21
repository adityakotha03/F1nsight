import React, { useEffect, useState } from "react";
import axios from "axios";
import { getDriverStandings } from "./api";
import { ReactComponent as Logo } from "../../components/f1nsight-outlined.svg";
import { darkenColor } from "../../utils/darkenColor";
import { getPositionChange, storeStandings } from "./utils";

const DriverStandings = ({ location, round }) => {
    const [driverStandings, setDriverStandings] = useState(null);
    const [teamColors, setTeamColors] = useState({});

    useEffect(() => {
        getDriverStandings().then((standings) => {
            setDriverStandings(standings);
            storeStandings('driverStandings', standings); // Store for next comparison
        });
        axios.get('https://praneeth7781.github.io/f1nsight-api-2/colors/teams.json')
            .then(res => setTeamColors(res.data["2025"] || {}));
    }, []);

    console.log('driverStandings', driverStandings);

    if (!driverStandings || driverStandings.length === 0) {
        return <div className="social-media-container">Loading driver standings...</div>;
    }

    const Top3 = ({ driverData }) => {
        const color = teamColors[driverData.constructor.constructorId]
            ? `#${teamColors[driverData.constructor.constructorId]}`
            : "#222";
        const positionChange = getPositionChange(driverData.position, driverData.driver.driverId);
        
        return (
            <div className="top-three-driver bg-neutral-900 bg-glow-dark rounded-lg flex flex-row items-center">
                <div 
                    className="ml-8 rounded-md -mb-16"
                    style={{
                        background: `linear-gradient(to right, ${darkenColor(color)} 0%, #0000 100%)`,
                        backgroundColor: '#000000'
                    }}
                >
                    <div className="w-[70px] h-[150px] items-center justify-end overflow-hidden rounded-md -mt-32">
                        <img className="max-w-[220%] -ml-[40px]" src={`${process.env.PUBLIC_URL}/images/2025/drivers/${driverData.driver.code}.png`} alt={driverData.driver.givenName} />
                    </div>
                </div>
                <div className="grow pr-16 py-16">
                    <div className="flex flex-row items-end gap-4 font-display leading-none mb-4">
                        <span>{driverData.position}</span>
                        {/* {positionChange && positionChange !== 0 && (
                            <span className={positionChange > 0 ? 'text-green-400' : 'text-red-400'}>
                                {positionChange > 0 ? `+${positionChange}` : positionChange}
                            </span>
                        )} */}
                        <hr className="w-32 border-neutral-700 mb-2 " />
                    </div>
                    <div>
                        <p className="text-sm tracking-[2px] gradient-text-light leading-none uppercase">{driverData.driver.givenName}</p>
                        <p className="text-[15px] font-display gradient-text-white leading-none">{driverData.driver.familyName}</p>
                    </div>
                    <hr className="w-full border-neutral-700 my-6" />
                    <p className="font-display gradient-text-white text-xl text-right">{driverData.points}</p>
                    {/* {driverData.wins} */}
                </div>
            </div>
        )
    }

    const DriverRowItem = ({ driverData }) => {
        const positionChange = getPositionChange(driverData.position, driverData.driver.driverId);
        
        return (
            <div className="top-three-driver flex flex-row items-center justify-between h-[43.5px] uppercase border-b border-neutral-700 w-full">
                <div className="flex flex-row items-center gap-4 h-full">
                    <div className="text-xs font-display leading-none bg-neutral-950 flex items-center justify-center h-full w-32 -mr-16">
                        <div className="flex items-center gap-1">
                            <span className="gradient-text-white">{driverData.position}</span>
                            {/* {positionChange && positionChange !== 0 && (
                                <span className={positionChange > 0 ? 'text-green-400' : 'text-red-400'}>
                                    {positionChange > 0 ? `+${positionChange}` : positionChange}
                                </span>
                            )} */}
                        </div>
                    </div>
                    <div className="w-[41px] h-[41px] overflow-hidden flex items-start justify-center -mb-3">
                        <img className="shrink-0 max-w-[60px]" src={`${process.env.PUBLIC_URL}/images/2025/drivers/${driverData.driver.code}.png`} alt={driverData.driver.givenName} />
                    </div>
                    <div >
                        <p className="text-[8px] tracking-[2px] gradient-text-light leading-none">{driverData.driver.givenName}</p>
                        <p className="font-display gradient-text-white text-[12px] leading-none">{driverData.driver.familyName}</p>
                    </div>
                </div>
                <div className="font-display text-xs bg-neutral-950 flex items-center justify-center h-full w-32">{driverData.points}</div>
            </div>
        )
    }

    return (
        <div 
            className="social-media-container relative overflow-hidden"
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg.png)` }}
        >
            <div className="flex flex-row">
                {/* Left column: Top 3 */}
                <div className="w-1/2 leading-none">
                    <div className="font-display mx-auto w-fit mt-24">
                        <p className=" text-neutral-400 text-[20px] ">2025</p>
                        <p className="text-gradient text-[37px]">Driver</p>
                        <p className="text-gradient text-[25px]">Standings</p>
                    </div>
                    <hr className="w-full border-2 border-[#303030]  my-16" />
                    <div className="text-center uppercase text-xs text-neutral-400 tracking-sm">
                        <p>After round {round}</p>
                        <p>@ {location}</p>
                    </div>
                    <hr className="w-full border-2 border-[#303030] mt-16" />
                    <div
                        style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL}/images/bars.png)`,
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                        }}
                        className="w-full h-full pt-40 px-8 flex flex-col gap-40"
                    >
                        {driverStandings
                            .filter((driverData) => Number(driverData.position) >= 1 && Number(driverData.position) <= 3)
                            .map((driverData) => (
                                <Top3 driverData={driverData} />
                            ))}
                    </div>
                </div>
                <div className="divider-glow-dark-vertical rotate-180 absolute top-0 left-[220px] z-10" />
                {/* Right column: 4th and below */}
                <div className="w-1/2">
                    {driverStandings
                        .filter((driverData) => Number(driverData.position) > 3)
                        .map((driverData) => (
                            <DriverRowItem driverData={driverData} />
                        ))}
                </div>
            </div>
            <Logo className="h-32 absolute bottom-32 left-[78px]" />
        </div>
    );
};

export default DriverStandings;
