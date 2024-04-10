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
    Legend, } from 'recharts';

export const TireStrategy = (props) => {
    const { drivers } = props;

    const newTireData = drivers.map(driver => ({
        acronym: driver.acronym, 
        tires: driver.tires
    }));

    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
    ];
      
      
    return (
        <div style={{ width: '100%', height: 1000 }} className="mb-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
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
                <YAxis dataKey="name" type="category" />
                <Tooltip />

                {/* couldnt figure out how to correctly map through something like newTireData.tires above to get a new bar for each tire change */}
                <Bar dataKey="pv" stackId="a" fill="#8884d8" />
                <Bar dataKey="uv" stackId="a" fill="#82ca9d" />

                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
    );
};

TireStrategy.propTypes = {
    className: PropTypes.string,
    drivers: PropTypes.object
};