const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
require("dotenv").config();
const { check, validationResult } = require("express-validator");
const cors = require("cors");
const app = express();
const port = 3000;

// Configure MySQL connection
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Establish MySQL connection
mysql
  .createConnection(config)
  .then(() => {
    console.log("Connected to MySQL database");
  })
  .catch((error) => {
    console.error("Error connecting to MySQL:", error);
  });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// API routes
app.post(
  "/api/allUsers",
  [
    check("first_name").notEmpty(),
    check("last_name").notEmpty(),
    check("username").notEmpty(),
    check("email").isEmail(),
    check("mobile").notEmpty(),
    check("gender").notEmpty(),
    check("password").notEmpty(),
    // check("role").notEmpty(),
    // check("is_active").notEmpty().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        first_name,
        last_name,
        username,
        email,
        mobile,
        gender,
        password,
      } = req.body;

      const role = "user";
      const is_active = true;

      const query =
        "INSERT INTO users (first_name, last_name, username, email, mobile, gender, password, role, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

      const connection = await mysql.createConnection(config);
      const [result] = await connection.execute(query, [
        first_name,
        last_name,
        username,
        email,
        mobile,
        gender,
        password,
        role,
        is_active,
      ]);
      const userId = result.insertId;
      connection.end();

      res.json({ message: "User created successfully", userId });
    } catch (error) {
      console.error("Error executing create user query:", error);
      res.status(500).json({ error: "An error occurred during user creation" });
    }
  }
);

app.get("/api/allUsers", async (req, res) => {
  try {
    const query = "SELECT * FROM users";
    const connection = await mysql.createConnection(config);
    const [result] = await connection.execute(query);
    connection.end();

    res.json(result);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
});

app.post(
  "/api/occasionreminderdate",
  [
    check("occasion_name").notEmpty(),
    check("occasion_date").notEmpty(),
    check("user_id").notEmpty().isInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { occasion_name, occasion_date, user_id } = req.body;

      // Check if the user_id exists in the users table
      const userQuery = "SELECT id FROM users WHERE id = ?";
      const connection = await mysql.createConnection(config);
      const [userResult] = await connection.execute(userQuery, [user_id]);

      if (userResult.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const query =
        "INSERT INTO occasionreminderdate (occasion_name, occasion_date, user_id) VALUES (?, ?, ?)";
      const [result] = await connection.execute(query, [
        occasion_name,
        occasion_date,
        user_id,
      ]);
      connection.end();

      res.json({ message: "Occasion reminder added successfully" });
    } catch (error) {
      console.error("Error executing add occasion reminder query:", error);
      res
        .status(500)
        .json({ error: "An error occurred while adding occasion reminder" });
    }
  }
);

app.get("/api/occasionreminderdate", async (req, res) => {
  try {
    const { user_id } = req.query;
    let query = "SELECT * FROM occasionreminderdate";
    if (user_id) {
      query += ` WHERE user_id = ${user_id}`;
    }
    const connection = await mysql.createConnection(config);
    const [result] = await connection.execute(query);
    connection.end();

    res.json(result);
  } catch (error) {
    console.error("Error executing query:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching occasion reminders" });
  }
});

app.put(
  "/api/occasionreminderdate/:id",
  [
    check("occasion_name").notEmpty(),
    check("occasion_date").notEmpty(),
    check("user_id").notEmpty().isInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const occasionId = req.params.id;
      const { occasion_name, occasion_date, user_id } = req.body;

      // Check if the user_id exists in the users table
      const userQuery = "SELECT id FROM users WHERE id = ?";
      const connection = await mysql.createConnection(config);
      const [userResult] = await connection.execute(userQuery, [user_id]);

      if (userResult.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const query =
        "UPDATE occasionreminderdate SET occasion_name = ?, occasion_date = ?, user_id = ? WHERE id = ?";
      const [result] = await connection.execute(query, [
        occasion_name,
        occasion_date,
        user_id,
        occasionId,
      ]);
      connection.end();

      res.json({ message: "Occasion reminder updated successfully" });
    } catch (error) {
      console.error("Error executing update occasion reminder query:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating occasion reminder" });
    }
  }
);

app.delete("/api/occasionreminderdate/:id", async (req, res) => {
  try {
    const occasionId = req.params.id;

    const deleteQuery = "DELETE FROM occasionreminderdate WHERE id = ?";
    const connection = await mysql.createConnection(config);
    await connection.execute(deleteQuery, [occasionId]);
    connection.end();

    res.json({ message: "Occasion reminder deleted successfully" });
  } catch (error) {
    console.error("Error executing delete occasion reminder query:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting occasion reminder" });
  }
});

// Undefined route handling
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
