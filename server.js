require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Test Route
app.get("/api/test", (req, res) => {
    res.json({ message: "Connection Successful! 🚀", status: "ok" });
  });
  
// Start Server
app.listen(PORT, () => {
console.log(`✅ Server running on port ${PORT}`);
});