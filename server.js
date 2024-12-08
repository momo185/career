const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const multer = require('multer');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Setup Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    // Ensure the uploads directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + file.originalname.replace(/\s+/g, '_'); // Remove spaces in filenames
    cb(null, uniqueSuffix);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
  }
});

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456", // Update as needed
  database: "career",
  port: '3306'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Promisify the query function for async/await support
const query = promisify(db.query).bind(db);

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Fetch users from the database
app.get('/users', async (req, res) => {
  try {
    const sql = "SELECT * FROM users";
    const data = await query(sql);
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error while fetching users." });
  }
});

// Function to get the institution ID by name
async function getInstitutionId(name) {
  const sqlSelect = "SELECT id FROM institutions WHERE name = ?";
  const [result] = await query(sqlSelect, [name]);
  if (result.length > 0) {
    return result[0].id; // Return the first (and probably only) result
  } else {
    throw new Error('Institution not found');
  }
}

// Fetch institutions from the database
app.get('/institutions', async (req, res) => {
  try {
    const sql = "SELECT * FROM institutions";
    const data = await query(sql);
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error while fetching institutions." });
  }
});

// User Registration
app.post('/register', upload.single('profilePicture'), async (req, res) => {
  const { name, email, password, user_type } = req.body;

  if (!name || !email || !password || !user_type || !req.file) {
    return res.status(400).json({ error: "Please provide name, email, password, user_type, and a profile picture." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sqlCheckEmail = "SELECT * FROM users WHERE email = ?";
  const sqlInsert = "INSERT INTO users (name, email, password, user_type, profile_picture) VALUES (?, ?, ?, ?, ?)";

  try {
    // Check if the email already exists
    const existingUser = await query(sqlCheckEmail, [email]);

    if (existingUser.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    // Normalize the file path (replace backslashes with forward slashes)
    const profilePicturePath = req.file.path.replace("\\", "/");

    console.log("SQL Query:", sqlInsert);
    console.log("Parameters:", [name, email, hashedPassword, user_type, profilePicturePath]);

    // Insert the user data into the database
    await query(sqlInsert, [name, email, hashedPassword, user_type, profilePicturePath]);

    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ error: "Database error during registration." });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide both email and password." });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  try {
    const data = await query(sql, [email]);
    if (data.length > 0) {
      const user = data[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return res.status(200).json({
          message: "Login successful",
          user: {
            id: user.id,
            user_type: user.user_type,
            name: user.name,
            email: user.email,
            profile_picture: user.profile_picture
          }
        });
      } else {
        return res.status(401).json({ error: "Invalid email or password." });
      }
    } else {
      return res.status(401).json({ error: "Invalid email or password." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database query error." });
  }
});

// Add a new institution
app.post('/institutions', upload.single('logo'), async (req, res) => {
  const { name, number_of_students, number_of_departments, number_of_courses } = req.body;

  // Validation check
  if (!name || !number_of_students || !number_of_departments || !number_of_courses || !req.file) {
    return res.status(400).json({ error: "Please provide all required fields and a logo." });
  }

  // Normalize the file path (replace backslashes with forward slashes)
  const logoPath = req.file.path.replace("\\", "/");

  const sql = "INSERT INTO institutions (name, number_of_students, number_of_departments, number_of_courses, logo) VALUES (?, ?, ?, ?, ?)";

  try {
    const result = await query(sql, [name, number_of_students, number_of_departments, number_of_courses, logoPath]);

    if (result.affectedRows > 0) {
      return res.status(201).json({
        message: "Institution added successfully.",
        institution: {
          id: result.insertId,
          name: name,
          number_of_students: number_of_students,
          number_of_departments: number_of_departments,
          number_of_courses: number_of_courses,
          logo: logoPath
        }
      });
    } else {
      return res.status(500).json({ error: "Failed to add institution." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error during adding institution." });
  }
});

// Fetch universities
app.get('/universities', async (req, res) => {
  const sql = "SELECT id, name, number_of_students, number_of_departments, number_of_courses, logo FROM institutions";
  try {
    const results = await query(sql);
    res.json(results);
  } catch (err) {
    console.error('Error fetching universities:', err);
    return res.status(500).json({ error: "Database error while fetching universities." });
  }
});

// Default route to check server status
app.get('/', (req, res) => {
  return res.json('Server is running.');
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
