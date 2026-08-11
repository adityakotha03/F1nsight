import React, { useEffect, useState } from "react";

import { BarChartTotal, LineChartByYear, Loading } from "../../components";
import { useDriverComparison } from "../../hooks/useDriverComparison";
import { DesignSystem2026 } from "./DesignSystem2026";
import {
    CareerLedger2026,
    ChampionshipArc2026,
    CrossEraHero2026,
    DriverComparisonControls2026,
    JaggedContainer2026,
    PopularComparisons2026,
    PrimeShape2026,
    SeasonStandings2026,
    SectionHeader2026,
    SharedGrid2026,
    StatisticsSheet2026,
    Tabs2026,
} from "./components";

const BASE_COMPARISON_TABS = [
    { id: "career", label: "Career" },
    { id: "all-years", label: "All Years" },
];

const ALL_YEARS_TABS = [
    { id: "standings", label: "Standings" },
    { id: "career-shape", label: "Career Shape" },
    { id: "position-counts", label: "Position Counts" },
];

const COMPETING_YEARS_TABS = [
    { id: "standings", label: "Standings" },
    { id: "shared-grid", label: "Shared Grid" },
    { id: "race", label: "Race" },
    { id: "qualifying", label: "Qualifying" },
    { id: "position-counts", label: "Position Counts" },
];

const percentage = value => `${(Number(value || 0) * 100).toFixed()}%`;

const chartPanel = (eyebrow, title, meta, children) => (
    <section className="driver-comparison-2026-section ds-2026-page-width">
        <SectionHeader2026 eyebrow={eyebrow} title={title} accent={title.split(" ").at(-1)} meta={meta} />
        <div className="driver-comparison-2026-legacy-chart">{children}</div>
    </section>
);

export const DriverComparison2026 = () => {
    const [activeTab, setActiveTab] = useState(BASE_COMPARISON_TABS[0].id);
    const [activeAllYearsTab, setActiveAllYearsTab] = useState(ALL_YEARS_TABS[0].id);
    const [activeCompetingYearsTab, setActiveCompetingYearsTab] = useState(COMPETING_YEARS_TABS[0].id);
    const {
        allYears,
        driver1,
        driver1Data,
        driver1Id,
        driver2,
        driver2Data,
        driver2Id,
        drivers,
        error,
        isLoading,
        raceNamesByYear,
        selectComparison,
        sharedYears,
    } = useDriverComparison();
    const hasComparison = Boolean(driver1 && driver2 && driver1Data && driver2Data);
    const comparisonTabs = sharedYears.length
        ? [...BASE_COMPARISON_TABS, { id: "competing-years", label: "Competing Years" }]
        : BASE_COMPARISON_TABS;
    const driverNames = [driver1?.name || "Driver A", driver2?.name || "Driver B"];
    const driverCodes = [
        String(driver1Data?.driverCode || driver1?.code || "A").toUpperCase(),
        String(driver2Data?.driverCode || driver2?.code || "B").toUpperCase(),
    ];
    const careerStats = hasComparison ? [
        ["Wins", `${driver1Data.totalWins || 0} · ${percentage(driver1Data.winRate)}`, `${driver2Data.totalWins || 0} · ${percentage(driver2Data.winRate)}`],
        ["Podiums", `${driver1Data.totalPodiums || 0} · ${percentage(driver1Data.podiumRate)}`, `${driver2Data.totalPodiums || 0} · ${percentage(driver2Data.podiumRate)}`],
        ["Poles", `${driver1Data.totalPoles || 0} · ${percentage(driver1Data.poleRate)}`, `${driver2Data.totalPoles || 0} · ${percentage(driver2Data.poleRate)}`],
        ["DNFs", `${driver1Data.totalDNFs || 0} · ${percentage(driver1Data.dnfRate)}`, `${driver2Data.totalDNFs || 0} · ${percentage(driver2Data.dnfRate)}`],
    ] : [];

    useEffect(() => {
        if (activeTab === "competing-years" && !sharedYears.length) setActiveTab("all-years");
    }, [activeTab, sharedYears.length]);

    const positionFrequencyCharts = (
        <>
            {chartPanel(
                "05 — Race Results",
                "Finish Positions",
                "Number of times each finishing position was achieved",
                <BarChartTotal
                    driver1Name={driverNames[0]}
                    driver2Name={driverNames[1]}
                    driver1Data={driver1Data?.racePosition || {}}
                    driver2Data={driver2Data?.racePosition || {}}
                />
            )}
            {chartPanel(
                "06 — Saturday Count",
                "Qualifying Positions",
                "Number of times each qualifying position was achieved",
                <BarChartTotal
                    driver1Name={driverNames[0]}
                    driver2Name={driverNames[1]}
                    driver1Data={driver1Data?.qualiPosition || {}}
                    driver2Data={driver2Data?.qualiPosition || {}}
                />
            )}
        </>
    );

    return (
        <DesignSystem2026
            className="design-system-2026--driver-comparison"
            style={{ "--ds-2026-accent": "var(--ds-2026-brand-plum)" }}
        >
            {hasComparison && (
                <CrossEraHero2026
                    driver1={driver1}
                    driver2={driver2}
                    driver1Data={driver1Data}
                    driver2Data={driver2Data}
                />
            )}

            <JaggedContainer2026
                as="section"
                className="driver-comparison-2026-popular-section ds-2026-page-width"
                color="var(--ds-2026-bg)"
                edge="top"
                fullBleed
                lifted
                size="lg"
            >
                <span>Popular comparisons</span>
                <PopularComparisons2026 onSelect={selectComparison} />
            </JaggedContainer2026>

            {drivers.length > 0 && (
                <DriverComparisonControls2026
                    drivers={drivers}
                    driver1Id={driver1Id}
                    driver2Id={driver2Id}
                    sharedYears={sharedYears}
                    onSelect={selectComparison}
                />
            )}

            {isLoading && (
                <Loading
                    className="mt-[12rem] mb-[12rem]"
                    message="Opening cross-era dossier"
                />
            )}

            {!isLoading && error && (
                <section className="ds-2026-empty-state"><p>{error}</p></section>
            )}

            {!isLoading && hasComparison && (
                <div className="driver-comparison-2026__content">
                    <Tabs2026
                        activeTab={activeTab}
                        ariaLabel="Driver comparison sections"
                        className="driver-comparison-2026-tabs ds-2026-page-width"
                        idPrefix="driver-comparison-2026"
                        onChange={setActiveTab}
                        tabs={comparisonTabs}
                    >
                        {activeTab === "career" && <>
                            <CareerLedger2026 driver1={driver1} driver2={driver2} driver1Data={driver1Data} driver2Data={driver2Data} />
                            <section className="driver-comparison-2026-stat-wrap ds-2026-page-width">
                                <StatisticsSheet2026
                                    title="Career Statistics"
                                    fileMeta={`${driverCodes[0]}×${driverCodes[1]} _ CAREER AUDIT`}
                                    columns={driverNames}
                                    rows={careerStats}
                                />
                            </section>
                        </>}
                        {activeTab === "all-years" && (
                            <Tabs2026
                                activeTab={activeAllYearsTab}
                                ariaLabel="All years comparison views"
                                className="driver-comparison-2026-subtabs"
                                idPrefix="driver-comparison-2026-all-years"
                                onChange={setActiveAllYearsTab}
                                tabs={ALL_YEARS_TABS}
                            >
                                {activeAllYearsTab === "standings" && (
                                    <SeasonStandings2026
                                        driver1={driver1}
                                        driver2={driver2}
                                        driver1Data={driver1Data}
                                        driver2Data={driver2Data}
                                        years={allYears}
                                        eyebrow="02 — All Years"
                                    />
                                )}
                                {activeAllYearsTab === "career-shape" && <>
                                    <ChampionshipArc2026 driver1={driver1} driver2={driver2} driver1Data={driver1Data} driver2Data={driver2Data} />
                                    <PrimeShape2026 driver1Data={driver1Data} driver2Data={driver2Data} />
                                </>}
                                {activeAllYearsTab === "position-counts" && positionFrequencyCharts}
                            </Tabs2026>
                        )}
                        {activeTab === "competing-years" && (
                            <Tabs2026
                                activeTab={activeCompetingYearsTab}
                                ariaLabel="Competing years comparison views"
                                className="driver-comparison-2026-subtabs"
                                idPrefix="driver-comparison-2026-competing-years"
                                onChange={setActiveCompetingYearsTab}
                                tabs={COMPETING_YEARS_TABS}
                            >
                                {activeCompetingYearsTab === "standings" && (
                                    <SeasonStandings2026
                                        driver1={driver1}
                                        driver2={driver2}
                                        driver1Data={driver1Data}
                                        driver2Data={driver2Data}
                                        years={sharedYears}
                                        eyebrow="02 — Competing Years"
                                    />
                                )}
                                {activeCompetingYearsTab === "shared-grid" && (
                                    <SharedGrid2026 driver1={driver1} driver2={driver2} driver1Data={driver1Data} driver2Data={driver2Data} sharedYears={sharedYears} />
                                )}
                                {activeCompetingYearsTab === "race" && <>
                                    {chartPanel(
                                        "03 — Race Craft",
                                        "Race Position Comparison",
                                        "Only seasons both drivers competed against each other",
                                        <LineChartByYear
                                            driver1Name={driverNames[0]}
                                            driver2Name={driverNames[1]}
                                            driver1Data={driver1Data.racePosition}
                                            driver2Data={driver2Data.racePosition}
                                            competingYears={sharedYears}
                                            displayCompetingYears
                                            type="position"
                                            raceNamesByYear={raceNamesByYear}
                                        />
                                    )}
                                    {chartPanel(
                                        "04 — The Score",
                                        "Points After Each Race",
                                        "Cumulative points during shared seasons",
                                        <LineChartByYear
                                            driver1Name={driverNames[0]}
                                            driver2Name={driverNames[1]}
                                            driver1Data={driver1Data.posAfterRace}
                                            driver2Data={driver2Data.posAfterRace}
                                            competingYears={sharedYears}
                                            displayCompetingYears
                                            raceNamesByYear={raceNamesByYear}
                                        />
                                    )}
                                </>}
                                {activeCompetingYearsTab === "qualifying" && chartPanel(
                                    "05 — Qualifying",
                                    "Qualifying Position Comparison",
                                    "Only seasons both drivers competed against each other",
                                    <LineChartByYear
                                        driver1Name={driverNames[0]}
                                        driver2Name={driverNames[1]}
                                        driver1Data={driver1Data.qualiPosition}
                                        driver2Data={driver2Data.qualiPosition}
                                        competingYears={sharedYears}
                                        displayCompetingYears
                                        type="position"
                                        raceNamesByYear={raceNamesByYear}
                                    />
                                )}
                                {activeCompetingYearsTab === "position-counts" && positionFrequencyCharts}
                            </Tabs2026>
                        )}
                    </Tabs2026>
                </div>
            )}

            <section className="driver-comparison-2026-next-file">
                <div className="ds-2026-page-width">
                    <header><span>05 — Next File</span><span>Every era on record</span></header>
                    <h2>Settle Another Argument</h2>
                    <PopularComparisons2026 onSelect={selectComparison} inverse />
                </div>
            </section>
        </DesignSystem2026>
    );
};
