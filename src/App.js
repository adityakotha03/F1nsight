import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons'
import SupportPopup from './components/SupportPopup';
import { Header, FooterDetails, RacePage, DriverStandings, ConstructorStandings, RaceResultsPage } from './components';

library.add(fas, fab);

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  return (
    <Router>
      <Header setSelectedYear={setSelectedYear} selectedYear={selectedYear} currentYear={currentYear} />
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