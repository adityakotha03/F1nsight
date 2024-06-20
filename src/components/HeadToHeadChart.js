import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

export const HeadToHeadChart = ({ headToHeadData }) => {
  const data = useMemo(() => [
    {
      name: 'Qualifying Wins',
      driver1: headToHeadData.driver1QualifyingWins,
      driver2: headToHeadData.driver2QualifyingWins,
      amb: headToHeadData.ambQ
    },
    {
      name: 'Race Wins',
      driver1: headToHeadData.driver1RaceWins,
      driver2: headToHeadData.driver2RaceWins,
      amb: headToHeadData.ambR
    },
    {
      name: 'Points',
      driver1: headToHeadData.driver1Points,
      driver2: headToHeadData.driver2Points
    },
    {
      name: 'Podiums',
      driver1: headToHeadData.driver1Podiums,
      driver2: headToHeadData.driver2Podiums
    },
    {
      name: 'Poles',
      driver1: headToHeadData.driver1Poles,
      driver2: headToHeadData.driver2Poles
    }
  ], [headToHeadData]);

  return (
    <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" hide={true} />
          <YAxis type="category" dataKey="name" width={150} />
          <Tooltip />
          <Bar dataKey="driver1" fill="#4e73df" barSize={20}>
            <LabelList dataKey="driver1" position="insideLeft" offset={10} fill="#fff" />
          </Bar>
          <Bar dataKey="driver2" fill="#e74a3b" barSize={20}>
            <LabelList dataKey="driver2" position="insideRight" offset={10} fill="#fff" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
  );
};

export default HeadToHeadChart;
