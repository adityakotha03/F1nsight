import React, { useEffect, useMemo, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons'

import { Header, Footer, ResultsSelector } from './components';
import {  ReactComponent as Logo} from './components/F1Ansight.svg';
import { DriverComparison, TeammatesComparison, RacePage, LandingPage, RaceResultsPage, DriverStandings, ConstructorStandings, APXAR, RaceResultsPageF1a, RacePageF1a, DriverStandingsF1a, ConstructorStandingsF1a } from './pages'; 

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
          setResultPagePath={setResultPagePath} 
        />
        <Footer />
      </Router>
    </div>
  );
}

function MainContent({ setSelectedYear, selectedYear, resultPage, resultPagePath, setResultPagePath }) {
  const location = useLocation().pathname;
  const validPaths = ['/race-results', '/constructor-standings', '/driver-standings'];
  const validF1APaths = useMemo(() => ['/f1a/race-results', '/f1a/constructor-standings', '/f1a/driver-standings', '/race-f1a/'], []);

  
  useEffect(() => {
    if (validF1APaths.includes(location) || location.startsWith('/race-f1a/')) {
      console.log('here');
      document.body.classList.add('bg-gradient');
    } else {
      console.log('here2');
      document.body.classList.remove('bg-gradient');
    }
    return () => {
      document.body.classList.remove('bg-gradient');
    };
  }, [location, validF1APaths]);

  return (
    <div className="grow">
      {validPaths.includes(location) && (
        <ResultsSelector 
          className="mt-[12.4rem] relative z-[100]" 
          setSelectedYear={setSelectedYear} 
          selectedYear={selectedYear} 
          resultPage={resultPage} 
          resultPagePath={resultPagePath} 
        />
      )}
      {(validF1APaths.includes(location) || location.startsWith('/race-f1a/')) && (
        <div className="mt-[12.4rem] relative z-[100]">
          <Logo height={48} className="mx-auto mb-16" />
          <ResultsSelector 
            setSelectedYear={setSelectedYear} 
            selectedYear={selectedYear} 
              resultPage={resultPage} 
              resultPagePath={resultPagePath} 
              f1a
          />
        </div>
      )}

      <Routes>
        <Route exact path="/" element={<LandingPage setResultPagePath={setResultPagePath} />} />
        <Route path="/race-results" element={<RaceResultsPage selectedYear={selectedYear} />} />
        <Route path="/constructor-standings" element={<ConstructorStandings selectedYear={selectedYear} />} />
        <Route path="/driver-standings" element={<DriverStandings selectedYear={selectedYear} />} />
        <Route path="/teammates-comparison/:urlYear?/:urlTeam?" element={<TeammatesComparison />}/>
        <Route path="/driver-comparison/:urlDriver1?/:urlDriver2?" element={<DriverComparison selectedYear={selectedYear} />} />
        <Route path="/race/:raceId" element={<RacePage />} />
        <Route path="/apxar" element={<APXAR />} />
        {/* F1A Routes */}
        <Route path="/race-f1a/:raceId" element={<RacePageF1a />} />
        <Route path="/f1a/race-results" element={<RaceResultsPageF1a selectedYear={selectedYear} />} />
        <Route path="/f1a/driver-standings" element={<DriverStandingsF1a selectedYear={selectedYear} />} />
        <Route path="/f1a/constructor-standings" element={<ConstructorStandingsF1a selectedYear={selectedYear} />} />
      </Routes>
    </div>
  );
}
 
export default App;