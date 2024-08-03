import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons'

import { Header, Footer, ResultsSelector } from './components';
import { DriverComparison, TeammatesComparison, RacePage, RaceResultsPageF1a, RacePageF1a, LandingPage, RaceResultsPage, DriverStandings, ConstructorStandings, APXAR } from './pages'; 

import './App.scss';

library.add(fas, fab);

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [resultPage, setResultPage] = useState('');
  const [resultPagePath, setResultPagePath] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Header 
          setResultPage={setResultPage} 
          setResultPagePath={setResultPagePath} 
        />
        <MainContent
          setSelectedYear={setSelectedYear}
          selectedYear={selectedYear}
          resultPage={resultPage}
          resultPagePath={resultPagePath}
        />
        <Footer />
      </Router>
    </div>
  );
}

function MainContent({ setSelectedYear, selectedYear, resultPage, resultPagePath }) {
  const location = useLocation();
  const validPaths = ['/race-results', '/constructor-standings', '/driver-standings'];

  return (
    <div className="grow">
      {validPaths.includes(location.pathname) && (
        <ResultsSelector 
          className="mt-[12.4rem] relative z-[100]" 
          setSelectedYear={setSelectedYear} 
          selectedYear={selectedYear} 
          resultPage={resultPage} 
          resultPagePath={resultPagePath} 
        />
      )}
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/race-results" element={<RaceResultsPage setSelectedYear={setSelectedYear} selectedYear={selectedYear} />} />
        <Route path="/constructor-standings" element={<ConstructorStandings setSelectedYear={setSelectedYear} selectedYear={selectedYear} />} />
        <Route path="/driver-standings" element={<DriverStandings setSelectedYear={setSelectedYear} selectedYear={selectedYear} />} />
        <Route path="/teammates-comparison/:urlYear?/:urlTeam?" element={<TeammatesComparison />}/>
        <Route path="/driver-comparison/:urlDriver1?/:urlDriver2?" element={<DriverComparison selectedYear={selectedYear} />} />
        <Route path="/race/:raceId" element={<RacePage />} />
        <Route path="/race-f1a/:raceId" element={<RacePageF1a />} />
        <Route path="/f1a/race-results" element={<RaceResultsPageF1a />} />
        <Route path="/apxar" element={<APXAR />} />
      </Routes>
    </div>
  );
}
 
export default App;