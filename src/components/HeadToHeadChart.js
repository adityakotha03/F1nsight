import classNames from 'classnames';
import React from 'react';

export const HeadToHeadChart = ({ headToHeadData, color }) => {
  const FillMath = (d1, d2, driver) => {
    const total = d1 + d2;
    const d1Percent = (d1 / total) * 100;
    const d2Percent = (d2 / total) * 100;

    if (driver === 'driver1') {
      return `${d1Percent}%`;
    } else {
      return `${d2Percent}%`;
    }
  };

  const lightenColor = (hex, percent) => {
    let color = hex.startsWith('#') ? hex.slice(1) : hex;
    let num = parseInt(color, 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;

    return '#' + (
        0x1000000 +
        (R < 255 ? R : 255) * 0x10000 +
        (G < 255 ? G : 255) * 0x100 +
        (B < 255 ? B : 255)
    ).toString(16).slice(1);
  };

  const darkColor = lightenColor(color, 50);

  const StatLine = ( stat, d1Data, d2Data ) => {
    const d1Color = d1Data > d2Data ? color : darkColor;
    const d2Color = d2Data > d1Data ? color : darkColor;
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
    {StatLine('Qualifying Wins', headToHeadData.driver1QualifyingWins, headToHeadData.driver2QualifyingWins)}
    {StatLine('Race Wins', headToHeadData.driver1RaceWins, headToHeadData.driver2RaceWins)}
    {StatLine('Points', headToHeadData.driver1Points, headToHeadData.driver2Points)}
    {StatLine('Podiums', headToHeadData.driver1Podiums, headToHeadData.driver2Podiums)}
    {StatLine('Poles', headToHeadData.driver1Poles, headToHeadData.driver2Poles)}
    </div>
  );
};

export default HeadToHeadChart;
