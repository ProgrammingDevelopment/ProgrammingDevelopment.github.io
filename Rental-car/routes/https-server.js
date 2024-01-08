const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const config = {
  user: "your_username",
  password: "your_password",
  server: "your_server",
  database: "your_database",
};

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    await sql.connect(config);

    const result = await sql.query`
      SELECT * FROM Users
      WHERE username = ${username} AND password = ${password};
    `;

    if (result.recordset.length > 0) {
      // Login successful
      res.json({ success: true, message: "Login successful" });
    } else {
      // Invalid credentials
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    await sql.close();
  }
});

app.post("/api/logout", (req, res) => {
  // Implement server-side logout logic if needed
  res.json({ success: true, message: "Logout successful" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
