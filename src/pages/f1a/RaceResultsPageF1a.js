import React, { useState, useEffect } from "react";
import { fetchF1aRaceResultsByCircuit, fetchCircuitData } from "../../utils/apiF1a";

import { RaceResultItem, Loading, Button } from "../../components";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { trackButtonClick } from "../../utils/gaTracking";

const Top3Drivers = ({ year, circuitId, index }) => {
    const [raceName, setRaceName] = useState("");
    const [top3RaceResults, setTop3RaceResults] = useState([]);
    const [top3RaceResults2, setTop3RaceResults2] = useState([]);
    const [top3RaceResults3, setTop3RaceResults3] = useState([]);
    // console.log(year, circuitId);

    useEffect(() => {
        const fetchData = async () => {
            const results = await fetchF1aRaceResultsByCircuit(
                year,
                circuitId,
                true
            );
            // console.log('results', results);
            setRaceName(results.raceName);
            setTop3RaceResults(results.race1);
            results.race2 && setTop3RaceResults2(results.race2);
            results.race3 && setTop3RaceResults3(results.race3);
        };

        fetchData();
    }, [year, circuitId]);

    const hasResults = top3RaceResults && top3RaceResults.length > 0;

    return (
        <div className="relative group w-fit m-auto  pb-64">
            <NavLink
                disabled={!hasResults}
                to={hasResults ? `/race-f1a/2024${index}` : null}
                onClick={trackButtonClick(`race-result-item-${raceName}`)}
                className={classNames(
                    "bg-glow-dark rounded-[2.4rem] p-32 block mt-32 w-fit m-auto",
                    "bg-gradient-to-br from-neutral-950/50 via-neutral-800/50 to-neutral-900/50",
                    { "clickable-hover": hasResults }
                )}
            >
                <h3 className="font-display tracking-xs leading-none text-center font-bold mb-32">
                    {raceName}
                </h3>
                <div className="flex flex-col md:flex-row items-center md:justify-center gap-16">
                    <div>
                        <p className="uppercase text-sm text-center text-neutral-400 tracking-sm leading-none mb-24">
                            Race 1 Results
                        </p>
                        {hasResults ? (
                            <ul className="bg-glow-dark rounded-[2.4rem] race-results__list">
                                {top3RaceResults.map((result, index) => (
                                    <RaceResultItem
                                        className={`race-results__list__item-${index + 1}`}
                                        carNumber={result.number}
                                        driver={result.Driver}
                                        fastestLap={result.fastestLap}
                                        startPosition={parseInt(
                                            result.grid,
                                            10
                                        )}
                                        key={index}
                                        index={index}
                                        endPosition={parseInt(
                                            result.position,
                                            10
                                        )}
                                        status={result.status}
                                        time={result.Time.time}
                                        year={year}
                                        wireframe={result.length === 0}
                                        f1a={true}
                                        // hasHover={false}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <div className="flex justify-center">
                                <img
                                    alt=""
                                    src={`${
                                        process.env.PUBLIC_URL +
                                        "/images/f1a-podium.png"
                                    }`}
                                    width={324}
                                />
                            </div>
                        )}
                    </div>
                    {hasResults && top3RaceResults2.length > 0 && (
                        <div>
                            <p className="uppercase text-sm text-center text-neutral-400 tracking-sm leading-none mb-24">
                                Race 2 Results
                            </p>
                            <ul className="bg-glow-dark rounded-[2.4rem] race-results__list">
                                {top3RaceResults2.map((result, index) => (
                                    <RaceResultItem
                                        className={`race-results__list__item-${
                                            index + 1
                                        }`}
                                        carNumber={result.number}
                                        driver={result.Driver}
                                        fastestLap={result.fastestLap}
                                        startPosition={parseInt(
                                            result.grid,
                                            10
                                        )}
                                        key={index}
                                        index={index}
                                        endPosition={parseInt(
                                            result.position,
                                            10
                                        )}
                                        status={result.status}
                                        time={result.Time.time}
                                        year={year}
                                        wireframe={result.length === 0}
                                        f1a={true}
                                    />
                                ))}
                            </ul>
                        </div>
                    )}
                    {hasResults && top3RaceResults3.length > 0 && (
                        <div>
                            <p className="uppercase text-sm text-center text-neutral-400 tracking-sm leading-none mb-24">
                                Race 3 Results
                            </p>
                            <ul className="bg-glow-dark rounded-[2.4rem] race-results__list">
                                {top3RaceResults3.map((result, index) => (
                                    <RaceResultItem
                                        className={`race-results__list__item-${
                                            index + 1
                                        }`}
                                        carNumber={result.number}
                                        driver={result.Driver}
                                        fastestLap={result.fastestLap}
                                        startPosition={parseInt(
                                            result.grid,
                                            10
                                        )}
                                        key={index}
                                        index={index}
                                        endPosition={parseInt(
                                            result.position,
                                            10
                                        )}
                                        status={result.status}
                                        time={result.Time.time}
                                        year={year}
                                        wireframe={result.length === 0}
                                        f1a={true}
                                    />
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </NavLink>
            {hasResults && (
                <Button
                    size="sm"
                    disabled
                    className="opacity-0 group-hover:opacity-100 absolute bottom-[2rem] left-1/2 -translate-x-1/2"
                >
                    View Race Details
                </Button>
            )}
        </div>
    );
};

export function RaceResultsPageF1a({ selectedYear }) {
    const [filteredCircuits, setFilteredCircuits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await fetchCircuitData();
            setFilteredCircuits(
                Object.values(data).filter(
                    (circuit) => circuit.year === selectedYear.toString()
                )
            );
            setIsLoading(false);
        };

        fetchData();
    }, [selectedYear]);

    // console.log('filteredCircuits', filteredCircuits);

    return (
        <div className="race-results max-w-[120rem] m-auto mt-[7rem]">
            {isLoading ? (
                <Loading
                    className="mt-[20rem] mb-[20rem]"
                    message={`Loading ${selectedYear} Race Results`}
                />
            ) : (
                filteredCircuits.map((circuit, index) => (
                    <Top3Drivers
                        key={circuit.circuitId}
                        year={selectedYear}
                        index={index + 1}
                        circuitId={circuit.circuitId}
                    />
                ))
            )}
        </div>
    );
}
