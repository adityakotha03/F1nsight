import React, { useEffect, useState, useRef } from 'react';
import '@google/model-viewer/';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { darkenColor } from '../utils/darkenColor';

import './ARViewer.scss';

export const ARViewer = () => {

  const [glbLink, setGlbLink] = useState(ARViewer.defaultProps.glbLink);
  const [team, setTeam] = useState(ARViewer.defaultProps.team);
  const [teamStatsOpen, setTeamStatsOpen] = useState(false);
  const [statsHeight, setStatsHeight] = useState(0);

  const [isGLBLoading, setIsGLBLoading] = useState(true);
  const modelViewerRef = useRef(null);

  const ref = useRef(null);

  const showHistroy = team.name !== "F1Nsight" && team.name !== "apx"
  
  const teams = {
    mercedes: {
      name: 'mercedes',
      color: '#27F4D2',
      constructorTitles: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'],
      driversChampionships: ['1954', '1955', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
      teamExistedSince: '1954-1955, 2010 - present',
      teamHistory: [],
      raceVictories: 111,
      podiums: 11,
      polePositions: 1,
    },
    ferrari: {
      name: 'ferrari',
      color: '#E8002D',
      constructorTitles: ['1961', '1964', '1975', '1976', '1977', '1979', '1982', '1983', '1999', '2000', '2001', '2002', '2003', '2004', '2007', '2008'],
      driversChampionships: ['1952', '1953', '1956', '1958', '1961', '1964', '1975', '1977', '1979', '2000', '2001', '2002', '2003', '2004', '2007'],
      teamExistedSince: '1950',
      teamHistory: [],
      raceVictories: 245,
      podiums: 815,
      polePositions: 251,
    },
    redbull: {
      name: 'red_bull',
      color: '#3671C6',
      constructorTitles: ['2014'],
      driversChampionships: ['2014'],
      teamExistedSince: 1111,
      teamHistory: [],
      raceVictories: 111,
      podiums: 11,
      polePositions: 1,
    },
    mclaren: {
      name: 'mclaren',
      color: '#FF8000',
      constructorTitles: ['1974', '1984', '1985', '1988', '1989', '1990', '1991', '1998'],
      driversChampionships: ['1974', '1976', '1984', '1985', '1986', '1988', '1989', '1990', '1991', '1998', '1999', '2008'],
      teamExistedSince: '1966',
      teamHistory: [],
      raceVictories: 111,
      podiums: 11,
      polePositions: 1,
    },
    astonmartin: {
      name: 'aston_martin',
      color: '#229971',
      constructorTitles: ['2014'],
      driversChampionships: ['2014'],
      teamExistedSince: 1111,
      teamHistory: [],
      raceVictories: 111,
      podiums: 11,
      polePositions: 1,
    },
    rb: {
      name: 'rb',
      color: '#6692FF',
      constructorTitles: ['2014'],
      driversChampionships: ['2014'],
      teamExistedSince: 1111,
      teamHistory: [],
      raceVictories: 111,
      podiums: 11,
      polePositions: 1,
    },
    alpine: {
      name: 'alpine',
      color: '#FF87BC',
      constructorTitles: ['1995', '2005', '2006'],
      driversChampionships: ['1994', '1995', '2005', '2006'],
      teamExistedSince: 2021,
      teamHistory: ['Alpine (since 2021)', 'Renault (2016 - 2020)', 'Lotus (2012 - 2016)', 'Renault (2002 - 2011)', 'Benetton (1986 - 2001)', 'Toleman (1981 - 1985)'],
      raceVictories: 111,
      podiums: 11,
      polePositions: 1,
    },
    sauber: {
      name: 'sauber',
      color: '#52E252',
      constructorTitles: ['1995', '2005', '2006'],
      driversChampionships: ['1994', '1995', '2005', '2006'],
      teamExistedSince: 1111,
      teamHistory: [],
      raceVictories: 111,
      podiums: 11,
      polePositions: 1,
    },
    haas: {
      name: 'haas',
      color: '#B6BABD',
      constructorTitles: [],
      driversChampionships: [],
      teamExistedSince: '2016',
      teamHistory: [],
      raceVictories: 111,
      podiums: 11,
      polePositions: 1,
    },
    williams: {
      name: 'williams',
      color: '#64C4FF',
      constructorTitles: ['1980', '1981', '1986', '1987', '1992', '1993', '1994', '1996', '1997'],
      driversChampionships: ['1980', '1982', '1987', '1992', '1993', '1996', '1997'],
      teamExistedSince: '1977',
      teamHistory: [],
      raceVictories: 111,
      podiums: 11,
      polePositions: 1,
    }
  };

  const teamList = Object.values(teams);
  const teamName = team.name.replace(/_/g, ' ')

  console.log('team', team)

  useEffect(() => {
    showHistroy && setStatsHeight(ref.current.clientHeight);
  }, [showHistroy]);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;

    const onProgress = (event) => {
      const progressBar = event.target.querySelector('.progress-bar');
      const updatingBar = event.target.querySelector('.update-bar');

      updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
      if (event.detail.totalProgress === 1) {
        progressBar.classList.add('hide');
        event.target.removeEventListener('progress', onProgress);
      } else {
        progressBar.classList.remove('hide');
      }
    };

    const handleModelLoad = () => {
      setIsGLBLoading(false);
    };

    if (modelViewer) {
      modelViewer.addEventListener('progress', onProgress);
      modelViewer.addEventListener('load', handleModelLoad);
    }

    return () => {
      if (modelViewer) {
        modelViewer.removeEventListener('progress', onProgress);
        modelViewer.removeEventListener('load', handleModelLoad);
      }
    };
  }, [glbLink]); // Depend on glbLink to re-run the effect when it changes

  useEffect(() => {
    // Reset loading state when `glbLink` changes
    setIsGLBLoading(true);
  }, [glbLink]);

  return (
    <>
    <div className="ar-container">
      <div className="model-viewer-wrapper">
        {/* {isGLBLoading && <div className="loading-overlay">Loading...</div>} */}
        <model-viewer
          ref={modelViewerRef}
          poster={ARViewer.defaultProps.img}
          src={glbLink}
          ar-modes={ARViewer.defaultProps.arModes}
          ar={ARViewer.defaultProps.ar}
          ar-scale={ARViewer.defaultProps.arScale}
          camera-controls={ARViewer.defaultProps.cameraControls}
          exposure={ARViewer.defaultProps.exposure}
          loading={ARViewer.defaultProps.loading}
          shadow-intensity={ARViewer.defaultProps.shadowIntensity}
          shadow-softness={ARViewer.defaultProps.shadowSoftness}
          alt={ARViewer.defaultProps.alt}
        >
          <div class="progress-bar" slot="progress-bar">
              <div class="update-bar" />
          </div>

          <button
            slot="ar-button"
            className="ar-button"
          >
            <img src={ARViewer.defaultProps.buttonIcon} alt="AR icon" />
            Launch AR
          </button>
        </model-viewer>

        <div className="ar-badge">
          <span>AR Enabled</span>
        </div>

        {/* Team History */}
        {(team.name !== "F1Nsight" && team.name !== "apx") && (
          <div 
            className={classNames(
              "ar-history shadow-md pt-8 px-32 rounded-t-lg w-[90%]",
              "transition-all ease-in-out duration-500",
              "absolute left-1/2 translate-x-[-50%]",
            )}
            style={{
              borderTop: `1px solid ${team.color}`,
              transform: `translate(-50%, ${teamStatsOpen ? 0 : statsHeight}px)`,
            }}
          >
            <button className="mb-8" onClick={() => setTeamStatsOpen(!teamStatsOpen)}>
              <span className="font-display">{teamName} History</span>
              <FontAwesomeIcon 
                icon="chevron-down" 
                className={classNames(
                  "ml-16 fa-1x transition-all ease-in-out delay-75 duration-500", 
                  {"fa-rotate-180" : teamStatsOpen}
                )} 
              />
            </button>
            
            <div className="team-stats flex flex-col gap-4 text-left" ref={ref}>
              <div className="divider-glow-dark w-full" />
              <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between mb-8">
                <div className="text-center">
                    <div className="uppercase tracking-xs text-xs">
                      Constructor Titles
                    </div>
                    <div className="font-display">
                      {team.constructorTitles.length}
                    </div>
                </div>
                <div className="text-center">
                    <div className="uppercase tracking-xs text-xs">
                      Drivers Championships
                    </div>
                    <div className="font-display">
                      {team.driversChampionships.length}
                    </div>
                </div>
                <div className="text-center">
                    <div className="uppercase tracking-xs text-xs">
                      Team Existance
                    </div>
                    <div className="font-display">
                      {team.teamExistedSince}
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* todo: redo this if possible */}
      <style jsx="true">{`
        model-viewer {
          background-color: ${team.color};
          background: radial-gradient(circle, ${team.color} 0%, ${darkenColor(team.color, 40)} 80%);
        }
        model-viewer::before {
          content: '${teamName}';
        }
      `}</style>
    </div>

    {/* Team Buttons */}
    <div className="mt-64 flex flex-row justify-center flex-wrap gap-16 p-32">
      {teamList.map((team, index) => {
        return (
          <button
            key={index}
            style={{ backgroundColor: team.color }}
            className={classNames('text-white p-2 rounded inline-flex flex-col items-center text-center bg-glow-dark mt-16 max-md:w-[45%]')}
            onClick={() => {
              setGlbLink(`${process.env.PUBLIC_URL + "/ArFiles/glbs/" + team.name + ".glb"}`);
              setTeam(team)
            }}
          >
            <img src={`${process.env.PUBLIC_URL + "/images/2024/cars/" + team.name + ".png"}`} alt={team.name} className='w-[10rem] -mt-16' />
            <p className="font-display">{team.name.replace(/_/g, ' ')}</p>
          </button>
        );
      })}
    </div>

    <h2 className="tracking-wide text-center gradient-text-light">Special edition</h2>

    <div className="flex flex-row justify-center flex-wrap gap-16 p-32">
      <button
        style={{ backgroundColor: "#AE7D0E" }}
        className={classNames('text-white p-2 rounded inline-flex flex-col items-center text-center bg-glow-dark mt-16 max-md:w-[45%]')}
        onClick={() => {
          setGlbLink(`${process.env.PUBLIC_URL + "/ArFiles/glbs/apx.glb"}`);
          setTeam({
            name: 'apx',
            color: '#AE7D0E',
          })
        }}
      >
        <img src={`${process.env.PUBLIC_URL + "/images/2024/cars/apx.png"}`} alt={team.name} className='w-[10rem] -mt-16' />
        <p className="font-display">APX</p>
      </button>
      <button
        style={{ backgroundColor: "#7500AD" }}
        className={classNames('text-white p-2 rounded inline-flex flex-col items-center text-center bg-glow-dark mt-16 max-md:w-[45%]')}
        onClick={() => {
          setGlbLink(`${process.env.PUBLIC_URL + "/ArFiles/glbs/f1nsight2024.glb"}`);
          setTeam({
            name: 'F1Nsight',
            color: '#7500AD',
          })
        }}
      >
        <img src={`${process.env.PUBLIC_URL + "/images/2024/cars/F1Nsight.png"}`} alt={team.name} className='w-[10rem] -mt-16' />
        <p className="font-display">F1NSIGHT 2024</p>
      </button>
    </div>
  </>
  );
};

export default ARViewer;

ARViewer.defaultProps = {
  glbLink: `${process.env.PUBLIC_URL + "/ArFiles/glbs/f1nsight2024.glb"}`,
  team: {
    name: 'F1Nsight',
    color: '#7500AD',
    constructorTitles: ['2024'],
    driversChampionships: ['2024'],
    teamExistedSince: 2024,
    teamHistory: [],
    raceVictories: 1,
    podiums: 1,
    polePositions: 1,
  },
  img: `${process.env.PUBLIC_URL + "/ArFiles/poster.webp"}`,
  buttonIcon: `${process.env.PUBLIC_URL + "/APX/3diconWhite.png"}`,
  loading: 'auto',
  reveal: 'auto',
  autoRotate: true,
  cameraControls: true,
  shadowIntensity: '1',
  shadowSoftness: '1',
  environmentImage: 'neutral',
  skyboxImage: null,
  exposure: '1',
  ar: true,
  arModes: 'scene-viewer webxr quick-look',
  arScale: 'auto',
  arPlacement: 'floor',
  alt: 'APX GP Model',
};