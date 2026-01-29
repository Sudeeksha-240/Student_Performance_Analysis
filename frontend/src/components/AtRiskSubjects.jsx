export default function AtRiskSubjects({ marksData }) {

  function risk(marks) {
    if (marks < 65) return "High Risk 🔴";
    if (marks < 75) return "Medium Risk 🟠";
    return "Safe 🟢";
  }

  return (
    <div>
      <h3>At-Risk Subjects</h3>

      {marksData.map(sub => (
        <p key={sub.subject}>
          {sub.subject} — {risk(sub.marks)}
        </p>
      ))}
    </div>
  );
}
