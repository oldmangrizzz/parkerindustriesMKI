import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ModelPerformance: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Response Time (ms)',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  });

  useEffect(() => {
    // Simulated data - replace with actual performance metrics
    const simulatePerformanceData = () => {
      const labels = Array.from({length: 10}, (_, i) => `Query ${i + 1}`);
      const data = Array.from({length: 10}, () => Math.floor(Math.random() * 1000));
      setPerformanceData({
        labels,
        datasets: [
          {
            ...performanceData.datasets[0],
            data
          }
        ]
      });
    };

    simulatePerformanceData();
    const interval = setInterval(simulatePerformanceData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Model Performance</h3>
      <Line data={performanceData} />
    </div>
  );
};

export default ModelPerformance;