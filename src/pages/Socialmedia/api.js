import { buildOpenF1Url } from "../../config/openf1";
import { getCurrentYear } from "../../utils/currentYear";

const OPENF1_DIRECT_API_BASE_URL = "https://api.openf1.org/v1";

// Utility function to map team names to constructor IDs
export const mapTeamNameToConstructorId = (teamName) => {
    const teamMapping = {
        'Alpine F1 Team': 'alpine',
        'Aston Martin Aramco F1 Team': 'aston_martin',
        'Ferrari': 'ferrari',
        'Haas F1 Team': 'haas',
        'McLaren': 'mclaren',
        'Mercedes': 'mercedes',
        'RB': 'rb',
        'Red Bull Racing': 'red_bull',
        'Stake F1 Team Kick Sauber': 'sauber',
        'Williams': 'williams',
        // Add more mappings as needed
    };
    return teamMapping[teamName] || teamName?.toLowerCase().replace(/\s+/g, '_');
};

const buildDirectOpenF1Url = (path = "") => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${OPENF1_DIRECT_API_BASE_URL}${normalizedPath}`;
};

const fetchOpenF1JsonWithFallback = async (
    path,
    queryParams = {},
    options = {}
) => {
    const { allow404 = false } = options;
    const searchParams = new URLSearchParams(queryParams);
    const queryString = searchParams.toString();
    const proxyUrl = `${buildOpenF1Url(path)}${queryString ? `?${queryString}` : ""}`;
    const directUrl = `${buildDirectOpenF1Url(path)}${queryString ? `?${queryString}` : ""}`;

    try {
        // Prefer official OpenF1 directly to avoid proxy CORS/runtime noise.
        const directResponse = await fetch(directUrl);
        if (!directResponse.ok) {
            if (allow404 && directResponse.status === 404) {
                return [];
            }
            throw new Error(`OpenF1 direct request failed: ${directResponse.status}`);
        }
        return await directResponse.json();
    } catch (directError) {
        // Fallback to proxy backend if direct request fails.
        const proxyResponse = await fetch(proxyUrl);
        if (!proxyResponse.ok) {
            if (allow404 && proxyResponse.status === 404) {
                return [];
            }
            throw new Error(`OpenF1 proxy request failed: ${proxyResponse.status}`);
        }
        return await proxyResponse.json();
    }
};

export async function getDriverStandings(year = getCurrentYear()) {
    try {
        const url = `https://api.jolpi.ca/ergast/f1/${year}/driverstandings/`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch driver standings');
        }
        const data = await response.json();
        
        const driverStandings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        
        // Sort by position (already sorted by API, but ensuring order)
        const sortedStandings = driverStandings.sort((a, b) => 
            parseInt(a.position) - parseInt(b.position)
        );
        
        return sortedStandings.map(standing => ({
            position: standing.position,
            positionText: standing.positionText,
            points: standing.points,
            wins: standing.wins,
            driver: {
                driverId: standing.Driver.driverId,
                permanentNumber: standing.Driver.permanentNumber,
                code: standing.Driver.code,
                givenName: standing.Driver.givenName,
                familyName: standing.Driver.familyName,
                dateOfBirth: standing.Driver.dateOfBirth,
                nationality: standing.Driver.nationality
            },
            constructor: {
                constructorId: standing.Constructors[0].constructorId,
                name: standing.Constructors[0].name,
                nationality: standing.Constructors[0].nationality
            }
        }));
    } catch (error) {
        console.error('Error fetching driver standings:', error);
        return [];
    }
}

export async function getConstructorStandings(year = getCurrentYear()) {
    try {
        const url = `https://api.jolpi.ca/ergast/f1/${year}/constructorstandings/`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch constructor standings');
        }
        const data = await response.json();

        console.log('data', data);
        
        const constructorStandings = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
        
        // Sort by position (already sorted by API, but ensuring order)
        const sortedStandings = constructorStandings.sort((a, b) => 
            parseInt(a.position) - parseInt(b.position)
        );
        
        return sortedStandings.map(standing => ({
            position: standing.position,
            positionText: standing.positionText,
            points: standing.points,
            wins: standing.wins,
            constructor: {
                constructorId: standing.Constructor.constructorId,
                name: standing.Constructor.name,
                nationality: standing.Constructor.nationality
            }
        }));
    } catch (error) {
        console.error('Error fetching constructor standings:', error);
        return [];
    }
}

