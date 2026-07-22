import React from "react";

import {
    Button,
    HeadToHeadChart,
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

const formatDate = (isoString) => {
    if (!isoString) return "";

    return new Date(isoString).toLocaleString();
};

export const TeammatesComparison2026 = () => {
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
                "--ds-2026-paper-panel-bg": darkTeamColor,
            }}
        >
            <DriverHeroLockup2026
                year={year}
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
                <div className="ds-2026-teammates">
                    {(ambQ || ambR) && (
                        <p className="ds-2026-teammates__notice">
                            These drivers have limited same-season overlap in the archive.
                        </p>
                    )}

                    <DossierSectionHeader2026
                        eyebrow="01 — The Count"
                        title="The Scoreboard"
                        accent="Scoreboard"
                        meta="Season verdicts"
                    />
                    <Scoreboard2026 comparison={headToHeadData} />

                    <StatSheet2026 comparison={headToHeadData} />

                    <DossierSectionHeader2026
                        eyebrow="02 — Racecraft"
                        title="Gained Or Lost"
                        accent="Lost"
                        meta="Grid slot to chequered flag"
                    />
                    <ChartPanel2026 label="Positions gained (+) or lost (-) per grand prix">
                        <PositionsGainedLostChart
                            headToHeadData={headToHeadData}
                            teamColor={teamColor}
                        />
                    </ChartPanel2026>

                    <DossierSectionHeader2026
                        eyebrow="03 — Saturday"
                        title="The Quali Gap"
                        accent="Gap"
                        meta="Qualifying gap in seconds"
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

                    {!ambQ && !ambR && (
                        <>
                            <DossierSectionHeader2026
                                eyebrow="04 — Traces"
                                title="Season Traces"
                                accent="Traces"
                                meta="Position by round"
                            />
                            <div className="ds-2026-chart-grid">
                                <ChartPanel2026 label="Qualifying positions">
                                    <PositionsComparisonChart
                                        headToHeadData={headToHeadData}
                                        teamColor={teamColor}
                                        isQualifying
                                    />
                                </ChartPanel2026>
                                <ChartPanel2026 label="Race positions">
                                    <PositionsComparisonChart
                                        headToHeadData={headToHeadData}
                                        teamColor={teamColor}
                                        isQualifying={false}
                                    />
                                </ChartPanel2026>
                            </div>
                        </>
                    )}

                    <DossierSectionHeader2026
                        eyebrow="05 — Summary"
                        title="Head To Head"
                        accent="Head"
                        meta="Legacy chart reference"
                    />
                    <ChartPanel2026>
                        <HeadToHeadChart
                            headToHeadData={headToHeadData}
                            color={`#${teamColor}`}
                        />
                    </ChartPanel2026>
                </div>
            )}
        </DesignSystem2026>
    );
};
