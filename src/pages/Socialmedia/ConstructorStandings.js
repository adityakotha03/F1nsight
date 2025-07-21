import React, { useEffect, useState } from "react";
import axios from "axios";
import { getConstructorStandings } from "./api";
import { darkenColor } from "../../utils/darkenColor";
import { ReactComponent as Logo } from "../../components/f1nsight-outlined.svg";
import { getPositionChange, storeStandings } from "./utils";

const ConstructorStandings = ({ location, round }) => {
    const [constructorStandings, setConstructorStandings] = useState(null);
    const [teamColors, setTeamColors] = useState({});

    useEffect(() => {
        getConstructorStandings().then((standings) => {
            setConstructorStandings(standings);
            storeStandings('constructorStandings', standings); // Store for next comparison
        });
        
        axios.get('https://praneeth7781.github.io/f1nsight-api-2/colors/teams.json')
            .then(res => setTeamColors(res.data["2025"] || {}));
    }, []);

    console.log('constructorStandings', constructorStandings);
    console.log('teamColors', teamColors);

    if (!constructorStandings || constructorStandings.length === 0) {
        return <div className="social-media-container">Loading constructor standings...</div>;
    }

    const contructorItem = (standing) => {
        const color = teamColors[standing.constructor.constructorId]
            ? `#${teamColors[standing.constructor.constructorId]}`
            : "#222";
        const positionChange = getPositionChange(standing.position, standing.constructor.constructorId, 'constructorStandings');
        
        return (
            <div className="standing-item w-full flex flex-col items-center" key={standing.constructor.constructorId}>
                <img
                    alt=""
                    className="z-10 -mb-4"
                    style={{
                        filter: `drop-shadow(0 0 16px ${darkenColor(color)}) drop-shadow(0 2px 8px #0008)`
                    }}
                    src={`${
                        process.env.PUBLIC_URL + "/images/2025/cars/" + standing.constructor.constructorId + ".png"
                    }`}
                    width={120}
                />
                <div className="constructor-stand flex flex-row justify-between w-full bg-glow">
                    <div className="bg-neutral-900/50 w-32 rounded-r-sm text-center flex items-center justify-center gap-2" style={{ borderRight: `2px solid ${color}` }}>
                        <span>{standing.position}</span>
                        {positionChange && positionChange !== 0 && (
                            <span className={positionChange > 0 ? 'text-green-400' : 'text-red-400'}>
                                {positionChange > 0 ? `+${positionChange}` : positionChange}
                            </span>
                        )}
                    </div>
                    <p>{standing.constructor.name}</p>
                    <div className="bg-neutral-900/50 w-40 rounded-l-sm text-center" style={{ borderLeft: `2px solid ${color}` }}>{standing.points}</div>
                </div>
            </div>
        )
    }

    return (
        <div 
            className="social-constructor-standings social-media-container grid grid-cols-2 relative"
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg.png)` }}
        >
            <div className="leading-none absolute top-24 left-40">
                <div className="font-display mx-auto w-fit">
                    <p className=" text-neutral-400 text-[20px] ">2025</p>
                    <p className="text-gradient text-[20px]">Constructor</p>
                    <p className="text-gradient text-[25px]">Standings</p>
                </div>
                <hr className="w-full border-2 border-[#303030] my-16" />
                <div className="text-center uppercase text-xs text-neutral-400 tracking-sm">
                    <p>After round {round}</p>
                    <p>@ {location}</p>
                </div>
            </div>
            <img src={`${process.env.PUBLIC_URL}/images/constructorGraphic.png`} alt="constructor graphic" className="w-full" />
            <div className="divider-glow-dark-vertical rotate-180 absolute top-0 left-[220px]" />
            <div className="social-constructor-standings--teams flex flex-col items-center justify-between py-32 px-12">
                {constructorStandings.map((standing) => (
                    contructorItem(standing)
                ))}
            </div>
            <Logo className="h-32 absolute bottom-32 left-[78px]" />
        </div>
    );
};

export default ConstructorStandings;
