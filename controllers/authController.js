const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Add validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: "User with this email already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      email, 
      password: hashedPassword
    });

    await newUser.save();
    
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      error: "Error registering user",
      details: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};
