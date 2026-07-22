import React, { useRef } from "react";
import classNames from "classnames";

import { TeamLogo2026 } from "../teamLogos";

const splitDriverName = (name = "") => {
    const [firstName = "", ...rest] = name.split(" ");
    return {
        firstName,
        lastName: rest.join(" ") || firstName,
    };
};

export const DossierSectionHeader2026 = ({
    eyebrow,
    title,
    accent,
    meta,
    className,
}) => {
    const titleParts = title.split(" ");
    const accentIndex = accent ? titleParts.findIndex((part) => part === accent) : -1;

    return (
        <div className={classNames("ds-2026-section-header", className)}>
            <div className="ds-2026-section-header__eyebrow">{eyebrow}</div>
            <div className="ds-2026-section-header__rule" />
            {meta && <div className="ds-2026-section-header__meta">{meta}</div>}
            <h2>
                {titleParts.map((part, index) => (
                    <React.Fragment key={`${part}-${index}`}>
                        {index > 0 && " "}
                        <span
                            className={classNames({
                                "ds-2026-section-header__accent": index === accentIndex,
                            })}
                        >
                            {part}
                        </span>
                    </React.Fragment>
                ))}
            </h2>
        </div>
    );
};

export const DossierSelect2026 = ({
    label,
    value,
    options,
    onChange,
    disabled,
    variant = "light",
}) => {
    return (
        <label className="ds-2026-select">
            <span>{label}</span>
            <select
                value={value || ""}
                onChange={(event) => onChange({ value: event.target.value })}
                disabled={disabled}
                className={classNames("ds-2026-select__control", {
                    "ds-2026-select__control--accent": variant === "accent",
                    "ds-2026-select__control--dark": variant === "dark",
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

export const DossierControlDeck2026 = ({
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
        <section className="ds-2026-control-deck">
            <div className="ds-2026-control-deck__inner">
                <div className="ds-2026-control-deck__controls">
                    <DossierSelect2026
                        label="Season"
                        value={year}
                        options={yearOptions}
                        onChange={onYearChange}
                    />
                    <DossierSelect2026
                        label="Team"
                        value={team}
                        options={teamOptions}
                        onChange={onTeamChange}
                        disabled={!year}
                        variant="dark"
                    />
                    {showDriverSelectors && (
                        <>
                            <DossierSelect2026
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
                                className="ds-2026-swap-button"
                                onClick={onSwapDrivers}
                                aria-label="Swap selected drivers"
                            >
                                ⇄
                            </button>
                            <DossierSelect2026
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
                    <div className="ds-2026-control-deck__source">
                        Last updated {lastUpdated}
                    </div>
                )}
            </div>
        </section>
    );
};

export const DriverHeroLockup2026 = ({
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
    const driver1 = splitDriverName(primaryDriver.name);
    const driver2 = splitDriverName(secondaryDriver.name);
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
        if (!hero) return;

        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        hero.style.setProperty("--ds-2026-hero-x", x.toFixed(3));
        hero.style.setProperty("--ds-2026-hero-y", y.toFixed(3));
    };

    const handleMouseLeave = () => {
        const hero = heroRef.current;
        if (!hero) return;

        hero.style.setProperty("--ds-2026-hero-x", "0");
        hero.style.setProperty("--ds-2026-hero-y", "0");
    };

    const fallbackToDefaultDriverImage = (event, defaultImage) => {
        if (event.currentTarget.src.endsWith(defaultImage)) {
            event.currentTarget.style.display = "none";
            return;
        }

        event.currentTarget.src = defaultImage;
    };

    return (
        <section
            ref={heroRef}
            className="ds-2026-hero-lockup ds-2026-page-width"
            data-year-suffix={yearSuffix}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <TeamLogo2026
                teamId={teamId}
                className="ds-2026-hero-lockup__team-mark"
            />
            <aside className="ds-2026-paper-panel ds-2026-dotted-texture" aria-hidden="true">
                <div className="ds-2026-paper-panel__meta">
                    Archive sheet
                    <br />
                    File {teamCode}-{yearSuffix}
                    {showCurrentRound && (
                        <>
                            <br />
                            Rnd 01-{formattedCurrentRound} / 22
                        </>
                    )}
                </div>
            </aside>
            <div className="ds-2026-hero-lockup__content">
                <div className="ds-2026-hero-lockup__tag">
                    {teamName || "Select a team"} — {year || "Season"}
                </div>
                <h1>
                    Head
                    <span>To Head</span>
                </h1>
                <p className="ds-2026-hero-lockup__strap">Who owns the garage</p>
            </div>

            {comparison && (
                <div className="ds-2026-hero-lockup__drivers">
                    <div className="ds-2026-hero-lockup__driver ds-2026-hero-lockup__driver--a">
                        <img
                            src={driver1Image}
                            alt=""
                            onError={(event) => fallbackToDefaultDriverImage(event, defaultDriver1Image)}
                        />
                        <div className="ds-2026-hero-lockup__driver-name">
                            <span>{driver1.firstName}</span>
                            <strong>{driver1.lastName}</strong>
                        </div>
                    </div>
                    <div className="ds-2026-hero-lockup__vs">VS</div>
                    <div className="ds-2026-hero-lockup__driver ds-2026-hero-lockup__driver--b">
                        <img
                            src={driver2Image}
                            alt=""
                            onError={(event) => fallbackToDefaultDriverImage(event, defaultDriver2Image)}
                        />
                        <div className="ds-2026-hero-lockup__driver-name">
                            <span>{driver2.firstName}</span>
                            <strong>{driver2.lastName}</strong>
                        </div>
                    </div>
                </div>
            )}
            <div className="ds-2026-hero-lockup__shard" />
        </section>
    );
};

export const Scoreboard2026 = ({ comparison }) => {
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
        <div className="ds-2026-scoreboard">
            {rows.map(([label, driver1Value, driver2Value]) => {
                const driver1Score = Number(driver1Value) || 0;
                const driver2Score = Number(driver2Value) || 0;
                const total = driver1Score + driver2Score;
                const hasScore = total > 0;
                const driver1Width = `${hasScore ? (driver1Score / total) * 100 : 0}%`;
                const driver2Width = `${hasScore ? (driver2Score / total) * 100 : 0}%`;

                return (
                    <div className="ds-2026-scoreboard__row" key={label}>
                        <strong>{driver1Value}</strong>
                        <div>
                            <span>{label}</span>
                            <div className="ds-2026-scoreboard__bar">
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

export const StatSheet2026 = ({ comparison }) => {
    if (!comparison) return null;

    const rows = [
        ["Average Race Position", comparison.driver1AvgRacePosition, comparison.driver2AvgRacePosition],
        ["Average Qualifying Position", comparison.driver1AvgQualiPositions, comparison.driver2AvgQualiPositions],
        ["Win Rate", comparison.driver1_win_rates, comparison.driver2_win_rates],
        ["Podium Rate", comparison.driver1_podium_rates, comparison.driver2_podium_rates],
        ["Pole Rate", comparison.driver1_pole_rates, comparison.driver2_pole_rates],
    ];

    return (
        <section className="ds-2026-stat-sheet">
            <div className="ds-2026-stat-sheet__header">
                <h3>Driver Statistics</h3>
                <span>Doc 02.1</span>
            </div>
            <div className="ds-2026-stat-sheet__grid">
                <span>Metric</span>
                <strong>{splitDriverName(comparison.driver1).lastName}</strong>
                <strong>{splitDriverName(comparison.driver2).lastName}</strong>
                {rows.map(([label, driver1Value, driver2Value]) => (
                    <React.Fragment key={label}>
                        <span>{label}</span>
                        <b>{driver1Value}</b>
                        <b>{driver2Value}</b>
                    </React.Fragment>
                ))}
            </div>
            <div className="ds-2026-stat-sheet__stamp">F1nsight Verified</div>
        </section>
    );
};

export const ChartPanel2026 = ({ children, label, className }) => {
    return (
        <div className={classNames("ds-2026-chart-panel", className)}>
            {label && <p>{label}</p>}
            {children}
        </div>
    );
};
