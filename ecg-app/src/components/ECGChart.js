import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axiosInstance from '../axios';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ECGChart = () => {
  const [ecgData, setEcgData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchECGData = async () => {
    try {
      // Retrieve user_id from localStorage
      const userId = localStorage.getItem('user_id');
      
      if (!userId) {
        setError('No user ID found. Please log in.');
        setLoading(false);
        return;
      }

      // Fetch ECG data for the specific user
      const response = await axiosInstance.get('/api/ecg-data', {
        params: { user_id: userId }
      });

      // Sort data by timestamp to ensure chronological order
      const sortedData = response.data.data.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );

      setEcgData(sortedData);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ECG data:', error);
      setError('Failed to fetch ECG data. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    fetchECGData();

    // Set up interval to fetch every 5 seconds
    const interval = setInterval(fetchECGData, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // If there's an error, render error message
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  // Loading state
  if (loading) {
    return <div className="p-4">Loading ECG data...</div>;
  }

  // If no data
  if (ecgData.length === 0) {
    return <div className="p-4">No ECG data available.</div>;
  }

  const chartData = {
    labels: ecgData.map((point) => new Date(point.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'ECG Signal',
        data: ecgData.map((point) => point.ecg_signal),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'ECG Signal',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'ECG Signal Value'
        }
      },
    },
  };

  return (
    <div className="h-96">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ECGChart;