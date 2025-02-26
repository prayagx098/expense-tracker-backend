require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const socketIo = require('socket.io');
const http = require("http"); // Import http module

const app = express();
const server = http.createServer(app); 

app.use(express.json());
app.use(cors()); 

// Initialize Socket.IO
const io = socketIo(server);

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true }));

connectDB();

// Define a root route
app.get("/", (req, res) => {
    res.send("Welcome to the API! 🚀");
});

// Authentication routes
app.use("/api/auth", require("./routes/auth"));
// Dashboard data route
app.use("/api/dashboard", require("./routes/dashboard"));

app.use('/api/chat', require("./routes/chat"));

// Listen for socket connections
io.on('connection', (socket) => {
    console.log('A user connected');
  
    // When a message is sent, broadcast it to all connected users
    socket.on('send-message', (message) => {
      io.emit('new-message', message);
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

// Test Route
app.get("/api/test", (req, res) => {
    res.json({ message: "Connection Successful! 🚀", status: "ok" });
});

// Start Server (only one `app.listen()`)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
