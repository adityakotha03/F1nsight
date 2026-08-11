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
    TeammateComparisonChartPanel2026,
    TeammateComparisonControlDeck2026,
    SectionHeader2026,
    Tabs2026,
    TeammateComparisonHero2026,
    TeammateComparisonScoreboard2026,
    TeammateComparisonStatSheet2026,
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
    return (
        <DesignSystem2026
            className="design-system-2026--teammates-comparison"
            style={{
                "--ds-2026-accent": accentColor,
                "--teammates-2026-paper-panel-bg": darkTeamColor,
            }}
        >
            <TeammateComparisonHero2026
                year={year}
                teamId={team}
                teamName={selectedTeamName}
                comparison={headToHeadData}
            />

            <TeammateComparisonControlDeck2026
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
                <div className="teammates-2026-content ds-2026-page-width">
                    {(ambQ || ambR) && (
                        <p className="teammates-2026-content__notice">
                            These drivers have limited same-season overlap in the archive.
                        </p>
                    )}

                    <Tabs2026
                        activeTab={activeTab}
                        ariaLabel="Teammate comparison sections"
                        idPrefix="teammates-2026"
                        onChange={setActiveTab}
                        tabs={DOSSIER_TABS}
                    >
                        {activeTab === "scoreboard" && (
                            <>
                                <SectionHeader2026
                                    eyebrow="01 — The Count"
                                    title="The Scoreboard"
                                    accent="Scoreboard"
                                    meta="Season verdicts"
                                />
                                <TeammateComparisonScoreboard2026 comparison={headToHeadData} />
                                <TeammateComparisonStatSheet2026
                                    comparison={headToHeadData}
                                    fileMeta={`${String(team || "Team").slice(0, 3).toUpperCase()}-${String(year).slice(-2)} _ GARAGE AUDIT`}
                                />
                            </>
                        )}

                        {activeTab === "qualifying" && (
                            <>
                                <SectionHeader2026
                                    eyebrow="02 — Saturday"
                                    title="The Quali Gap"
                                    accent="Gap"
                                    meta="Qualifying performance by round"
                                />
                                <TeammateComparisonChartPanel2026 label="Fastest qualifying lap comparison">
                                    <div className="teammates-2026-chart-panel__actions">
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
                                </TeammateComparisonChartPanel2026>
                                <TeammateComparisonChartPanel2026 label="Qualifying positions">
                                    <PositionsComparisonChart
                                        headToHeadData={headToHeadData}
                                        teamColor={teamColor}
                                        isQualifying
                                    />
                                </TeammateComparisonChartPanel2026>
                            </>
                        )}

                        {activeTab === "race-day" && (
                            <>
                                <SectionHeader2026
                                    eyebrow="03 — Sunday"
                                    title="Race Day"
                                    accent="Race"
                                    meta="Grand prix performance by round"
                                />
                                <TeammateComparisonChartPanel2026 label="Positions gained (+) or lost (-) per grand prix">
                                    <PositionsGainedLostChart
                                        headToHeadData={headToHeadData}
                                        teamColor={teamColor}
                                    />
                                </TeammateComparisonChartPanel2026>
                                <TeammateComparisonChartPanel2026 label="Race positions">
                                    <PositionsComparisonChart
                                        headToHeadData={headToHeadData}
                                        teamColor={teamColor}
                                        isQualifying={false}
                                    />
                                </TeammateComparisonChartPanel2026>
                            </>
                        )}
                    </Tabs2026>
                </div>
            )}
        </DesignSystem2026>
    );
};
