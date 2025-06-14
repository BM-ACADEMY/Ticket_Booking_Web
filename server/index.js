const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");


// Import routes
const roleRoutes = require("./routes/roleRoute");
const adminRoutes = require("./routes/adminRoute"); 
const userRoutes = require("./routes/userRoute"); 
const showRoutes = require("./routes/showRoute");
const ticketRoutes = require("./routes/ticketRoute");
const attendanceRoutes = require("./routes/attendanceRoute");
const reportRoutes = require("./routes/reportsRoute");
const dashboardRoutes = require("./routes/dashboardRoute");
const brandRoutes=require("./routes/brandRoute");
const associateBrand=require("./routes/associatesRoute")
const eventBrand=require("./routes/eventBrandRoute");

// Load env variables
dotenv.config();

// Init express
const app = express();

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.PRODUCTION_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use((req, res, next) => {
    const allowedOrigins = [process.env.FRONTEND_URL, process.env.PRODUCTION_URL];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }

    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use('/qrcodes', express.static(path.join(__dirname, 'public/qrcodes')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



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
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/brands",brandRoutes);
app.use("/api/associate-brand",associateBrand);
app.use("/api/event-brand",eventBrand);



// Connect DB and then start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });
