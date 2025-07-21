// Utility functions for social media components

export const calculatePositionChange = (currentStandings, previousStandings, idKey) => {
    if (!previousStandings || !currentStandings) return {};
    
    const changes = {};
    
    currentStandings.forEach(current => {
        const currentId = current[idKey];
        const currentPosition = parseInt(current.position);
        
        // Find previous position
        const previous = previousStandings.find(prev => prev[idKey] === currentId);
        const previousPosition = previous ? parseInt(previous.position) : null;
        
        if (previousPosition !== null) {
            const change = previousPosition - currentPosition; // Positive = gained positions
            changes[currentId] = change;
        } else {
            changes[currentId] = 'new'; // New entry
        }
    });
    
    return changes;
};

export const getPositionChangeDisplay = (change) => {
    if (change === 'new') return '🆕';
    if (change === 0) return '↔️';
    if (change > 0) return `+${change}`;
    if (change < 0) return `${change}`;
    return '';
};

export const getPositionChangeColor = (change) => {
    if (change === 'new') return 'text-green-400';
    if (change === 0) return 'text-gray-400';
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
};

// Simple helper function for individual position changes
export const getPositionChange = (currentPosition, driverId, standingsKey = 'driverStandings') => {
    try {
        const stored = localStorage.getItem(standingsKey);
        if (!stored) return null;
        
        const previousStandings = JSON.parse(stored);
        const previousDriver = previousStandings.find(driver => 
            standingsKey === 'driverStandings' 
                ? driver.driver.driverId === driverId
                : driver.constructor.constructorId === driverId
        );
        
        if (!previousDriver) return 'new';
        
        const previousPosition = parseInt(previousDriver.position);
        const currentPos = parseInt(currentPosition);
        
        return previousPosition - currentPos; // Positive = gained positions
    } catch (error) {
        console.error('Error getting position change:', error);
        return null;
    }
};

// Store standings in localStorage
export const storeStandings = (key, standings) => {
    try {
        localStorage.setItem(key, JSON.stringify(standings));
    } catch (error) {
        console.error('Failed to store standings:', error);
    }
};

// Get standings from localStorage
export const getStoredStandings = (key) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error('Failed to get stored standings:', error);
        return null;
    }
}; 