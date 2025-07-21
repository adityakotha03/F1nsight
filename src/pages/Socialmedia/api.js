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

export async function getDriverStandings(year = 2025) {
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

export async function getConstructorStandings(year = 2025) {
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
    const url = `https://api.openf1.org/v1/sessions?meeting_key=${meeting_key}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch sessions');
    }
    const data = await response.json();
    // Filter for session_type === 'Race'
    const raceSessions = data.filter(session => session.session_type === 'Race');
    // console.log('raceSessions', raceSessions);
    // For each session, fetch the starting grid and enrich with driver/team data
    const grids = await Promise.all(
        raceSessions.map(async session => {
            const gridUrl = `https://api.openf1.org/v1/starting_grid?session_key=${session.session_key}`;
            const gridResponse = await fetch(gridUrl);
            if (!gridResponse.ok) {
                throw new Error(`Failed to fetch starting grid for session_key ${session.session_key}`);
            }

            const resultUrl = `https://api.openf1.org/v1/session_result?session_key=${session.session_key}`;
            const resultResponse = await fetch(resultUrl);
            if (!resultResponse.ok) {
                throw new Error(`Failed to fetch results for session_key ${session.session_key}`);
            }
            const driversUrl = `https://api.openf1.org/v1/drivers?session_key=${session.session_key}`;
            const driversResponse = await fetch(driversUrl);
            if (!driversResponse.ok) {
                throw new Error(`Failed to fetch drivers for session_key ${session.session_key}`);
            }
            
            const grid = await gridResponse.json();
            const result = await resultResponse.json();
            const drivers = await driversResponse.json();
            
            // Enrich grid data with driver information
            const enrichedGrid = grid.map(gridEntry => {
                const driver = drivers.find(d => d.driver_number === gridEntry.driver_number);
                return {
                    ...gridEntry,
                    driver: driver ? {
                        ...driver,
                        constructorId: mapTeamNameToConstructorId(driver.team_name)
                    } : null
                };
            });
            
            // Enrich result data with driver information
            const enrichedResult = result.map(resultEntry => {
                const driver = drivers.find(d => d.driver_number === resultEntry.driver_number);
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
