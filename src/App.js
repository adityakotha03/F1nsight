import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RaceDetailsPage from './RaceResultsPage';
import ConstructorPoints from './ConstructorStandings';
import DriverStandings from './DriverStandings';
import { fetchUpcomingRace } from './api';

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState('');
  const [upcomingRace, setUpcomingRace] = useState(null);

  useEffect(() => {
    const fetchRaces = async () => {
      const response = await fetch(`https://api.openf1.org/v1/meetings?year=${selectedYear}`);
      if (response.ok) {
        const data = await response.json();
        setRaces(data);
      }
    };

    const fetchUpcoming = async () => {
      const race = await fetchUpcomingRace(selectedYear);
      setUpcomingRace(race);
    };

    fetchRaces();
    fetchUpcoming();
  }, [selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleRaceChange = (e) => {
    setSelectedRace(e.target.value);
  };

  const generateYears = (startYear) => {
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <Router>
      <div>
        <h1>F1 Race Details</h1>
        {upcomingRace && (
          <div>
            <h2>Upcoming Race</h2>
            <p>Race Name: {upcomingRace.raceName}</p>
            <p>Date: {upcomingRace.date}</p>
            <p>Time: {upcomingRace.time}</p>
          </div>
        )}
        <select value={selectedYear} onChange={handleYearChange}>
          {generateYears(1950).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select value={selectedRace} onChange={handleRaceChange}>
          <option value="">Race</option>
          {races.map((race) => (
            <option key={race.meeting_id} value={race.meeting_name}>{race.meeting_name}</option>
          ))}
        </select>
        {selectedRace && <p>Selected Race: {selectedRace}</p>}
        <nav>
          <Link to="/">Race Results</Link> | <Link to="/constructor-standings">Constructor Standings</Link> | <Link to="/driver-standings">Driver Standings</Link>
        </nav>
        <Routes>
          <Route exact path="/" element={<RaceDetailsPage selectedYear={selectedYear} />} />
          <Route path="/constructor-standings" element={<ConstructorPoints selectedYear={selectedYear} />} />
          <Route path="/driver-standings" element={<DriverStandings selectedYear={selectedYear} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;