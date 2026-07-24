import React, { useRef } from "react";

import { DriverNameLockup2026, splitDriverName2026 } from "./DriverNameLockup2026";
import { HeroShell2026 } from "./HeroShell2026";
import { SectionHeader2026 } from "./SectionHeader2026";

export const POPULAR_DRIVER_COMPARISONS = [
    { label: "Hamilton vs Verstappen", driver1: "hamilton", driver2: "max_verstappen" },
    { label: "Senna vs Prost", driver1: "senna", driver2: "prost" },
    { label: "Vettel vs Alonso", driver1: "vettel", driver2: "alonso" },
    { label: "Schumacher vs Hamilton", driver1: "michael_schumacher", driver2: "hamilton" },
];

const numberFrom = (data, keys, fallback = 0) => {
    const value = keys.map(key => data?.[key]).find(candidate => candidate !== undefined && candidate !== null);
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const standingsFor = data => data?.finalStandings || {};
const careerYears = data => Object.keys(standingsFor(data)).sort();
const careerPoints = data => Object.values(standingsFor(data)).reduce(
    (total, standing) => total + (Number(standing?.points) || 0), 0
);
const careerTitles = data => Object.values(standingsFor(data)).filter(
    standing => Number(standing?.position) === 1
).length;
const latestStanding = data => {
    const years = careerYears(data);
    return standingsFor(data)[years.at(-1)] || {};
};
const firstPresent = values => values.find(value => value !== undefined && value !== null && value !== "");
const driverCarNumber = (driver, data) => firstPresent([
    driver?.permanentNumber,
    driver?.driverNumber,
    data?.permanentNumber,
    data?.driverNumber,
    data?.driver_number,
    data?.carNumber,
    data?.number,
]) || "—";
const driverTeam = data => {
    const standing = latestStanding(data);
    const team = firstPresent([
        data?.teamName,
        data?.constructorName,
        data?.currentTeam,
        standing?.teamName,
        standing?.constructorName,
        standing?.Constructor?.name,
        standing?.Constructors?.[0]?.name,
    ]);
    return typeof team === "object" ? team?.name : team;
};
const driverCareerMeta = data => {
    const years = careerYears(data);
    const start = years[0] || "Archive";
    const last = Number(years.at(-1));
    const end = last >= new Date().getFullYear() - 1 ? "Active" : (years.at(-1) || "Open");
    const wins = numberFrom(data, ["totalWins"]);
    const titles = careerTitles(data);
    return `${start} — ${end} · ${wins} ${wins === 1 ? "win" : "wins"} · ${titles} ${titles === 1 ? "title" : "titles"}`;
};
const formatNumber = value => new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);

const driverImage = (data, side) => data?.driverCode
    ? `${process.env.PUBLIC_URL}/images/2026/drivers/${data.driverCode}.png`
    : `${process.env.PUBLIC_URL}/images/default/driver${side}.png`;

const fallbackDriverImage = (event, side) => {
    const fallback = `${process.env.PUBLIC_URL}/images/default/driver${side}.png`;
    if (event.currentTarget.src.endsWith(fallback)) {
        event.currentTarget.style.display = "none";
        return;
    }
    event.currentTarget.src = fallback;
};

