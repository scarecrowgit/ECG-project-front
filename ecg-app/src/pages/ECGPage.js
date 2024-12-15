import React from 'react';
import ECGChart from '../components/ECGChart';

const ECGPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ECG Monitoring</h1>
      <ECGChart />
    </div>
  );
};

export default ECGPage;