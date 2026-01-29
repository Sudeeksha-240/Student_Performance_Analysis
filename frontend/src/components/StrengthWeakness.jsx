export default function StrengthWeakness({ marksData }) {

  const strengths = marksData.filter(
    s => s.marks >= 85
  );

  const weaknesses = marksData.filter(
    s => s.marks < 70
  );

  return (
    <div>
      <h3 style={{ marginBottom: "15px" }}>
        Strength & Weakness Analysis
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px"
      }}>

        <div>
          <h4 style={{ color: "#1cc88a" }}>✅ Strengths</h4>

          {strengths.length === 0 && (
            <p>No strong subjects yet</p>
          )}

          {strengths.map(item => (
            <p key={item.subject}>
              {item.subject} — {item.marks}
            </p>
          ))}
        </div>

        <div>
          <h4 style={{ color: "#e74a3b" }}>⚠️ Weaknesses</h4>

          {weaknesses.length === 0 && (
            <p>No weak subjects 🎉</p>
          )}

          {weaknesses.map(item => (
            <p key={item.subject}>
              {item.subject} — {item.marks}
            </p>
          ))}
        </div>

      </div>
    </div>
  );
}
