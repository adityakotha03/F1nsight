import React, { useRef } from "react";
import classNames from "classnames";

import { TeamLogo2026 } from "../teamLogos";
import { DriverNameLockup2026, splitDriverName2026 } from "./DriverNameLockup2026";
import { HeroShell2026 } from "./HeroShell2026";
import { JaggedContainer2026 } from "./JaggedContainer2026";
import { StatisticsSheet2026 } from "./StatisticsSheet2026";

export const TeammateComparisonSelect2026 = ({
    label,
    value,
    options,
    onChange,
    disabled,
    variant = "light",
}) => {
    return (
        <label className="teammates-2026-select">
            <span>{label}</span>
            <select
                value={value || ""}
                onChange={(event) => onChange({ value: event.target.value })}
                disabled={disabled}
                className={classNames("teammates-2026-select__control", {
                    "teammates-2026-select__control--accent": variant === "accent",
                    "teammates-2026-select__control--dark": variant === "dark",
                })}
            >
                <option value="">Select</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
};

export const TeammateComparisonControlDeck2026 = ({
    year,
    yearOptions,
    team,
    teamOptions,
    selectedDriver1,
    selectedDriver2,
    driverOptions,
    showDriverSelectors,
    onYearChange,
    onTeamChange,
    onDriver1Change,
    onDriver2Change,
    onSwapDrivers,
    lastUpdated,
}) => {
    return (
        <JaggedContainer2026
            as="section"
            className="teammates-2026-control-deck"
            color="var(--ds-2026-paper)"
            edge="both"
            lifted
        >
            <div className="teammates-2026-control-deck__inner">
                <div className="teammates-2026-control-deck__controls">
                    <TeammateComparisonSelect2026
                        label="Season"
                        value={year}
                        options={yearOptions}
                        onChange={onYearChange}
                    />
                    <TeammateComparisonSelect2026
                        label="Team"
                        value={team}
                        options={teamOptions}
                        onChange={onTeamChange}
                        disabled={!year}
                        variant="dark"
                    />
                    {showDriverSelectors && (
                        <>
                            <TeammateComparisonSelect2026
                                label="Driver A"
                                value={selectedDriver1}
                                options={driverOptions.filter(
                                    (driver) => driver.value !== selectedDriver2
                                )}
                                onChange={onDriver1Change}
                                variant="accent"
                            />
                            <button
                                type="button"
                                className="teammates-2026-swap-button"
                                onClick={onSwapDrivers}
                                aria-label="Swap selected drivers"
                            >
                                ⇄
                            </button>
                            <TeammateComparisonSelect2026
                                label="Driver B"
                                value={selectedDriver2}
                                options={driverOptions.filter(
                                    (driver) => driver.value !== selectedDriver1
                                )}
                                onChange={onDriver2Change}
                            />
                        </>
                    )}
                </div>
                {lastUpdated && (
                    <div className="teammates-2026-control-deck__source">
                        Last updated {lastUpdated}
                    </div>
                )}
            </div>
        </JaggedContainer2026>
    );
};

export const TeammateComparisonHero2026 = ({
    year,
    teamId,
    teamName,
    comparison,
}) => {
    const heroRef = useRef(null);
    const shouldSwapVisualOrder =
        (comparison?.driver2Points || 0) > (comparison?.driver1Points || 0);
    const primaryDriver = {
        name: shouldSwapVisualOrder ? comparison?.driver2 : comparison?.driver1,
        code: shouldSwapVisualOrder ? comparison?.driver2Code : comparison?.driver1Code,
    };
    const secondaryDriver = {
        name: shouldSwapVisualOrder ? comparison?.driver1 : comparison?.driver2,
        code: shouldSwapVisualOrder ? comparison?.driver1Code : comparison?.driver2Code,
    };
    const imageYear = Number(year);
    const usesSeasonDriverImages = imageYear >= 2023;
    const yearSuffix = year ? String(year).slice(-2) : "26";
    const teamCode = teamName ? teamName.replace(/\s+/g, "").slice(0, 3).toUpperCase() : "F1N";
    const currentYear = new Date().getFullYear();
    const currentRound = Object.keys(comparison?.driver1RacePosList || {}).length;
    const formattedCurrentRound = String(currentRound).padStart(2, "0");
    const showCurrentRound = Number(year) === currentYear && currentRound > 0;
    const defaultDriver1Image = `${process.env.PUBLIC_URL}/images/default/driver1.png`;
    const defaultDriver2Image = `${process.env.PUBLIC_URL}/images/default/driver2.png`;
    const driver1Image = usesSeasonDriverImages && primaryDriver.code
        ? `${process.env.PUBLIC_URL}/images/${imageYear}/drivers/${primaryDriver.code}.png`
        : defaultDriver1Image;
    const driver2Image = usesSeasonDriverImages && secondaryDriver.code
        ? `${process.env.PUBLIC_URL}/images/${imageYear}/drivers/${secondaryDriver.code}.png`
        : defaultDriver2Image;

    const handleMouseMove = (event) => {
        const hero = heroRef.current;
        if (!hero || window.matchMedia("(max-width: 900px)").matches) return;

        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        hero.style.setProperty("--teammates-2026-hero-x", x.toFixed(3));
        hero.style.setProperty("--teammates-2026-hero-y", y.toFixed(3));
    };

    const handleMouseLeave = () => {
        const hero = heroRef.current;
        if (!hero) return;

        hero.style.setProperty("--teammates-2026-hero-x", "0");
        hero.style.setProperty("--teammates-2026-hero-y", "0");
    };

    const fallbackToDefaultDriverImage = (event, defaultImage) => {
        if (event.currentTarget.src.endsWith(defaultImage)) {
            event.currentTarget.style.display = "none";
            return;
        }

        event.currentTarget.src = defaultImage;
    };

    return (
        <HeroShell2026
            ref={heroRef}
            className="teammates-2026-hero-lockup"
            data-year-suffix={yearSuffix}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <TeamLogo2026
                teamId={teamId}
                className="teammates-2026-hero-lockup__team-mark"
            />
            <aside className="teammates-2026-paper-panel ds-2026-dotted-texture" aria-hidden="true">
                <div className="teammates-2026-paper-panel__meta">
                    File {teamCode}-{yearSuffix}
                    {showCurrentRound && (
                        <>
                            <br />
                            Rnd 01-{formattedCurrentRound} / 22
                        </>
                    )}
                </div>
            </aside>
            <div className="teammates-2026-hero-lockup__content">
                <div className="teammates-2026-hero-lockup__tag">
                    {teamName || "Select a team"} — {year || "Season"}
                </div>
                <h1>
                    Head
                    <span>To Head</span>
                </h1>
                <p className="teammates-2026-hero-lockup__strap">Who owns the garage?</p>
            </div>

            {comparison && (
                <div className="teammates-2026-hero-lockup__drivers">
                    <div className="teammates-2026-hero-lockup__driver teammates-2026-hero-lockup__driver--a">
                        <img
                            src={driver1Image}
                            alt=""
                            onError={(event) => fallbackToDefaultDriverImage(event, defaultDriver1Image)}
                        />
                        <DriverNameLockup2026
                            name={primaryDriver.name}
                            className="teammates-2026-hero-lockup__driver-name"
                        />
                    </div>
                    <div className="teammates-2026-hero-lockup__vs">VS</div>
                    <div className="teammates-2026-hero-lockup__driver teammates-2026-hero-lockup__driver--b">
                        <img
                            src={driver2Image}
                            alt=""
                            onError={(event) => fallbackToDefaultDriverImage(event, defaultDriver2Image)}
                        />
                        <DriverNameLockup2026
                            name={secondaryDriver.name}
                            className="teammates-2026-hero-lockup__driver-name"
                        />
                    </div>
                </div>
            )}
            <div className="teammates-2026-hero-lockup__shard" />
        </HeroShell2026>
    );
};

export const TeammateComparisonScoreboard2026 = ({ comparison }) => {
    if (!comparison) return null;

    const rows = [
        ["Qualifying H2H", comparison.driver1QualifyingWins, comparison.driver2QualifyingWins],
        ["Race H2H", comparison.driver1RaceWins, comparison.driver2RaceWins],
        ["Wins", comparison.driver1Wins, comparison.driver2Wins],
        ["Poles", comparison.driver1Poles, comparison.driver2Poles],
        ["Podiums", comparison.driver1Podiums, comparison.driver2Podiums],
        ["Points", comparison.driver1Points, comparison.driver2Points],
        ["DNF", comparison.driver1DNF, comparison.driver2DNF],
    ];

    return (
        <div className="teammates-2026-scoreboard">
            {rows.map(([label, driver1Value, driver2Value]) => {
                const driver1Score = Number(driver1Value) || 0;
                const driver2Score = Number(driver2Value) || 0;
                const total = driver1Score + driver2Score;
                const hasScore = total > 0;
                const driver1Width = `${hasScore ? (driver1Score / total) * 100 : 0}%`;
                const driver2Width = `${hasScore ? (driver2Score / total) * 100 : 0}%`;

                return (
                    <div className="teammates-2026-scoreboard__row" key={label}>
                        <strong>{driver1Value}</strong>
                        <div>
                            <span>{label}</span>
                            {label === "DNF" && (
                                <em className="teammates-2026-scoreboard__note">
                                    the expensive row
                                </em>
                            )}
                            <div className="teammates-2026-scoreboard__bar">
                                {hasScore && (
                                    <>
                                        <i style={{ width: driver1Width }} />
                                        <b style={{ width: driver2Width }} />
                                    </>
                                )}
                            </div>
                        </div>
                        <strong>{driver2Value}</strong>
                    </div>
                );
            })}
        </div>
    );
};

export const TeammateComparisonStatSheet2026 = ({ comparison, fileMeta }) => {
    if (!comparison) return null;

    const rows = [
        ["Average Race Position", comparison.driver1AvgRacePosition, comparison.driver2AvgRacePosition],
        ["Average Qualifying Position", comparison.driver1AvgQualiPositions, comparison.driver2AvgQualiPositions],
        ["Win Rate", comparison.driver1_win_rates, comparison.driver2_win_rates],
        ["Podium Rate", comparison.driver1_podium_rates, comparison.driver2_podium_rates],
        ["Pole Rate", comparison.driver1_pole_rates, comparison.driver2_pole_rates],
    ];

    return (
        <StatisticsSheet2026
            title="Driver Statistics"
            fileMeta={fileMeta}
            columns={[
                splitDriverName2026(comparison.driver1).lastName,
                splitDriverName2026(comparison.driver2).lastName,
            ]}
            rows={rows}
        />
    );
};

export const TeammateComparisonChartPanel2026 = ({ children, label, className }) => {
    return (
        <div className={classNames("teammates-2026-chart-panel", className)}>
            {label && <p>{label}</p>}
            {children}
        </div>
    );
};
