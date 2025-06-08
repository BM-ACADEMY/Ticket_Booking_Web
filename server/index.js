const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");


// Import routes
const roleRoutes = require("./routes/roleRoute");
const adminRoutes = require("./routes/adminRoute"); 
const userRoutes = require("./routes/userRoute"); 
const showRoutes = require("./routes/showRoute");
const ticketRoutes = require("./routes/ticketRoute");
const attendanceRoutes = require("./routes/attendanceRoute");
const reportRoutes = require("./routes/reportsRoute");


// Load env variables
dotenv.config();

// Init express
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN, 
  credentials: true,
}));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
}); 


app.use("/api/roles", roleRoutes);
app.use("/api/admin-and-subAdmin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/reports", reportRoutes);

// Connect DB and then start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });
