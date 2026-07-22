import React, { useState } from "react";

import {
    Button,
    Loading,
    PositionsComparisonChart,
    PositionsGainedLostChart,
    QualifyingLapTimesChart,
    QualifyingLapTimesDeltaChart,
} from "../../components";
import { useTeammatesComparison } from "../../hooks/useTeammatesComparison";
import { DesignSystem2026 } from "./DesignSystem2026";
import {
    ChartPanel2026,
    DossierControlDeck2026,
    DossierSectionHeader2026,
    DriverHeroLockup2026,
    Scoreboard2026,
    StatSheet2026,
} from "./components";
import { darkenColor } from "../../utils/darkenColor";

const BRAND_PLUM = "5F0B84";

const DOSSIER_TABS = [
    { id: "scoreboard", label: "Scoreboard" },
    { id: "qualifying", label: "Qualifying" },
    { id: "race-day", label: "Race Day" },
];

const formatDate = (isoString) => {
    if (!isoString) return "";

    return new Date(isoString).toLocaleString();
};

export const TeammatesComparison2026 = () => {
    const [activeTab, setActiveTab] = useState(DOSSIER_TABS[0].id);
    const {
        ambQ,
        ambR,
        driverOptions,
        handleDriver1Change,
        handleDriver2Change,
        handleShowDifference,
        handleShowTimes,
        handleSwapDrivers,
        handleTeamChange,
        handleYearChange,
        headToHeadData,
        isLoading,
        renderHead,
        selectedDriver1,
        selectedDriver2,
        selectedTeamName,
        showDriverSelectors,
        showTimes,
        team,
        teamColor,
        teamOptions,
        year,
        yearOptions,
    } = useTeammatesComparison();

    const hasComparison = Boolean(headToHeadData && renderHead);
    const lastUpdated = formatDate(headToHeadData?.lastUpdate);
    const accentColor = `#${teamColor || BRAND_PLUM}`;
    const darkTeamColor = darkenColor(teamColor || BRAND_PLUM);
    const handleTabKeyDown = (event, tabIndex) => {
        let nextIndex = tabIndex;

        if (event.key === "ArrowRight") nextIndex = (tabIndex + 1) % DOSSIER_TABS.length;
        if (event.key === "ArrowLeft") {
            nextIndex = (tabIndex - 1 + DOSSIER_TABS.length) % DOSSIER_TABS.length;
        }
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = DOSSIER_TABS.length - 1;
        if (nextIndex === tabIndex) return;

        event.preventDefault();
        const nextTab = DOSSIER_TABS[nextIndex];
        setActiveTab(nextTab.id);
        document.getElementById(`ds-2026-tab-${nextTab.id}`)?.focus();
    };

    return (
        <DesignSystem2026
            className="design-system-2026--teammates-comparison"
            style={{
                "--ds-2026-accent": accentColor,
                "--ds-2026-paper-panel-bg": darkTeamColor,
            }}
        >
            <DriverHeroLockup2026
                year={year}
                teamId={team}
                teamName={selectedTeamName}
                comparison={headToHeadData}
            />

            <DossierControlDeck2026
                year={year}
                yearOptions={yearOptions}
                team={team}
                teamOptions={teamOptions}
                selectedDriver1={selectedDriver1}
                selectedDriver2={selectedDriver2}
                driverOptions={driverOptions}
                showDriverSelectors={showDriverSelectors}
                onYearChange={handleYearChange}
                onTeamChange={handleTeamChange}
                onDriver1Change={handleDriver1Change}
                onDriver2Change={handleDriver2Change}
                onSwapDrivers={handleSwapDrivers}
                lastUpdated={lastUpdated}
            />

            {isLoading && (
                <Loading
                    className="mt-[12rem] mb-[12rem]"
                    message="Building teammate dossier"
                />
            )}

            {!isLoading && !hasComparison && (
                <section className="ds-2026-empty-state">
                    <p>Choose a season and team to open the comparison file.</p>
                </section>
            )}

            {!isLoading && hasComparison && (
                <div className="ds-2026-teammates ds-2026-page-width">
                    {(ambQ || ambR) && (
                        <p className="ds-2026-teammates__notice">
                            These drivers have limited same-season overlap in the archive.
                        </p>
                    )}

                    <div className="ds-2026-tabs" role="tablist" aria-label="Teammate comparison sections">
                        {DOSSIER_TABS.map(({ id, label }, index) => (
                            <button
                                key={id}
                                id={`ds-2026-tab-${id}`}
                                className="ds-2026-tabs__tab"
                                type="button"
                                role="tab"
                                aria-controls={`ds-2026-panel-${id}`}
                                aria-selected={activeTab === id}
                                tabIndex={activeTab === id ? 0 : -1}
                                onClick={() => setActiveTab(id)}
                                onKeyDown={(event) => handleTabKeyDown(event, index)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div
                        key={activeTab}
                        id={`ds-2026-panel-${activeTab}`}
                        className="ds-2026-tabs__panel"
                        role="tabpanel"
                        aria-labelledby={`ds-2026-tab-${activeTab}`}
                        tabIndex={0}
                    >
                        {activeTab === "scoreboard" && (
                            <>
                                <DossierSectionHeader2026
                                    eyebrow="01 — The Count"
                                    title="The Scoreboard"
                                    accent="Scoreboard"
                                    meta="Season verdicts"
                                />
                                <Scoreboard2026 comparison={headToHeadData} />
                                <StatSheet2026 comparison={headToHeadData} />
                            </>
                        )}

                        {activeTab === "qualifying" && (
                            <>
                                <DossierSectionHeader2026
                                    eyebrow="02 — Saturday"
                                    title="The Quali Gap"
                                    accent="Gap"
                                    meta="Qualifying performance by round"
                                />
                                <ChartPanel2026 label="Fastest qualifying lap comparison">
                                    <div className="ds-2026-chart-panel__actions">
                                        <Button
                                            onClick={handleShowTimes}
                                            buttonStyle="hollow"
                                            active={showTimes}
                                            size="sm"
                                        >
                                            Show Times
                                        </Button>
                                        <Button
                                            onClick={handleShowDifference}
                                            buttonStyle="hollow"
                                            active={!showTimes}
                                            size="sm"
                                        >
                                            Show Deltas
                                        </Button>
                                    </div>
                                    {showTimes ? (
                                        <QualifyingLapTimesChart
                                            headToHeadData={headToHeadData}
                                            teamColor={teamColor}
                                        />
                                    ) : (
                                        <QualifyingLapTimesDeltaChart
                                            headToHeadData={headToHeadData}
                                            teamColor={teamColor}
                                        />
                                    )}
                                </ChartPanel2026>
                                <ChartPanel2026 label="Qualifying positions">
                                    <PositionsComparisonChart
                                        headToHeadData={headToHeadData}
                                        teamColor={teamColor}
                                        isQualifying
                                    />
                                </ChartPanel2026>
                            </>
                        )}

                        {activeTab === "race-day" && (
                            <>
                                <DossierSectionHeader2026
                                    eyebrow="03 — Sunday"
                                    title="Race Day"
                                    accent="Race"
                                    meta="Grand prix performance by round"
                                />
                                <ChartPanel2026 label="Positions gained (+) or lost (-) per grand prix">
                                    <PositionsGainedLostChart
                                        headToHeadData={headToHeadData}
                                        teamColor={teamColor}
                                    />
                                </ChartPanel2026>
                                <ChartPanel2026 label="Race positions">
                                    <PositionsComparisonChart
                                        headToHeadData={headToHeadData}
                                        teamColor={teamColor}
                                        isQualifying={false}
                                    />
                                </ChartPanel2026>
                            </>
                        )}
                    </div>
                </div>
            )}
        </DesignSystem2026>
    );
};
