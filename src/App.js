import React, { useEffect, useMemo, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons'

import { Header, Footer2025, ResultsSelector } from './components';
import {  ReactComponent as F1ALogo} from './components/F1Ansight.svg';
import {  ReactComponent as F2Logo} from './components/F2nsight.svg';
import { 
  DriverComparison,
  TeammatesComparison, 
  LandingPage2025, 
  ARViewer, 
  RaceResultsPage, 
  RacePage, 
  DriverStandings, 
  ConstructorStandings, 
  RaceResultsPageF1a, 
  RacePageF1a, 
  DriverStandingsF1a, 
  ConstructorStandingsF1a,
  RaceResultsPageF2, 
  RacePageF2, 
  DriverStandingsF2, 
  ConstructorStandingsF2
} from './pages'; 
import { usePageTracking, useScrollTracking } from './utils/gaTracking';
import { ScrollToTop } from './utils/ScrollToTop';

import './App.scss';

library.add(fas, fab);

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [resultPage, setResultPage] = useState('');
  const [resultPagePath, setResultPagePath] = useState('');

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Router>
        <ScrollToTop />
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
        <Footer2025 />
      </Router>
    </div>
  );
}

function MainContent({ setSelectedYear, selectedYear, resultPage, resultPagePath, setResultPagePath }) {
  const location = useLocation().pathname;
  const validPaths = ['/race-results', '/constructor-standings', '/driver-standings'];
  const validF1APaths = useMemo(() => [
    '/f1a/race-results',
    '/f1a/constructor-standings',
    '/f1a/driver-standings', 
    '/race-f1a/',
  ], []);
  const validF2Paths = useMemo(() => [
    '/f2/race-results',
    '/f2/constructor-standings',
    '/f2/driver-standings', 
    '/race-f2/'
  ], []);

  const isF1a = validF1APaths.includes(location) || location.startsWith('/race-f1a/')
  const isF2 = validF2Paths.includes(location) || location.startsWith('/race-f2/')

  useEffect(() => {
    // Always clean up first
    document.body.classList.remove('bg-gradient-f1a', 'bg-gradient-f2', 'bg-gradient');

    if (isF1a) {
      document.body.classList.add('bg-gradient-f1a');
    } else if (isF2) {
      document.body.classList.add('bg-gradient-f2');
    } else {
      document.body.classList.add('bg-gradient'); // fallback for normal F1 pages
    }

    return () => {
      document.body.classList.remove('bg-gradient-f1a', 'bg-gradient-f2', 'bg-gradient');
    };
  }, [location]);

  usePageTracking();
  useScrollTracking();

  return (
    <div className="h-full grow">
      {validPaths.includes(location) && (
        <ResultsSelector 
          className="mt-[12.4rem] relative z-[100]" 
          setSelectedYear={setSelectedYear} 
          selectedYear={selectedYear} 
          resultPage={resultPage} 
          resultPagePath={resultPagePath}
          championshipLevel={isF1a ? 'F1A' : isF2 ? 'F2' : undefined}
        />
      )}
      {(isF1a || isF2 ) && (
        <div className="mt-[12.4rem] relative z-[100]">
          {isF1a && (
            <F1ALogo height={48} className="mx-auto mb-16" />
          )}
          {isF2 && (
            <F2Logo height={48} className="mx-auto mb-16" />
          )}
          <ResultsSelector 
            setSelectedYear={setSelectedYear} 
            selectedYear={selectedYear} 
              resultPage={resultPage} 
              resultPagePath={resultPagePath} 
              championshipLevel={isF1a ? 'F1A' : 'F2'}
          />
        </div>
      )}

      <Routes>
        <Route exact path="/" element={<LandingPage2025 setResultPagePath={setResultPagePath} />} />
        <Route path="/race-results" element={<RaceResultsPage selectedYear={selectedYear} />} />
        <Route path="/constructor-standings" element={<ConstructorStandings selectedYear={selectedYear} />} />
        <Route path="/driver-standings" element={<DriverStandings selectedYear={selectedYear} />} />
        <Route path="/teammates-comparison/:urlYear?/:urlTeam?" element={<TeammatesComparison />}/>
        <Route path="/driver-comparison/:urlDriver1?/:urlDriver2?" element={<DriverComparison selectedYear={selectedYear} />} />
        <Route path="/race/:raceId" element={<RacePage />} />
        <Route path="/ar-viewer" element={<ARViewer />} />
        {/* F1A Routes */}
        <Route path="/f1a/race-results" element={<RaceResultsPageF1a selectedYear={selectedYear} championshipLevel="F1A" />} />
        <Route path="/race-f1a/:raceId" element={<RacePageF1a championshipLevel="F1A" />} />
        <Route path="/f1a/driver-standings" element={<DriverStandingsF1a selectedYear={selectedYear} championshipLevel="F1A" />} />
        <Route path="/f1a/constructor-standings" element={<ConstructorStandingsF1a selectedYear={selectedYear} championshipLevel="F1A" />} />
        {/* F2 Routes */}
        <Route path="/f2/race-results" element={<RaceResultsPageF2 selectedYear={selectedYear} championshipLevel="F2" />} />
        <Route path="/race-f2/:raceId" element={<RacePageF2 championshipLevel="F2" />} />
        <Route path="/f2/driver-standings" element={<DriverStandingsF2 selectedYear={selectedYear} championshipLevel="F2" />} />
        <Route path="/f2/constructor-standings" element={<ConstructorStandingsF2 selectedYear={selectedYear} championshipLevel="F2" />} />
      </Routes>
    </div>
  );
}
 
export default App;