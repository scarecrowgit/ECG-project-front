import React, { useEffect, useState, useRef } from 'react';
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
  const [userId, setUserId] = useState(null);
  const [warning, setWarning] = useState(false);
  const chartRef = useRef(null); // Ссылка на экземпляр графика

  const fetchECGData = async () => {
    try {
      const storedUserId = localStorage.getItem('user_id');
      
      if (!storedUserId) {
        setError('Не найден ID пользователя. Пожалуйста, войдите в систему.');
        setLoading(false);
        return;
      }

      setUserId(storedUserId);

      const response = await axiosInstance.get('/api/ecg-data', {
        params: { user_id: storedUserId }
      });

      const sortedData = response.data.data.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );

      const amplifiedData = sortedData.map(point => ({
        ...point,
        ecg_signal: point.ecg_signal
      }));

      const exceedsThreshold = amplifiedData.some(point => point.ecg_signal > 1.3);
      setWarning(exceedsThreshold);

      setEcgData(amplifiedData);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при получении данных ЭКГ:', error);
      setError('Не удалось получить данные ЭКГ. Пожалуйста, попробуйте снова.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchECGData();
    const interval = setInterval(fetchECGData, 5000);
    return () => clearInterval(interval);
  }, []);

  const downloadChart = () => {
    if (chartRef.current) {
      const chartUrl = chartRef.current.toBase64Image(); // Получаем URL изображения в формате base64
      const link = document.createElement('a'); // Создаем временную ссылку
      link.href = chartUrl; // Устанавливаем ссылку на base64 изображение
      link.download = 'ecg_chart.png'; // Устанавливаем имя файла для скачивания
      link.click(); // Программно кликаем по ссылке, чтобы скачать файл
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (loading) {
    return <div className="p-4">Загрузка данных ЭКГ...</div>;
  }

  if (ecgData.length === 0) {
    return <div className="p-4">Нет доступных данных ЭКГ.</div>;
  }

  const chartData = {
    labels: ecgData.map((point) => new Date(point.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Сигнал ЭКГ',
        data: ecgData.map((point) => point.ecg_signal),
        borderColor: 'rgba(255, 0, 0, 1)',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: 'Сигнал ЭКГ',
        font: {
          size: 18
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Время'
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        min: Math.min(...ecgData.map((point) => point.ecg_signal)) - 1,
        max: Math.max(...ecgData.map((point) => point.ecg_signal)) + 1,
        title: {
          display: true,
          text: 'Значение сигнала ЭКГ'
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      {userId && (
        <div className="bg-gray-100 p-2 rounded">
          <span className="font-bold">ID пользователя:</span> {userId}
        </div>
      )}
      {warning && (
        <div className="text-red-500 p-4">
          <strong>Внимание:</strong> Одно из значений сигнала ЭКГ высокое.
          <div className="mt-2">
            <a
              href="tel:112"
              className="bg-red-500 text-white p-2 rounded"
            >
              Позвонить в экстренную службу
            </a>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="h-[500px] w-full">
          <Line ref={chartRef} data={chartData} options={options} />
        </div>
        <button
          onClick={downloadChart}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Скачать график
        </button>
      </div>
    </div>
  );
};

export default ECGChart;