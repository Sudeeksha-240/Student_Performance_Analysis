const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

/* ============================
   JWT CONFIG
============================ */
const JWT_SECRET = "student_dashboard_secret";

/* ============================
   DATABASE
============================ */
const db = mysql.createConnection({
  host: "localhost",
  user: "sudeeksha",
  password: "MyStrongPassword123",
  database: "student_dashboard"
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL error:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});

/* ============================
   JWT VERIFY MIDDLEWARE
============================ */
function verifyToken(req, res, next) {
  const header = req.headers["authorization"];

  if (!header)
    return res.status(403).json({ message: "No token" });

  const token = header.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
}

/* ============================
   AUTH — SIGNUP
============================ */
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    err => {
      if (err)
        return res.status(400).json({ message: "User already exists" });

      res.json({ message: "Signup successful" });
    }
  );
});

/* ============================
   AUTH — LOGIN
============================ */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, rows) => {
      if (err || rows.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      const user = rows[0];

      const valid = await bcrypt.compare(password, user.password);
      if (!valid)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token,
        name: user.name,
        email: user.email,
        id: user.id
      });
    }
  );
});

/* ============================
   GET STUDENTS (User-specific)
============================ */
app.get("/students", verifyToken, (req, res) => {
  db.query(
    "SELECT DISTINCT student_name FROM semester_marks WHERE user_id=?",
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows.map(r => r.student_name));
    }
  );
});

/* ============================
   GET SEMESTERS (User-specific)
============================ */
app.get("/semesters/:student", verifyToken, (req, res) => {
  db.query(
    "SELECT DISTINCT semester FROM semester_marks WHERE user_id=? AND student_name=?",
    [req.user.id, req.params.student],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows.map(r => r.semester));
    }
  );
});

/* ============================
   GET MARKS (User-specific)
============================ */
app.get("/marks/:student/:semester", verifyToken, (req, res) => {
  db.query(
    "SELECT * FROM semester_marks WHERE user_id=? AND student_name=? AND semester=?",
    [req.user.id, req.params.student, req.params.semester],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* ============================
   CREATE STUDENT (User-specific)
============================ */
app.post("/students", verifyToken, (req, res) => {
  const { student_name } = req.body;
  if (!student_name)
    return res.status(400).json({ error: "Student name required" });

  res.json({ message: "Student created" });
});

/* ============================
   ADD SUBJECT (User-specific)
============================ */
app.post("/marks", verifyToken, (req, res) => {
  const { student_name, semester, subject, marks, credits } = req.body;

  if (!student_name || !semester || !subject)
    return res.status(400).json({ error: "Missing fields" });

  db.query(
    `INSERT INTO semester_marks
     (user_id, student_name, semester, subject, marks, credits)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, student_name, semester, subject, marks, credits],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Inserted" });
    }
  );
});

/* ============================
   DELETE RECORD (User-specific)
============================ */
app.delete("/record/:id", verifyToken, (req, res) => {
  db.query(
    "DELETE FROM semester_marks WHERE id=? AND user_id=?",
    [req.params.id, req.user.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
});

/* ============================
   DELETE SEMESTER (User-specific)
============================ */
app.delete("/semester/:student/:semester", verifyToken, (req, res) => {
  db.query(
    "DELETE FROM semester_marks WHERE user_id=? AND student_name=? AND semester=?",
    [req.user.id, req.params.student, req.params.semester],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Semester deleted" });
    }
  );
});

/* ============================
   DELETE STUDENT (User-specific)
============================ */
app.delete("/student/:student", verifyToken, (req, res) => {
  db.query(
    "DELETE FROM semester_marks WHERE user_id=? AND student_name=?",
    [req.user.id, req.params.student],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Student deleted" });
    }
  );
});

app.listen(5000, () => {
  console.log("🚀 Backend running at http://localhost:5000");
});
