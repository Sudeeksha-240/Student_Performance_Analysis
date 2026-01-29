import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

import { semesterData } from "../data/semesterData";

function SemesterChart() {
  return (
    <div style={{ width: "700px" }}>
      <h3 style={{ marginBottom: "15px" }}>
        Semester-wise CGPA Trend
      </h3>

      <Line
        data={{
          labels: semesterData.map(item => item.semester),
          datasets: [
            {
              label: "CGPA",
              data: semesterData.map(item => item.cgpa),
              borderColor: "#4e73df",
              backgroundColor: "rgba(78,115,223,0.2)",
              tension: 0.4,
              fill: true,
              pointRadius: 5
            }
          ]
        }}
        options={{
          scales: {
            y: {
              min: 6,
              max: 10
            }
          }
        }}
      />
    </div>
  );
}

export default SemesterChart;
