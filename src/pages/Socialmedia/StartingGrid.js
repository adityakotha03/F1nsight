import classNames from "classnames";
import React from "react";
import { darkenColor } from "../../utils/darkenColor";
import { ReactComponent as Logo } from "../../components/f1nsight-outlined.svg";

const StartingGrid = ({ startingGrids, raceName }) => {
    if (!startingGrids || startingGrids.length === 0) {
        return <div className="social-media-container">No starting grid data available.</div>;
    }

    const startingGridItem = (driver, reversed = false) => {
        const colorgradientStyletoRight = {
            background: `linear-gradient(to right, ${darkenColor(driver.driver.team_colour)}30, ${darkenColor(driver.driver.team_colour)}90)`,
            backgroundColor: '#000000'
        }
        const colorgradientStyletoLeft = {
            background: `linear-gradient(to left, ${darkenColor(driver.driver.team_colour)}30, ${darkenColor(driver.driver.team_colour)}90)`,
            backgroundColor: '#000000'   
        }
        
        return (
            <div className={classNames("starting-grid--item flex w-full h-[56px] relative", reversed ? "flex-row-reverse" : "flex-row")}
            >
                <div 
                    style={{
                        left: reversed ? "0" : "auto",
                        right: reversed ? "auto" : "0" 
                    }} 
                    className={classNames("divider-glow-dark absolute top-0 !h-8 !w-3/4")} 
                />
                <div className={classNames("flex flex-row items-center w-[64px] ", reversed ? "flex-row-reverse" : "flex-row")}>
                    <img
                        alt=""
                        className="drop-shadow-[0_0_7px_rgba(0,0,0,0.90)]"
                        src={`${
                            process.env.PUBLIC_URL + "/images/2025/carTopView/" + driver.driver.constructorId + ".png"
                        }`}
                        width={27}
                    />
                    <div className={classNames("flex flex-col", reversed ? "items-end" : "items-start")}>
                        <p className="font-display text-sm text-white leading-none">P{driver.position}</p>
                        <p className="font-display text-xs text-neutral-400 leading-none ">{driver.driver?.name_acronym || 'Unknown'}</p>
                    </div>
                </div>
                <div style={reversed ? colorgradientStyletoRight : colorgradientStyletoLeft} className={classNames("grow flex flex-row items-center", reversed ? "flex-row-reverse" : "flex-row")}>
                    <img
                        alt=""
                        className="drop-shadow-[0_0_14px_rgba(0,0,0,0.75)]"
                        src={`${
                            process.env.PUBLIC_URL + "/images/2025/drivers/" + driver.driver.name_acronym + ".png"
                        }`}
                        width={56}
                    />
                    <div className={classNames("flex flex-col", reversed ? "items-end -mr-12" : "items-start -ml-12")}>
                        <p className="text-xs leading-none gradient-text tracking-xs uppercase ">{driver.driver?.first_name || 'Unknown'}</p>
                        <p className={("text-sm font-display leading-none gradient-text -mt-1")}>{driver.driver?.last_name || 'Unknown'}</p>
                    </div>
                </div>
            </div>
        )
    }

    const headerFooterBG = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/socialBGarrows.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#111111"
    }

    const decorations = [
        { top: "-320px", left: "-200px"},
        { top: "100px", left: "300px"},
        { top: "350px", left: "-230px"},
        { top: "730px", left: "300px"},
    ]

    return (
        <div className="relative starting-grid overflow-hidden">
            {startingGrids.map((startingGrid) => (
                <div 
                    className="social-media-container flex flex-col justify-between" 
                    key={startingGrid.session_key}
                    style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/bg.png)` }}
                >
                    <div
                        style={headerFooterBG}
                        className="starting-grid--header flex flex-col items-center justify-center leading-none py-32"
                    >
                        <p className="text-lg font-display z-10">Starting Grid</p>
                        <p className="text-xs uppercase tracking-sm z-10">{raceName} {startingGrid.session_name}</p>
                    </div>
                    <div className="starting-grid--columns flex flex-row my-16 z-10">
                        {/* Left Column - Odd Indexes */}
                        <div className="grow relative">
                            {startingGrid.grid
                                .filter((_, idx) => idx % 2 === 0) // Odd positions (0, 2, 4, etc.)
                                .map((SGdriver, idx) => (
                                    <div key={SGdriver.driver_number || idx}>
                                        {startingGridItem(SGdriver, true)}
                                    </div>
                                ))}
                            <div className={classNames("divider-glow-dark-vertical absolute top-[0] right-[54px] rotate-180")} />
                        </div>
                        
                        {/* Right Column - Even Indexes */}
                        <div className="grow mt-24 relative">
                            {startingGrid.grid
                                .filter((_, idx) => idx % 2 === 1) // Even positions (1, 3, 5, etc.)
                                .map((SGdriver, idx) => (
                                    <div key={SGdriver.driver_number || idx}>
                                        {startingGridItem(SGdriver, false)}
                                    </div>
                                ))}
                            <div className={classNames("divider-glow-dark-vertical absolute top-[0] left-[54px]")} />
                        </div>
                    </div>
                    <div
                        style={headerFooterBG}
                        className="starting-grid--footer flex flex-col items-center justify-center leading-none py-16"
                    >
                        <Logo className="h-32" />
                    </div>
                </div>
            ))}

            {decorations.map((decoration, index) => (
                <img 
                    alt=""
                    style={decoration} 
                    className="absolute z-[0] opacity-20" 
                    src={`${process.env.PUBLIC_URL + "images/plusPatternGray.svg"}`}
                    width={400} 
                    key={index}
                />
            ))}
        </div>
    );
};

export default StartingGrid;