export async function getRaceWeekendResults(meeting_key) {
    console.log('meeting_key', meeting_key);
    const data = await fetchOpenF1JsonWithFallback("/sessions", { meeting_key });
    // Include both Sprint and Race sessions when available.
    const raceSessions = data
        .filter((session) => session.session_type === "Race")
        .sort(
            (a, b) =>
                new Date(a.date_start || 0).getTime() -
                new Date(b.date_start || 0).getTime()
        );
    const qualifyingSessions = data.filter((session) => {
        const sessionName = session.session_name || "";
        return (
            sessionName === "Qualifying" ||
            sessionName === "Sprint Qualifying" ||
            sessionName === "Sprint Shootout"
        );
    });

    const getGridFallbackSessionKey = (raceSession) => {
        const raceStart = new Date(raceSession?.date_start || 0).getTime();
        const sortedCandidates = [...qualifyingSessions].sort((a, b) => {
            const aStart = new Date(a?.date_start || 0).getTime();
            const bStart = new Date(b?.date_start || 0).getTime();
            return bStart - aStart;
        });

        const beforeRace = sortedCandidates.find((candidate) => {
            const candidateStart = new Date(candidate?.date_start || 0).getTime();
            return Number.isFinite(raceStart) && candidateStart <= raceStart;
        });

        return beforeRace?.session_key || sortedCandidates[0]?.session_key || null;
    };
    // console.log('raceSessions', raceSessions);
    // For each session, fetch the starting grid and enrich with driver/team data
    const grids = await Promise.all(
        raceSessions.map(async session => {
            let grid = await fetchOpenF1JsonWithFallback("/starting_grid", {
                session_key: session.session_key,
            }, { allow404: true });
            const fallbackGridSessionKey = getGridFallbackSessionKey(session);
            if (
                (!Array.isArray(grid) || grid.length === 0) &&
                fallbackGridSessionKey &&
                fallbackGridSessionKey !== session.session_key
            ) {
                grid = await fetchOpenF1JsonWithFallback("/starting_grid", {
                    session_key: fallbackGridSessionKey,
                }, { allow404: true });
            }

            const [result, drivers] = await Promise.all([
                fetchOpenF1JsonWithFallback("/session_result", {
                    session_key: session.session_key,
                }),
                fetchOpenF1JsonWithFallback("/drivers", {
                    session_key: session.session_key,
                }),
            ]);
            const safeGrid = Array.isArray(grid) ? grid : [];
            const safeResult = Array.isArray(result) ? result : [];
            const safeDrivers = Array.isArray(drivers) ? drivers : [];
            
            // Enrich grid data with driver information
            const enrichedGrid = safeGrid.map(gridEntry => {
                const driver = safeDrivers.find(d => d.driver_number === gridEntry.driver_number);
                return {
                    ...gridEntry,
                    driver: driver ? {
                        ...driver,
                        constructorId: mapTeamNameToConstructorId(driver.team_name)
                    } : null
                };
            });
            
            // Enrich result data with driver information
            const enrichedResult = safeResult.map(resultEntry => {
                const driver = safeDrivers.find(d => d.driver_number === resultEntry.driver_number);
                return {
                    ...resultEntry,
                    driver: driver ? {
                        ...driver,
                        constructorId: mapTeamNameToConstructorId(driver.team_name)
                    } : null
                };
            });
            
            // Sort grid by position (ascending)
            enrichedGrid.sort((a, b) => Number(a.position) - Number(b.position));
            
            // Sort result by position (ascending), handling null positions (DNF) at the end
            enrichedResult.sort((a, b) => {
                const posA = a.position ? Number(a.position) : 999;
                const posB = b.position ? Number(b.position) : 999;
                return posA - posB;
            });
            
            return {
                session_key: session.session_key,
                session_name: session.session_name,
                grid: enrichedGrid,
                result: enrichedResult,
            };
        })
    );
    return grids;
}
