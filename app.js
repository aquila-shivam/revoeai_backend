// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const tableRoutes = require("./routes/tableRoutes");  

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(express.json());
// Define the CORS options
const corsOptions = {
    credentials: true,
    origin: "*" // Whitelist the domains you want to allow
};

app.use(cors(corsOptions)); // Use the cors middleware with your options

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Routes
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/api/tables", tableRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
