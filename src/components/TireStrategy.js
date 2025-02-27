import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer, Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, LabelList
} from 'recharts';

export const TireStrategy = (props) => {
  const { drivers, raceResults, driverCode, driverColor } = props; // Adding driverCode to props

  const sortedDriverAcronyms = raceResults
    .sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10))
    .map(result => result.Driver.code);

    const transformedData = drivers.map(driver => {
      const driverData = { acronym: driver.acronym };
      let previousLapEnd = 0;
    
      driver.tires.forEach((tire, index) => {
        // console.log('tire', tire);
        const lapEndValue = index === 0 ? tire.lap_end : tire.lap_end - previousLapEnd;
        const compoundKey = tire.compound ? tire.compound.toLowerCase() : "N/A";
        driverData[`${compoundKey}${index}`] = lapEndValue;
        previousLapEnd = tire.lap_end;
      });
    
      return driverData;
    });

  // Filter the transformed data based on the driverCode if it's not null
  const filteredTransformedData = driverCode
    ? transformedData.filter(driverData => driverData.acronym === driverCode)
    : transformedData;

  // Sort the filtered data based on the sorted driver acronyms
  const sortedTransformedData = sortedDriverAcronyms.map(acronym => {
    return filteredTransformedData.find(driverData => driverData.acronym === acronym);
  }).filter(driverData => driverData !== undefined);

  const tireTypeClasses = {
    soft: '#e11d48', 
    medium: '#fbbf24', 
    hard: '#ffffff',
    intermediate: '#16a34a', 
    wet: '#2563eb' 
  };

  const tireKeys = [
    ...new Set(sortedTransformedData.flatMap(Object.keys).filter(key => key !== 'acronym')),
  ];

  // console.log('tireKeys', sortedTransformedData);

    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p className="font-display">{label}</p>
            <hr className="mb-4 mt-4"/>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: tireTypeClasses[entry.name.replace(/[0-9]/g, '')] }}>
                {capitalizeFirstLetter(entry.name.replace(/[0-9]/g, ''))}: {entry.value}
              </p>
            ))}
          </div>
        );
      }
    
      return null;
    }; 

    return (
        <>
        <h3 className="heading-4 mb-16 mt-32 text-neutral-400 ml-24">Tyre Strategy</h3>
        <div className="bg-glow-large h-fit max-sm:py-32 sm:p-32 mb-16 relative rounded-md sm:rounded-xlarge">
          <ResponsiveContainer width="100%" height={driverCode ? 100 :  700}>
            <BarChart
              data={sortedTransformedData}
              width="100%"
              layout="vertical"
              margin={{ right: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" width="100%" />
              <XAxis type="number" />
              <YAxis dataKey="acronym" type="category" interval={0}/>
              <Tooltip content={<CustomTooltip />} />
              {/*<Legend />*/}
              {tireKeys
              .sort((a, b) => {
                const aNum = parseInt(a.match(/\d+$/)[0], 10);
                const bNum = parseInt(b.match(/\d+$/)[0], 10);
                return aNum - bNum;
              })
              .map((key) => (
                <>
                  <filter id={`inset-shadow-${key.replace(/[0-9]/g, '')}`}>
                    <feOffset
                      dx='0'
                      dy='0'
                    />
                    <feGaussianBlur
                      stdDeviation='5'
                      result='offset-blur'
                    />
                    <feComposite
                      operator='out'
                      in='SourceGraphic'
                      in2='offset-blur'
                      result='inverse'
                    />
                    <feFlood
                      floodColor={tireTypeClasses[key.replace(/[0-9]/g, '')]}
                      floodOpacity='.1'
                      result='color'
                    />
                    <feComposite
                      operator='in'
                      in='color'
                      in2='inverse'
                      result='shadow'
                    />
                    <feComposite
                      operator='over'
                      in='shadow'
                      in2='SourceGraphic'
                    />
                  </filter>
                  <Bar
                    className={`tire-compound tire-compound--${key.replace(/[0-9]/g, '')}`}
                    dataKey={key}
                    key={key}
                    stackId="a"
                    stroke={tireTypeClasses[key.replace(/[0-9]/g, '')]}
                  >
                      <LabelList dataKey={key} position="center" fill={tireTypeClasses[key.replace(/[0-9]/g, '')]} />
                  </Bar>
                </>
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div 
            className="radial-gradient radial-gradient--top-left"
            style={{background: driverCode && `radial-gradient(circle at center, #${driverColor} 0%, #${driverColor}00 70%)`}} 
          />
          <div 
            className="radial-gradient radial-gradient--top-right"
            style={{background: driverCode && `radial-gradient(circle at center, #${driverColor} 0%, #${driverColor}00 70%)`}} 
          />
        </div>
        </>
      );
    };

TireStrategy.propTypes = {
    className: PropTypes.string,
    driverColor: PropTypes.string,
    drivers: PropTypes.array
};