export const CrossEraHero2026 = ({ driver1, driver2, driver1Data, driver2Data }) => {
    const heroRef = useRef(null);
    const fileMeta = [
        driver1Data?.driverCode || driver1?.code || "A",
        driver2Data?.driverCode || driver2?.code || "B",
    ].map(code => String(code).toUpperCase()).join("×");

    const updateCursorPosition = event => {
        if (window.matchMedia("(max-width: 900px)").matches) return;

        const bounds = heroRef.current?.getBoundingClientRect();
        if (!bounds) return;
        const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
        heroRef.current.style.setProperty("--driver-comparison-2026-cursor-x", x.toFixed(3));
        heroRef.current.style.setProperty("--driver-comparison-2026-cursor-y", y.toFixed(3));
    };

    const resetCursorPosition = () => {
        heroRef.current?.style.setProperty("--driver-comparison-2026-cursor-x", 0);
        heroRef.current?.style.setProperty("--driver-comparison-2026-cursor-y", 0);
    };

    const renderMetadata = data => (
        <>
            {driverTeam(data) && (
                <div className="driver-comparison-2026-cross-era-hero__team">{driverTeam(data)}</div>
            )}
            <p className="driver-comparison-2026-cross-era-hero__meta">{driverCareerMeta(data)}</p>
        </>
    );

    return (
        <HeroShell2026
            ref={heroRef}
            className="driver-comparison-2026-cross-era-hero"
            onMouseMove={updateCursorPosition}
            onMouseLeave={resetCursorPosition}
        >
            <div className="driver-comparison-2026-cross-era-hero__background" aria-hidden="true">
                <div className="driver-comparison-2026-cross-era-hero__background-side driver-comparison-2026-cross-era-hero__background-side--a" />
                <div className="driver-comparison-2026-cross-era-hero__background-side driver-comparison-2026-cross-era-hero__background-side--b ds-2026-dark-dotted-gradient" />
            </div>
            <div className="driver-comparison-2026-cross-era-hero__side driver-comparison-2026-cross-era-hero__side--a">
                <DriverNameLockup2026
                    name={driver1?.name}
                    lastNameAs="h1"
                    size="lg"
                    shrinkForMobile
                    className="driver-comparison-2026-cross-era-hero__identity"
                >
                    {renderMetadata(driver1Data)}
                </DriverNameLockup2026>
                <div className="driver-comparison-2026-cross-era-hero__number">{driverCarNumber(driver1, driver1Data)}</div>
                <img
                    src={driverImage(driver1Data, 1)}
                    alt=""
                    onError={event => fallbackDriverImage(event, 1)}
                />
            </div>
            <div className="driver-comparison-2026-cross-era-hero__side driver-comparison-2026-cross-era-hero__side--b">
                <DriverNameLockup2026
                    name={driver2?.name}
                    lastNameAs="h1"
                    size="lg"
                    shrinkForMobile
                    className="driver-comparison-2026-cross-era-hero__identity"
                >
                    {renderMetadata(driver2Data)}
                </DriverNameLockup2026>
                <div className="driver-comparison-2026-cross-era-hero__number">{driverCarNumber(driver2, driver2Data)}</div>
                <img
                    src={driverImage(driver2Data, 2)}
                    alt=""
                    onError={event => fallbackDriverImage(event, 2)}
                />
            </div>
            <div className="driver-comparison-2026-cross-era-hero__heading">
                <h1 className="driver-comparison-2026-cross-era-hero__title">
                    Driver
                    <span>Comparisons</span>
                </h1>
                <div className="driver-comparison-2026-cross-era-hero__tag">Any driver · Any era</div>
            </div>
            <div className="driver-comparison-2026-cross-era-hero__vs">VS</div>
            <div className="driver-comparison-2026-cross-era-hero__file">
                File — {fileMeta}
            </div>
        </HeroShell2026>
    );
};

export const DriverComparisonControls2026 = ({
    drivers,
    driver1Id,
    driver2Id,
    sharedYears,
    onSelect,
}) => (
    <section className="driver-comparison-2026-controls">
        <div className="ds-2026-page-width driver-comparison-2026-controls__inner">
            <label>
                <span>Driver A</span>
                <select
                    aria-label="Select driver A"
                    value={driver1Id}
                    onChange={event => onSelect(event.target.value, driver2Id)}
                >
                    {drivers.map(driver => (
                        <option key={driver.id} value={driver.id} disabled={driver.id === driver2Id}>
                            {driver.name}
                        </option>
                    ))}
                </select>
            </label>
            <button
                className="driver-comparison-2026-controls__swap"
                type="button"
                aria-label="Swap drivers"
                onClick={() => onSelect(driver2Id, driver1Id)}
            >
                ⇄
            </button>
            <label>
                <span>Driver B</span>
                <select
                    aria-label="Select driver B"
                    value={driver2Id}
                    onChange={event => onSelect(driver1Id, event.target.value)}
                >
                    {drivers.map(driver => (
                        <option key={driver.id} value={driver.id} disabled={driver.id === driver1Id}>
                            {driver.name}
                        </option>
                    ))}
                </select>
            </label>
            <p>{sharedYears.length} shared seasons on record<br />Points systems differ across eras</p>
        </div>
    </section>
);

