const express = require("express");
const cors = require("cors");

const testRoute = require("./routes/testRoute");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require(
  "./routes/userRoutes"
);
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/test-db", testRoute);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AMS API Running",
  });
});

module.exports = app;