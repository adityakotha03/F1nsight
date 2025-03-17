import React, { useEffect, useState, useRef } from "react";
import "@google/model-viewer/";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { darkenColor } from "../utils/darkenColor";
import { HistoryBar } from "../components/HistoryBar";
import { teamHistory } from "../utils/teamHistory";

import "./ARViewer.scss";
import { Button } from "../components";

export const ARViewer = () => {
    const [glbLink, setGlbLink] = useState(ARViewer.defaultProps.glbLink);
    const [team, setTeam] = useState(ARViewer.defaultProps.team);
    const [teamStatsOpen, setTeamStatsOpen] = useState(false);
    const [year, setYear] = useState("2024");
    const [isGLBLoading, setIsGLBLoading] = useState(true);
    const modelViewerRef = useRef(null);

    const ref = useRef(null);

    const showHistory = team.name !== "F1Nsight" && team.name !== "apx";

    const teamList = Object.values(teamHistory);
    const teamName = team.name.replace(/_/g, " ");

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

        const handleModelLoad = () => {
            setIsGLBLoading(false);
        };

        if (modelViewer) {
            modelViewer.addEventListener("progress", onProgress);
            modelViewer.addEventListener("load", handleModelLoad);
        }

        return () => {
            if (modelViewer) {
                modelViewer.removeEventListener("progress", onProgress);
                modelViewer.removeEventListener("load", handleModelLoad);
            }
        };
    }, [team]); // Depend on glbLink to re-run the effect when it changes

    useEffect(() => {
        // Reset loading state when `glbLink` changes
        setIsGLBLoading(true);
    }, [glbLink]);

    return (
        <>
            <div className="ar-container">
                <div className="model-viewer-wrapper">
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
                                borderBottom: `1px solid ${team.color}`,
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
                                borderTop: `1px solid ${team.color}`,
                                transform: `translate(-50%, ${
                                    teamStatsOpen ? "0%" : "calc(100% - 42px)"
                                })`,
                            }}
                        >
                            <button
                                className="mb-8"
                                onClick={() => setTeamStatsOpen(!teamStatsOpen)}
                            >
                                <span className="font-display">
                                    {teamName} History
                                </span>
                                <FontAwesomeIcon
                                    icon="chevron-down"
                                    className={classNames(
                                        "ml-16 fa-1x transition-all ease-in-out delay-75 duration-500",
                                        { "fa-rotate-180": teamStatsOpen }
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
                                    color={team.color}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* todo: redo this if possible */}
                <style jsx="true">{`
                    model-viewer {
                        background-color: ${team.color};
                        background: radial-gradient(
                            circle,
                            ${team.color} 0%,
                            ${darkenColor(team.color, 40)} 80%
                        );
                    }
                    model-viewer::before {
                        content: "${teamName}";
                    }
                `}</style>
            </div>

            {/* Team Buttons */}
            <div className="mt-64">
                <div className="flex flex-row justify-center gap-16 pt-40">
                    <Button as="button" size="sm" buttonStyle="hollow" onClick={() => setYear("2024")}>
                        2024
                    </Button>
                    <Button as="button" size="sm" buttonStyle="hollow" onClick={() => setYear("2025")}>
                        2025
                    </Button>
                </div>

                <div className="flex flex-row justify-center flex-wrap gap-16 p-40">
                    {teamList.map((team, index) => {
                        return (
                            <button
                                key={index}
                                style={{ backgroundColor: team.color }}
                                className={classNames(
                                    "text-white p-2 rounded inline-flex flex-col items-center text-center bg-glow-dark mt-16 max-md:w-[45%]"
                                )}
                                onClick={() => {
                                    setGlbLink(
                                        `${
                                            process.env.PUBLIC_URL +
                                            "/ArFiles/glbs/" + year + "/" +
                                            team.name +
                                            ".glb"
                                        }`
                                    );
                                    setTeam(team);
                                }}
                            >
                                <img
                                    src={`${
                                        process.env.PUBLIC_URL +
                                        "/images/" + year + "/cars/" +
                                        team.name +
                                        ".png"
                                    }`}
                                    alt={team.name}
                                    className="w-[10rem] -mt-16"
                                />
                                <p className="font-display">
                                    {team.name.replace(/_/g, " ")}
                                </p>
                            </button>
                        );
                    })}
                </div>

                <h2 className="tracking-wide text-center gradient-text-light">
                    Special edition
                </h2>

                <div className="flex flex-row justify-center flex-wrap gap-16 p-32">
                    <button
                        style={{ backgroundColor: "#AE7D0E" }}
                        className={classNames(
                            "text-white p-2 rounded inline-flex flex-col items-center text-center bg-glow-dark mt-16 max-md:w-[45%]"
                        )}
                        onClick={() => {
                            setGlbLink(
                                `${
                                    process.env.PUBLIC_URL +
                                    "/ArFiles/glbs/2024/apx.glb"
                                }`
                            );
                            setTeam({
                                name: "apx",
                                color: "#AE7D0E",
                            });
                        }}
                    >
                        <img
                            src={`${
                                process.env.PUBLIC_URL +
                                "/images/2024/cars/apx.png"
                            }`}
                            alt={team.name}
                            className="w-[10rem] -mt-16"
                        />
                        <p className="font-display">APX</p>
                    </button>
                    <button
                        style={{ backgroundColor: "#7500AD" }}
                        className={classNames(
                            "text-white p-2 rounded inline-flex flex-col items-center text-center bg-glow-dark mt-16 max-md:w-[45%]"
                        )}
                        onClick={() => {
                            setGlbLink(
                                `${
                                    process.env.PUBLIC_URL +
                                    "/ArFiles/glbs/2024/f1nsight2022.glb"
                                }`
                            );
                            setTeam({
                                name: "F1Nsight",
                                color: "#7500AD",
                            });
                        }}
                    >
                        <img
                            src={`${
                                process.env.PUBLIC_URL +
                                "/images/2024/cars/f1nsight-sideview.png"
                            }`}
                            alt={team.name}
                            className="w-[10rem] -mt-16"
                        />
                        <p className="font-display">F1NSIGHT 2022</p>
                    </button>
                    <button
                        style={{ backgroundColor: "#7500AD" }}
                        className={classNames(
                            "text-white p-2 rounded inline-flex flex-col items-center text-center bg-glow-dark mt-16 max-md:w-[45%]"
                        )}
                        onClick={() => {
                            setGlbLink(
                                `${
                                    process.env.PUBLIC_URL +
                                    "/ArFiles/glbs/2024/f1nsight2024.glb"
                                }`
                            );
                            setTeam({
                                name: "F1Nsight",
                                color: "#7500AD",
                            });
                        }}
                    >
                        <img
                            src={`${
                                process.env.PUBLIC_URL +
                                "/images/2024/cars/F1Nsight.png"
                            }`}
                            alt={team.name}
                            className="w-[10rem] -mt-16"
                        />
                        <p className="font-display">F1NSIGHT 2024</p>
                    </button>
                    <button
                        style={{ backgroundColor: "#7500AD" }}
                        className={classNames(
                            "text-white p-2 rounded inline-flex flex-col items-center text-center bg-glow-dark mt-16 max-md:w-[45%]"
                        )}
                        onClick={() => {
                            setGlbLink(
                                `${
                                    process.env.PUBLIC_URL +
                                    "/ArFiles/glbs/2025/f1nsight2025.glb"
                                }`
                            );
                            setTeam({
                                name: "F1Nsight",
                                color: "#7500AD",
                            });
                        }}
                    >
                        <img
                            src={`${
                                process.env.PUBLIC_URL +
                                "/images/2025/cars/F1Nsight.png"
                            }`}
                            alt={team.name}
                            className="w-[10rem] -mt-16"
                        />
                        <p className="font-display">F1NSIGHT 2025</p>
                    </button>
                </div>
            </div>
        </>
    );
};

export default ARViewer;

ARViewer.defaultProps = {
    glbLink: `${process.env.PUBLIC_URL + "/ArFiles/glbs/mclaren.glb"}`,
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