export const PopularComparisons2026 = ({ onSelect, inverse = false }) => (
    <div className={inverse ? "driver-comparison-2026-popular driver-comparison-2026-popular--inverse" : "driver-comparison-2026-popular"}>
        {POPULAR_DRIVER_COMPARISONS.map(comparison => (
            <button
                key={comparison.label}
                type="button"
                onClick={() => onSelect(comparison.driver1, comparison.driver2)}
            >
                {comparison.label}
            </button>
        ))}
    </div>
);

const ledgerMetrics = data => ({
    wins: numberFrom(data, ["totalWins"]),
    podiums: numberFrom(data, ["totalPodiums"]),
    poles: numberFrom(data, ["totalPoles"]),
    titles: careerTitles(data),
    points: careerPoints(data),
    dnfs: numberFrom(data, ["totalDNFs"]),
});

export const CareerLedger2026 = ({ driver1, driver2, driver1Data, driver2Data }) => {
    const first = ledgerMetrics(driver1Data);
    const second = ledgerMetrics(driver2Data);
    const rows = [
        ["Grand Prix wins", "wins"],
        ["Podiums", "podiums"],
        ["Pole positions", "poles"],
        ["World titles", "titles"],
        ["Career points", "points"],
        ["DNFs", "dnfs", true],
    ];

    return (
        <section className="driver-comparison-2026-section ds-2026-page-width">
            <SectionHeader2026
                eyebrow="01 — The Ledger"
                title="Career Ledger"
                accent="Ledger"
                meta="Full careers · all series points"
            />
            <div className="driver-comparison-2026-legend">
                <span><i />{splitDriverName2026(driver1?.name).lastName}</span>
                <span><b />{splitDriverName2026(driver2?.name).lastName}</span>
            </div>
            <div className="driver-comparison-2026-career-ledger">
                {rows.map(([label, key, lowerIsBetter]) => {
                    const value1 = first[key];
                    const value2 = second[key];
                    const total = Math.max(value1 + value2, 1);
                    const winner1 = lowerIsBetter ? value1 < value2 : value1 > value2;
                    const winner2 = lowerIsBetter ? value2 < value1 : value2 > value1;
                    return (
                        <div className="driver-comparison-2026-career-ledger__row" key={key}>
                            <strong className={winner1 ? "is-leading" : ""}>{formatNumber(value1)}</strong>
                            <div>
                                <span>{label}</span>
                                <div className="driver-comparison-2026-career-ledger__bar">
                                    <i style={{ width: `${(value1 / total) * 100}%` }} />
                                    <b style={{ width: `${(value2 / total) * 100}%` }} />
                                </div>
                            </div>
                            <strong className={winner2 ? "is-leading" : ""}>{formatNumber(value2)}</strong>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

const arcPoints = data => careerYears(data).map(year => Number(standingsFor(data)[year]?.position) || 20);
const svgPolyline = values => {
    if (!values.length) return "";
    return values.map((value, index) => {
        const x = values.length === 1 ? 500 : 30 + (index / (values.length - 1)) * 940;
        const y = 25 + ((Math.min(value, 20) - 1) / 19) * 250;
        return `${x},${y}`;
    }).join(" ");
};

export const ChampionshipArc2026 = ({ driver1, driver2, driver1Data, driver2Data }) => {
    const firstPoints = svgPolyline(arcPoints(driver1Data));
    const secondPoints = svgPolyline(arcPoints(driver2Data));
    return (
        <section className="driver-comparison-2026-section ds-2026-page-width">
            <SectionHeader2026
                eyebrow="02 — The Arc"
                title="Championship Arc"
                accent="Arc"
                meta="Championship finish by career season"
            />
            <div className="driver-comparison-2026-arc-chart">
                <p>Eras aligned — season 01 = rookie year</p>
                <svg viewBox="0 0 1000 310" role="img" aria-label="Championship finishes aligned by career season">
                    {[25, 90, 155, 220, 275].map(y => <line key={y} x1="30" x2="970" y1={y} y2={y} />)}
                    {firstPoints && <polyline className="driver-a" points={firstPoints} />}
                    {secondPoints && <polyline className="driver-b" points={secondPoints} />}
                </svg>
            </div>
            <div className="driver-comparison-2026-legend">
                <span><i />{splitDriverName2026(driver1?.name).lastName} — solid</span>
                <span><b />{splitDriverName2026(driver2?.name).lastName} — dashed</span>
            </div>
        </section>
    );
};

export const PrimeShape2026 = ({ driver1Data, driver2Data }) => {
    const points1 = careerYears(driver1Data).map(year => Number(standingsFor(driver1Data)[year]?.points) || 0);
    const points2 = careerYears(driver2Data).map(year => Number(standingsFor(driver2Data)[year]?.points) || 0);
    const max1 = Math.max(...points1, 1);
    const max2 = Math.max(...points2, 1);
    const seasons = Math.max(points1.length, points2.length);
    return (
        <section className="driver-comparison-2026-section ds-2026-page-width">
            <SectionHeader2026 eyebrow="03 — Peak Years" title="Shape Of A Prime" accent="Prime" meta="Points per season · normalized to each career best" />
            <div className="driver-comparison-2026-prime-chart">
                {Array.from({ length: seasons }, (_, index) => (
                    <div className="driver-comparison-2026-prime-chart__season" key={index}>
                        <div><i style={{ height: `${((points1[index] || 0) / max1) * 100}%` }} /><b style={{ height: `${((points2[index] || 0) / max2) * 100}%` }} /></div>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                ))}
            </div>
            <p className="driver-comparison-2026-hand-note">primes come in different shapes.</p>
        </section>
    );
};

export const SharedGrid2026 = ({ driver1, driver2, driver1Data, driver2Data, sharedYears }) => (
    <section className="driver-comparison-2026-section ds-2026-page-width">
        <SectionHeader2026 eyebrow="04 — Shared Grid" title="Wheel To Wheel" accent="Wheel" meta="Seasons both on the entry list" />
        <div className="driver-comparison-2026-shared-grid">
            <header><span>{splitDriverName2026(driver1?.name).lastName}</span><span>Championship finish</span><span>{splitDriverName2026(driver2?.name).lastName}</span></header>
            {sharedYears.length ? sharedYears.map(year => {
                const position1 = standingsFor(driver1Data)[year]?.position;
                const position2 = standingsFor(driver2Data)[year]?.position;
                return <div key={year}><strong className={Number(position1) === 1 ? "is-champion" : ""}>P{position1}</strong><span>{year}</span><strong className={Number(position2) === 1 ? "is-champion" : ""}>P{position2}</strong></div>;
            }) : <p>These careers never shared a championship season.</p>}
        </div>
    </section>
);

export const SeasonStandings2026 = ({
    driver1,
    driver2,
    driver1Data,
    driver2Data,
    years,
    eyebrow,
}) => (
    <section className="driver-comparison-2026-section ds-2026-page-width">
        <SectionHeader2026
            eyebrow={eyebrow}
            title="Season Points & Standings"
            accent="Standings"
            meta={`${years.length} seasons in this file`}
        />
        <div className="driver-comparison-2026-season-standings">
            <header>
                <span>{splitDriverName2026(driver1?.name).lastName}</span>
                <span>Year</span>
                <span>{splitDriverName2026(driver2?.name).lastName}</span>
            </header>
            {years.map(year => {
                const first = standingsFor(driver1Data)[year];
                const second = standingsFor(driver2Data)[year];
                return (
                    <div key={year}>
                        <span>
                            <strong>{first ? `P${first.position}` : "DNC"}</strong>
                            <b>{first ? formatNumber(Number(first.points) || 0) : "—"} pts</b>
                        </span>
                        <em>{year}</em>
                        <span>
                            <b>{second ? formatNumber(Number(second.points) || 0) : "—"} pts</b>
                            <strong>{second ? `P${second.position}` : "DNC"}</strong>
                        </span>
                    </div>
                );
            })}
        </div>
    </section>
);
