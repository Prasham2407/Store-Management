import React from "react";
import { Bar } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
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

  const chartData: ChartData<"bar"> = {
    labels: ["W01", "W02", "W03", "W04", "W05"], // Add all weeks
    datasets: [
      {
        label: "GM Dollars",
        data: [140061.78, 110391.21, 101657.28, 134341.07, 130398.15], // Add all values
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        yAxisID: "y", // Maps to primary Y-axis
      },
      {
        label: "GM %",
        data: [58, 43, 39, 40, 47], // Add all GM % values
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: false,
        type: "line", // Specifies line chart
        yAxisID: "y1", // Maps to secondary Y-axis
      },
    ],
  };
  

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "GM Dollars",
        },
      },
      y1: {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "GM %",
        },
        grid: {
          drawOnChartArea: false, // Avoid grid overlap
        },
      },
    },
    plugins: {
      legend: {
        position: "top", // Must be "top", "left", "right", or "bottom"
      },
    },
  };
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Charts</h1>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default Charts;
