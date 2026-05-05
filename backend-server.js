import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pc_builder_ai",
  password: "admin1122",  
  port: 5432,
});

// Example endpoint: get all components
app.get("/api/components", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM components");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Example endpoint: get all pc prices
app.get("/api/prices", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM prices");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});