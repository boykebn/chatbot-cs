require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const Redis = require("ioredis");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Postgre
const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Redis
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

app.use("/webhook", require("./routes/fonnte.webhook"));

app.get("/", async (req, res) => {
  const time = await db.query("SELECT NOW()");
  await redis.set("ping", "pong");

  res.json({
    message: "Chatbot server running 🚀",
    db_time: time.rows[0].now,
    redis: await redis.get("ping"),
  });
});

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT),
);

// console.log("Starting WhatsApp service...");
// const startWhatsApp = require("./whatsapp/wa");
// startWhatsApp();
