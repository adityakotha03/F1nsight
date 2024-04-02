import React from 'react';
import { useLocation } from 'react-router-dom';

function RacePage() {
  const { state } = useLocation();
  const { raceName, meetingKey, year } = state || {};

  return (
    <div>
      <h2>Race Details</h2>
      {raceName && <p>Race Name: {raceName}</p>}
      {meetingKey && <p>Meeting Key: {meetingKey}</p>}
      {year && <p>Year: {year}</p>}
    </div>
  );
}

export default RacePage;