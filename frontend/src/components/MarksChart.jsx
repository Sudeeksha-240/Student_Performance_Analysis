import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function MarksChart({ marksData }) {
  return (
    <div>
      <h3>Subject-wise Marks</h3>

      <Bar
        data={{
          labels: marksData.map(s => s.subject),
          datasets: [
            {
              label: "Marks",
              data: marksData.map(s => s.marks),
              backgroundColor: "rgba(78,115,223,0.85)"
            }
          ]
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }}
      />
    </div>
  );
}
