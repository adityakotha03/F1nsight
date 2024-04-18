import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { fetchUpcomingRace } from './utils/api';
import { Header, RaceSelector, RacePage, DriverStandings, ConstructorStandings, RaceResultsPage } from './components';

library.add(fas);

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [races, setRaces] = useState([]);
  const [upcomingRace, setUpcomingRace] = useState(null);
  const [isRaceSelected, setIsRaceSelected] = useState(false);

  useEffect(() => {
    const fetchRaces = async () => {
      const response = await fetch(`https://api.openf1.org/v1/meetings?year=${selectedYear}`);
      if (response.ok) {
        const data = await response.json();
        setRaces(data);
      }
    };

    fetchRaces();
  }, [selectedYear]);

  useEffect(() => {
    const today = new Date();
    const fetchUpcoming = async () => {
      const race = await fetchUpcomingRace(today.getFullYear());
      setUpcomingRace(race);
    };

    fetchUpcoming();
  }, []);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
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
      <Header>
        <select value={selectedYear} onChange={handleYearChange} className="bg-glow gradient-border bg-transparent">
          {generateYears(2023).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        {/* Use RaceSelector for race selection */}
        <RaceSelector races={races} selectedYear={selectedYear} setIsRaceSelected={setIsRaceSelected} />
      </Header>
      {!isRaceSelected && ( // Conditional rendering based on isRaceSelected
        <nav className="flex flex-col sm:flex-row items-center justify-center gap-16 sm:gap-32 py-48 shadow-xl border-b-2 border-neutral-800 mb-48 heading-4">
          <NavLink activeClassName="active" className="navLink" to="/">Race Results</NavLink>
          <NavLink activeClassName="active" className="navLink" to="/constructor-standings">Constructor Standings</NavLink>
          <NavLink activeClassName="active" className="navLink" to="/driver-standings">Driver Standings</NavLink>
        </nav>
      )}
      <div className='px-8 sm:px-16'>
        {/* {upcomingRace && (
          <div>
            <h2>Upcoming Race</h2>
            <p>Race Name: {upcomingRace.raceName}</p>
            <p>Date: {upcomingRace.date}</p>
            <p>Time: {upcomingRace.time}</p>
          </div>
        )} */}

        <Routes>
          <Route exact path="/" element={<RaceResultsPage selectedYear={selectedYear} />} />
          <Route path="/constructor-standings" element={<ConstructorStandings selectedYear={selectedYear} />} />
          <Route path="/driver-standings" element={<DriverStandings selectedYear={selectedYear} />} />
          <Route path="/race/:raceId" element={<RacePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;