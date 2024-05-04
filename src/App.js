import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

//import { fetchUpcomingRace } from './utils/api';
import { Header, FooterDetails, RaceSelector, RacePage, DriverStandings, ConstructorStandings, RaceResultsPage, Select } from './components';
import { Footer } from 'flowbite-react';

library.add(fas);

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [races, setRaces] = useState([]);
  //const [upcomingRace, setUpcomingRace] = useState(null);
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

  {/*useEffect(() => {
    const today = new Date();
    const fetchUpcoming = async () => {
      const race = await fetchUpcomingRace(today.getFullYear());
      setUpcomingRace(race);
    };

    fetchUpcoming();
  }, []);*/}

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
      <Header isRaceSelected={isRaceSelected}>
        <Select label="Year" value={selectedYear} onChange={handleYearChange}>
          {generateYears(2023).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Select>
        {/* Use RaceSelector for race selection */}
        <RaceSelector races={races} selectedYear={selectedYear} setIsRaceSelected={setIsRaceSelected} />
      </Header>
      <Routes>
        <Route exact path="/" element={<RaceResultsPage selectedYear={selectedYear} />} />
        <Route path="/constructor-standings" element={<ConstructorStandings selectedYear={selectedYear} />} />
        <Route path="/driver-standings" element={<DriverStandings selectedYear={selectedYear} />} />
        <Route path="/race/:raceId" element={<RacePage />} />
      </Routes>
      <FooterDetails></FooterDetails>
    </Router>
  );
}

export default App;