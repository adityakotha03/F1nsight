import React, { useEffect, useState, useRef } from "react";
import "@google/model-viewer/";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { darkenColor } from "../utils/darkenColor";
import { trackButtonClick } from "../utils/gaTracking";
import { HistoryBar } from "../components/HistoryBar";
import { teamHistory } from "../utils/teamHistory";
import teamColors from "../utils/teamColors.json";

import "./ARViewer.scss";
import { ReactSelectComponent } from "../components";

export const ARViewer = () => {
    const [glbLink, setGlbLink] = useState(ARViewer.defaultProps.glbLink);
    const [team, setTeam] = useState(ARViewer.defaultProps.team);
    const [selectedModelYear, setSelectedModelYear] = useState("2024");
    const [selectedTeamName, setSelectedTeamName] = useState(
        ARViewer.defaultProps.team.name
    );
    const [teamStatsOpen, setTeamStatsOpen] = useState(false);
    const modelViewerRef = useRef(null);

    const ref = useRef(null);

    const showHistory = team.name !== "F1Nsight" && team.name !== "apx";

    const teamList = Object.values(teamHistory);
    const teamOptions = teamList.map((teamItem) => ({
        value: teamItem.name,
        label: teamItem.name.replace(/_/g, " ").toUpperCase(),
    }));
    const getModelTeamNameForYear = (teamNameValue, yearValue) => {
        if (teamNameValue === "audi") {
            return Number(yearValue) < 2026 ? "sauber" : "audi";
        }
        return teamNameValue;
    };

    const getAvailableYearsForTeam = (teamNameValue) =>
        Object.keys(teamColors)
            .filter(
                (yearValue) =>
                    Number(yearValue) >= 2024 &&
                    Boolean(
                        teamColors[yearValue]?.[
                            getModelTeamNameForYear(teamNameValue, yearValue)
                        ]
                    )
            )
            .sort((a, b) => Number(a) - Number(b));

    const availableTeamYears = getAvailableYearsForTeam(selectedTeamName);
    const teamName = team.name.replace(/_/g, " ");
    const activeModelTeamName = selectedModelYear
        ? getModelTeamNameForYear(selectedTeamName, selectedModelYear)
        : selectedTeamName;
    const activeTeamColorHex = selectedModelYear
        ? teamColors[selectedModelYear]?.[activeModelTeamName]
        : null;
    const activeThemeColor = activeTeamColorHex ? `#${activeTeamColorHex}` : team.color;

    const setTeamModelByYear = (teamNameValue, modelYear) => {
        const validYears = getAvailableYearsForTeam(teamNameValue);
        const targetYear = validYears.includes(String(modelYear))
            ? String(modelYear)
            : validYears[validYears.length - 1];

        if (!targetYear) return;
        const modelTeamName = getModelTeamNameForYear(teamNameValue, targetYear);

        const nextTeam =
            teamList.find((teamItem) => teamItem.name === teamNameValue) ||
            ARViewer.defaultProps.team;

        setTeam(nextTeam);
        setSelectedModelYear(targetYear);
        setGlbLink(
            `${
                process.env.PUBLIC_URL +
                "/ArFiles/glbs/" +
                targetYear +
                "/" +
                modelTeamName +
                ".glb"
            }`
        );
        trackButtonClick(`team-viewer-${teamNameValue}-${targetYear}`);
    };

    const specialEditionModels = [
        {
            id: "apx",
            label: "APX",
            color: "#AE7D0E",
            glbPath: "/ArFiles/glbs/2024/apx.glb",
            imagePath: "/images/2024/cars/apx.png",
            team: { name: "apx", color: "#AE7D0E" },
            trackingId: "team-viewer-apx",
        },
        // {
        //     id: "f1nsight2022",
        //     label: "F1NSIGHT 2022",
        //     color: "#7500AD",
        //     glbPath: "/ArFiles/glbs/2024/f1nsight2022.glb",
        //     imagePath: "/images/2024/cars/f1nsight-sideview.png",
        //     team: { name: "F1Nsight", color: "#7500AD" },
        //     trackingId: "team-viewer-f1nsight2022",
        // },
        {
            id: "f1nsight2024",
            label: "F1NSIGHT 2024",
            color: "#7500AD",
            glbPath: "/ArFiles/glbs/2024/f1nsight2024.glb",
            imagePath: "/images/2024/cars/F1Nsight.png",
            team: { name: "F1Nsight", color: "#7500AD" },
            trackingId: "team-viewer-f1nsight2024",
        },
        {
            id: "f1nsight2025",
            label: "F1NSIGHT 2025",
            color: "#7500AD",
            glbPath: "/ArFiles/glbs/2025/f1nsight2025.glb",
            imagePath: "/images/2025/cars/F1Nsight.png",
            team: { name: "F1Nsight", color: "#7500AD" },
            trackingId: "team-viewer-f1nsight2025",
        },
        {
            id: "f1nsight2026",
            label: "F1NSIGHT 2026",
            color: "#7500AD",
            glbPath: "/ArFiles/glbs/2026/f1nsight2026.glb",
            imagePath: "/images/2026/cars/F1Nsight.png",
            team: { name: "F1Nsight", color: "#7500AD" },
            trackingId: "team-viewer-f1nsight2026",
        },
    ];

    const handleSpecialEditionSelect = (specialModel) => {
        setSelectedModelYear(null);
        setGlbLink(`${process.env.PUBLIC_URL}${specialModel.glbPath}`);
        setTeam(specialModel.team);
        trackButtonClick(specialModel.trackingId);
    };

    const handleTeamChange = (selectedOption) => {
        if (!selectedOption?.value) return;
        const availableYears = getAvailableYearsForTeam(selectedOption.value);
        const latestYear =
            availableYears[availableYears.length - 1] || "2026";
        setSelectedTeamName(selectedOption.value);
        setTeamModelByYear(selectedOption.value, latestYear);
    };

    useEffect(() => {
        const modelViewer = modelViewerRef.current;

        const onProgress = (event) => {
            const progressBar = event.target.querySelector(".progress-bar");
            const updatingBar = event.target.querySelector(".update-bar");

            updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
            if (event.detail.totalProgress === 1) {
                progressBar.classList.add("hide");
                event.target.removeEventListener("progress", onProgress);
            } else {
                progressBar.classList.remove("hide");
            }
        };

        if (modelViewer) {
            modelViewer.addEventListener("progress", onProgress);
        }

        return () => {
            if (modelViewer) {
                modelViewer.removeEventListener("progress", onProgress);
            }
        };
    }, [team]); // Depend on glbLink to re-run the effect when it changes

    return (
        <>
            <div className="ar-container">
                <div className="model-viewer-wrapper">
                    <div className="ar-team-select">
                        <ReactSelectComponent
                            placeholder="Select Team"
                            options={teamOptions}
                            onChange={handleTeamChange}
                            value={teamOptions.find(
                                (option) => option.value === selectedTeamName
                            )}
                            isSearchable={false}
                            className="w-[17rem]"
                        />
                    </div>
                    <model-viewer
                        ref={modelViewerRef}
                        poster={ARViewer.defaultProps.img}
                        src={glbLink}
                        ar-modes={ARViewer.defaultProps.arModes}
                        ar={ARViewer.defaultProps.ar}
                        ar-scale={ARViewer.defaultProps.arScale}
                        camera-controls={ARViewer.defaultProps.cameraControls}
                        exposure={ARViewer.defaultProps.exposure}
                        loading={ARViewer.defaultProps.loading}
                        shadow-intensity={ARViewer.defaultProps.shadowIntensity}
                        shadow-softness={ARViewer.defaultProps.shadowSoftness}
                        alt={ARViewer.defaultProps.alt}
                    >
                        <div class="progress-bar" slot="progress-bar">
                            <div class="update-bar" />
                        </div>
                        <button
                            slot="ar-button"
                            className="ar-button shadow-md absolute left-1/2 translate-x-[-50%] w-[90%] flex justify-center items-center rounded-b-lg"
                            style={{
                                borderBottom: `1px solid ${activeThemeColor}`,
                                backgroundColor: activeThemeColor,
                            }}
                        >
                            <img
                                src={ARViewer.defaultProps.buttonIcon}
                                alt="AR icon"
                            />
                            Launch AR
                        </button>
                    </model-viewer>

                    <div className="ar-badge leading-none text-sm">
                        <div>AR Enabled</div>
                        <div>Mobile Devices</div>
                    </div>

                    {/* Team History */}
                    {showHistory && (
                        <div
                            className={classNames(
                                "ar-history shadow-md pt-8 px-8 sm:px-32 rounded-t-lg w-[90%]",
                                "transition-all ease-in-out duration-500",
                                "absolute left-1/2 translate-x-[-50%]"
                            )}
                            style={{
                                borderTop: `1px solid ${activeThemeColor}`,
                                transform: `translate(-50%, ${
                                    teamStatsOpen ? "0%" : "calc(100% - 42px)"
                                })`,
                            }}
                        >
                            <button
                                className="mb-8"
                                onClick={() => {
                                    setTeamStatsOpen(!teamStatsOpen)
                                    trackButtonClick(`team-history-${team.name}`);
                                }}
                            >
                                <FontAwesomeIcon
                                    icon="chevron-down"
                                    className={classNames(
                                        "mr-16 fa-1x transition-all ease-in-out delay-75 duration-500",
                                        { "fa-rotate-180": !teamStatsOpen }
                                    )}
                                />
                                <span className="font-display">
                                    {teamName} History
                                </span>
                                <FontAwesomeIcon
                                    icon="chevron-down"
                                    className={classNames(
                                        "ml-16 fa-1x transition-all ease-in-out delay-75 duration-500",
                                        { "fa-rotate-180": !teamStatsOpen }
                                    )}
                                />
                            </button>

                            <div
                                className="team-stats flex flex-col gap-4 text-left"
                                ref={ref}
                            >
                                <div className="divider-glow-dark w-full" />
                                <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between mb-8">
                                    <div className="text-center">
                                        <div className="uppercase tracking-xs text-xs">
                                            Constructor Titles
                                        </div>
                                        <div className="font-display">
                                            {team.constructorTitles.length}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="uppercase tracking-xs text-xs">
                                            Drivers Championships
                                        </div>
                                        <div className="font-display">
                                            {team.driversChampionships.length}
                                        </div>
                                    </div>
                                </div>
                                <div className="uppercase tracking-xs text-xs w-full text-center">
                                    Team History
                                </div>
                                <HistoryBar
                                    history={team.teamHistory}
                                    color={activeThemeColor}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* todo: redo this if possible */}
                <style jsx="true">{`
                    model-viewer {
                        background-color: ${activeThemeColor};
                        background: radial-gradient(
                            circle,
                            ${activeThemeColor} 0%,
                            ${darkenColor(activeThemeColor, 40)} 80%
                        );
                    }
                    model-viewer::before {
                        content: "${teamName}";
                    }
                `}</style>
            </div>

            {/* Team Buttons */}
            <div className="mt-64">
                <div className="flex flex-row justify-center gap-16 p-60">
                    {availableTeamYears.map((modelYear, index) => {
                        const modelTeamName = getModelTeamNameForYear(
                            selectedTeamName,
                            modelYear
                        );
                        const yearButtonColor = teamColors[modelYear]?.[modelTeamName]
                            ? `#${teamColors[modelYear][modelTeamName]}`
                            : activeThemeColor;
                        return (
                            <button
                                key={index}
                                style={{
                                    backgroundColor: yearButtonColor,
                                }}
                                className={classNames(
                                    "text-white p-2 rounded inline-flex flex-col items-center text-center bg-glow-dark mt-16 max-md:w-[45%]"
                                )}
                                onClick={() => {
                                    setTeamModelByYear(selectedTeamName, modelYear);
                                }}
                            >
                                <img
                                    src={`${
                                        process.env.PUBLIC_URL +
                                        "/images/" + modelYear + "/cars/" +
                                        modelTeamName +
                                        ".png"
                                    }`}
                                    alt={`${selectedTeamName}-${modelYear}`}
                                    className="w-[16rem] -mt-32"
                                />
                                <p className="font-display text-24">
                                    {modelYear}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col justify-center pb-40">
                <div className="divider-glow-dark mb-40" />

                <h2 className="tracking-wide text-center gradient-text-light">
                    Special edition
                </h2>

                <div className="flex flex-row justify-center flex-wrap gap-16 p-32">
                    {specialEditionModels.map((specialModel) => (
                        <button
                            key={specialModel.id}
                            style={{ backgroundColor: specialModel.color }}
                            className={classNames(
                                "text-white p-2 rounded inline-flex flex-col items-center text-center bg-glow-dark mt-16 max-md:w-[45%]"
                            )}
                            onClick={() =>
                                handleSpecialEditionSelect(specialModel)
                            }
                        >
                            <img
                                src={`${process.env.PUBLIC_URL}${specialModel.imagePath}`}
                                alt={specialModel.label}
                                className="w-[16rem] -mt-32"
                            />
                            <p className="font-display text-24">
                                {specialModel.label}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ARViewer;

ARViewer.defaultProps = {
    glbLink: `${process.env.PUBLIC_URL + "/ArFiles/glbs/2024/mclaren.glb"}`,
    team: teamHistory.mclaren,
    img: `${process.env.PUBLIC_URL + "/ArFiles/poster-mclaren.webp"}`,
    buttonIcon: `${process.env.PUBLIC_URL + "/APX/3diconWhite.png"}`,
    loading: "auto",
    reveal: "auto",
    autoRotate: true,
    cameraControls: true,
    shadowIntensity: "1",
    shadowSoftness: "1",
    environmentImage: "neutral",
    skyboxImage: null,
    exposure: "1",
    ar: true,
    arModes: "scene-viewer webxr quick-look",
    arScale: "auto",
    arPlacement: "floor",
    alt: "APX GP Model",
};
