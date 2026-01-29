function gradePoint(marks) {
  const m = Number(marks);

  if (m >= 90) return 10;
  if (m >= 80) return 9;
  if (m >= 70) return 8;
  if (m >= 60) return 7;
  if (m >= 50) return 6;
  return 0;
}

export default function CGPA({ marksData }) {
  let totalCredits = 0;
  let totalPoints = 0;

  marksData.forEach(sub => {
    const gp = gradePoint(sub.marks);
    totalCredits += Number(sub.credits);
    totalPoints += gp * Number(sub.credits);
  });

  if (totalCredits === 0) return <p>0.00</p>;

  const cgpa = totalPoints / totalCredits;

  return <p>{cgpa.toFixed(2)}</p>;
}
