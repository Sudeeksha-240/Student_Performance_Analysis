import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MarksChart from "./components/MarksChart";
import CGPA from "./components/CGPA";
import StrengthWeakness from "./components/StrengthWeakness";
import AtRiskSubjects from "./components/AtRiskSubjects";
import PerformanceTracking from "./components/PerformanceTracking";

export default function StudentDashboard({ setToken }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "User";
  const userEmail = localStorage.getItem("email") || "";

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    navigate("/login");
  };

  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [semester, setSemester] = useState("");
  const [marks, setMarks] = useState([]);

  const [newStudent, setNewStudent] = useState("");
  const [newSem, setNewSem] = useState("");
  const [sub, setSub] = useState("");
  const [marksVal, setMarksVal] = useState("");
  const [credits, setCredits] = useState("");

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  });

  /* LOAD STUDENTS */
  useEffect(() => {
    fetch("http://localhost:5000/students", {
      headers: getAuthHeaders()
    })
      .then(r => r.json())
      .then(data => {
        setStudents(data);
        if (data.length) setStudent(data[0]);
      });
  }, []);

  /* LOAD SEMESTERS */
  useEffect(() => {
    if (!student) return;
    fetch(`http://localhost:5000/semesters/${student}`, {
      headers: getAuthHeaders()
    })
      .then(r => r.json())
      .then(data => {
        setSemesters(data);
        if (data.length) setSemester(data[0]);
        else {
          setSemester("");
          setMarks([]);
        }
      });
  }, [student]);

  /* LOAD MARKS */
  useEffect(() => {
    if (!student || !semester) return;
    fetch(`http://localhost:5000/marks/${student}/${semester}`, {
      headers: getAuthHeaders()
    })
      .then(r => r.json())
      .then(setMarks);
  }, [student, semester]);

  /* CREATE STUDENT */
  const createStudent = () => {
    if (!newStudent) return alert("Enter name");

    fetch("http://localhost:5000/students", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ student_name: newStudent })
    }).then(() => {
      setStudents([...students, newStudent]);
      setStudent(newStudent);
      setNewStudent("");
    });
  };

  /* ADD RECORD */
  const addRecord = () => {
    fetch("http://localhost:5000/marks", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        student_name: student,
        semester: newSem,
        subject: sub,
        marks: Number(marksVal),
        credits: Number(credits)
      })
    }).then(() => {
      setNewSem("");
      setSub("");
      setMarksVal("");
      setCredits("");

      // Refetch semesters
      fetch(`http://localhost:5000/semesters/${student}`, {
        headers: getAuthHeaders()
      })
        .then(r => r.json())
        .then(setSemesters);

      // Refetch marks for current semester
      fetch(`http://localhost:5000/marks/${student}/${semester}`, {
        headers: getAuthHeaders()
      })
        .then(r => r.json())
        .then(setMarks);
    });
  };

  const deleteRecord = id => {
    fetch(`http://localhost:5000/record/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    }).then(() => setMarks(marks.filter(m => m.id !== id)));
  };

  const deleteSemester = () => {
    fetch(
      `http://localhost:5000/semester/${student}/${semester}`,
      {
        method: "DELETE",
        headers: getAuthHeaders()
      }
    ).then(() => window.location.reload());
  };

  const deleteStudent = () => {
    fetch(`http://localhost:5000/student/${student}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    }).then(() => window.location.reload());
  };

  const avg =
    marks.length === 0
      ? 0
      : (
          marks.reduce((a, b) => a + b.marks, 0) / marks.length
        ).toFixed(1);

  return (
    <div className="container">
      {/* PROFILE AND LOGOUT */}
      <div className="header-section">
        <div className="profile-info">
          <div className="profile-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="profile-details">
            <h4>{userName}</h4>
            <p>{userEmail}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      <h1>Student Performance Analytics Dashboard</h1>

      {/* CREATE STUDENT */}
      <div className="card">
        <h3>Create Student</h3>
        <input
          value={newStudent}
          onChange={e => setNewStudent(e.target.value)}
          placeholder="Student name"
        />
        <button onClick={createStudent}>Add</button>
      </div>

      {/* SELECT STUDENT */}
      <div className="card">
        <h3>Select Student</h3>
        <select value={student} onChange={e => setStudent(e.target.value)}>
          {students.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button onClick={deleteStudent}>Delete Student</button>
      </div>

      {/* SELECT SEMESTER */}
      <div className="card">
        <h3>Select Semester</h3>
        <select value={semester} onChange={e => setSemester(e.target.value)}>
          {semesters.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button onClick={deleteSemester}>Delete Semester</button>
      </div>

      <div className="kpi">
        <div className="card"><h3>Total Subjects</h3><p>{marks.length}</p></div>
        <div className="card"><h3>Average</h3><p>{avg}%</p></div>
        <div className="card"><h3>CGPA</h3><CGPA marksData={marks} /></div>
      </div>

      <div className="card"><MarksChart marksData={marks} /></div>
      <div className="card"><StrengthWeakness marksData={marks} /></div>
      <div className="card"><AtRiskSubjects marksData={marks} /></div>
      <div className="card"><PerformanceTracking marksData={marks} /></div>

      {/* ADD RECORD */}
      <div className="card">
        <h3>Add Subject</h3>
        <input placeholder="Semester" value={newSem} onChange={e => setNewSem(e.target.value)} />
        <input placeholder="Subject" value={sub} onChange={e => setSub(e.target.value)} />
        <input placeholder="Marks" value={marksVal} onChange={e => setMarksVal(e.target.value)} />
        <input placeholder="Credits" value={credits} onChange={e => setCredits(e.target.value)} />
        <button onClick={addRecord}>Add</button>
      </div>
    </div>
    );
    
}
