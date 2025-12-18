import React from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const Chart = ({ type, data, options, onClick }) => {
  const defaultOptions = {
    animation:
      type === "bar"
        ? {
            y: {
              from: 0,
              duration: 1000,
              easing: "easeOutQuart",
            },
          }
        : {},
    responsive: true,
    maintainAspectRatio: false,
  };

  const chartOptions = {
    ...defaultOptions,
    ...options,
    onClick: onClick,
  };

  if (type === "bar") {
    return <Bar data={data} options={chartOptions} height={300} width={400} />;
  } else if (type === "pie") {
    return <Pie data={data} options={chartOptions} height={300} width={400} />;
  } else if (type === "line") {
    return <Line data={data} options={chartOptions} height={300} width={400} />;
  } else if (type === "doughnut") {
    return (
      <Doughnut data={data} options={chartOptions} height={300} width={400} />
    );
  }
  return null;
};

export default Chart;
