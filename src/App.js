import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons'
import SupportPopup from './components/SupportPopup';
import { Header, Footer } from './components';
import { DriverComparison, TeammatesComparison, RacePage, LandingPage, RaceResultsPage, DriverStandings, ConstructorStandings } from './pages'; 

import './App.scss';

library.add(fas, fab);

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header setSelectedYear={setSelectedYear} selectedYear={selectedYear} currentYear={currentYear} />
        <div className="grow">
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route path="/race-results" element={<RaceResultsPage selectedYear={selectedYear} />} />
            <Route path="/constructor-standings" element={<ConstructorStandings selectedYear={selectedYear} />} />
            <Route path="/teammates-comparison" element={<TeammatesComparison />}/>
            <Route path="/driver-comparison" element={<DriverComparison selectedYear={selectedYear} />} />
            <Route path="/driver-standings" element={<DriverStandings selectedYear={selectedYear} />} />
            <Route path="/race/:raceId" element={<RacePage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;