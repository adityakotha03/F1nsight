import classNames from 'classnames';
import React from 'react';

export const HeadToHeadChart = ({ headToHeadData, color }) => {
  const FillMath = (d1, d2, driver) => {
    const total = d1 + d2;
    const d1Percent = total > 0 ? (d1 / total) * 100 : 0;
    const d2Percent = total > 0 ? (d2 / total) * 100 : 0;

    if (driver === 'driver1') {
      return `${d1Percent}%`;
    } else {
      return `${d2Percent}%`;
    }
  };

  const StatLine = ( stat, d1Data, d2Data ) => {
    const d1Color = d1Data > d2Data ? color : `${color}40`;
    const d2Color = d2Data > d1Data ? color : `${color}40`;
    
    return (
      <>
        <h6 className="text-center mb-8">{stat}</h6>
        <div className="flex items-center mb-24">
          <div className="flex items-center gap-8 w-1/2">
            <div className="font-display gradient-text-light">{d1Data}</div>
            <div className="grow bg-glow-sm rounded-l-[.8rem] h-32 flex justify-end overflow-hidden">
              <div
                className={classNames("h-full")}
                style={{
                  width: d1Data + d2Data > 0 ? FillMath(d1Data, d2Data, 'driver1') : '0%',
                  backgroundColor: d1Data + d2Data > 0 ? d1Color : 'transparent',
                }}
              />
            </div>
          </div>
          <div className="flex flex-row-reverse items-center gap-8 w-1/2">
            <div className="font-display gradient-text-light">{d2Data}</div>
            <div className="grow bg-glow-sm rounded-r-[.8rem] h-32 flex overflow-hidden">
              <div
                className={classNames("h-full")}
                style={{
                  width: d1Data + d2Data > 0 ? FillMath(d1Data, d2Data, 'driver2') : '0%',
                  backgroundColor: d1Data + d2Data > 0 ? d2Color : 'transparent',
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="mb-64 md:w-1/2 m-auto">
    {StatLine('Qualifying', headToHeadData.driver1QualifyingWins, headToHeadData.driver2QualifyingWins)}
    {StatLine('Race', headToHeadData.driver1RaceWins, headToHeadData.driver2RaceWins)}
    {StatLine('Points', headToHeadData.driver1Points, headToHeadData.driver2Points)}
    {StatLine('Podiums', headToHeadData.driver1Podiums, headToHeadData.driver2Podiums)}
    {StatLine('Poles', headToHeadData.driver1Poles, headToHeadData.driver2Poles)}
    </div>
  );
};

export default HeadToHeadChart;
