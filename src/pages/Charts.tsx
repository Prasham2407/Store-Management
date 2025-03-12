import React from "react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  LineController,
  BarController
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController
);

const mockData = [
  { week: "W01", gmDollars: 140061.78, salesDollars: 239526.34, gmPercent: 58 },
  { week: "W02", gmDollars: 110391.21, salesDollars: 258634.60, gmPercent: 43 },
  { week: "W03", gmDollars: 101657.28, salesDollars: 263774.46, gmPercent: 39 },
  { week: "W04", gmDollars: 134341.07, salesDollars: 332652.41, gmPercent: 40 },
  { week: "W05", gmDollars: 130398.15, salesDollars: 275162.26, gmPercent: 47 },
];

const Charts = () => {
  const labels = mockData.map((d) => d.week);
  const gmDollars = mockData.map((d) => d.gmDollars);
  const gmPercent = mockData.map((d) => d.gmPercent);

  const chartData: ChartData = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: "GM Dollars",
        data: gmDollars,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        yAxisID: "y",
      },
      {
        type: 'line',
        label: "GM %",
        data: gmPercent,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        fill: true,
        yAxisID: "y1",
        tension: 0.4
      },
    ],
  };

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "GM Dollars",
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`
        }
      },
      y1: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "GM %",
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          callback: (value) => `${value}%`
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyColor: '#666',
        bodyFont: {
          size: 12
        },
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const label = context.dataset.label;
            if (label === "GM Dollars") {
              return `${label}: $${value.toLocaleString()}`;
            }
            return `${label}: ${value}%`;
          }
        }
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Analytics Charts</h1>
      <div className="h-[500px]">
        <Chart type='bar' data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Charts;
