export default function PerformanceTracking({ marksData }) {
  return (
    <div>
      <h3>Performance Status</h3>

      {marksData.map(sub => (
        <p key={sub.subject}>
          {sub.subject}:{" "}
          {sub.marks >= 80
            ? "📈 Excellent"
            : sub.marks >= 65
            ? "🟠 Average"
            : "🔴 Needs Improvement"}
        </p>
      ))}
    </div>
  );
}
