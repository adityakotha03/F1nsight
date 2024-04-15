import React from 'react';
import PropTypes from 'prop-types';
import { 
    ResponsiveContainer,
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend, LabelList } from 'recharts';

export const TireStrategy = (props) => {
    const { drivers, raceResults } = props;

    const sortedDriverAcronyms = raceResults
    .sort((a, b) => parseInt(a.position, 10) - parseInt(b.position, 10))
    .map(result => result.Driver.code);

    const transformedData = drivers.map(driver => {
        const driverData = { acronym: driver.acronym };
        let previousLapEnd = 0;
        
        driver.tires.forEach((tire, index) => {
          // For the first tire, use tire.lap_end as is.
          // For subsequent tires, subtract the previous tire's lap_end value.
          const lapEndValue = index === 0 ? tire.lap_end : tire.lap_end - previousLapEnd;
          driverData[`${tire.compound.toLowerCase()}${index}`] = lapEndValue;
          
          // Update previousLapEnd for the next iteration
          previousLapEnd = tire.lap_end; 
        });
        return driverData;
      });

    // Sort the transformed data based on the sorted driver acronyms
    const sortedTransformedData = sortedDriverAcronyms.map(acronym => {
      return transformedData.find(driverData => driverData.acronym === acronym);
    }).filter(driverData => driverData !== undefined);

    const tireTypeClasses = {
        soft: '#c00000', 
        medium: '#ffd600', 
        hard: '#ffffff',
        intermediate: '#39b54a', 
        wet: '#00aeef' 
      };      

    // Get unique tire keys from transformed data (excluding 'acronym')
    const tireKeys = [
        ...new Set(sortedTransformedData.flatMap(Object.keys).filter(key => key !== 'acronym')),
    ];

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const formattedLabel = label.replace(/[0-9]/g, '');
        return (
          <div className="custom-tooltip" style={{ backgroundColor: '#000000', borderColor: '#000000', padding: '10px' }}>
            <p>{formattedLabel}</p>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }}>
                {entry.name.replace(/[0-9]/g, '')}: {entry.value}
              </p>
            ))}
          </div>
        );
      }
    
      return null;
    }; 

    return (
        <div style={{ width: '100%', height: 700 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedTransformedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
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
                      stdDeviation='3'
                      result='offset-blur'
                    />
                    <feComposite
                      operator='out'
                      in='SourceGraphic'
                      in2='offset-blur'
                      result='inverse'
                    />
                    <feFlood
                      flood-color={tireTypeClasses[key.replace(/[0-9]/g, '')]}
                      flood-opacity='.15'
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
                      <LabelList dataKey={key} position="center" fill="#f1f1f1" />
                  </Bar>
                </>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    };

TireStrategy.propTypes = {
    className: PropTypes.string,
    drivers: PropTypes.object
};