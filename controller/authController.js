import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Signup
export const signupstore = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "required fields are missing...",
        status: false,
      });
    }

    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        message: "Email already exist",
        status: false,
      });
    }

    // ✅ Direct create karo - model hash kar lega
    const createUser = new userModel({
      name,
      email,
      password,
    });
    
    await createUser.save();  // ✅ save() call karo, create() nahi

    res.status(201).json({
      message: "user created successfully..",
      status: true,
      user: {
        id: createUser._id,
        name: createUser.name,
        email: createUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
export const loginstore = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "required fields are missing...",
        status: false,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "invalid email or password",
        status: false,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "invalid email or password",
        status: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1y" }
    );

    res.status(200).json({
      message: "login successfully.",
      status: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

// Temporary storage for reset tokens (production mein Redis ya database use karo)
const resetTokens = {};

// @desc    Forgot password - send reset email
// @route   POST /api/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }
    
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    // Store OTP
    resetTokens[email] = { otp, expiresAt };
    
    // Email config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `<h3>Your OTP is: <b>${otp}</b></h3><p>This OTP expires in 10 minutes.</p>`,
    });
    
    res.json({ message: "OTP sent to email", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const stored = resetTokens[email];
    if (!stored || stored.otp !== otp || stored.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP", status: false });
    }
    
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }
    
    // Update password (model automatically hash kar lega)
    user.password = newPassword;
    await user.save();
    
    // Delete used OTP
    delete resetTokens[email];
    
    res.json({ message: "Password reset successful", status: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};