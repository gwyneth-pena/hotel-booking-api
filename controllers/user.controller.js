import { User, UserLogin } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateOTP, saveOTP, verifyOTP } from "../utls/otp.js";
import { sendEmail } from "../utls/Email.js";
import { toTitleCase } from "../utls/strings.js";
import { saveToken, verifyToken } from "../utls/token.js";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      lastName: toTitleCase(req.body.lastName),
      firstName: toTitleCase(req.body.firstName),
      password: req.body.password,
      mobileNumber: req.body.mobileNumber,
    });

    await user.validate();
    const isExitingUser = await User.findOne({ username: req.body.username });

    if (isExitingUser) {
      return res.status(500).json({ message: "User already exists." });
    }

    const password = await bcrypt.hash(req.body.password, 12);
    user.password = password;
    user.save();
    return res.status(200).json({ message: "User already created." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    await new UserLogin(req.body).validate();
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const isAuthenticated = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isAuthenticated)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    const cookieExpiration = 2 * 60 * 60 * 1000;

    return res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: cookieExpiration,
      })
      .status(200)
      .json({
        message: "Login successful.",
        data: {
          token: token,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Logged out" });
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.status(200).json({
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      id: req.params.id,
      isAdmin: user?.isAdmin,
    });
  } catch (error) {
    return res.status(404).json({ message: "User not found." });
  }
};

export const getUsers = async (req, res) => {
  try {
    let users = {};
    if (req.params.id) {
      users = await User.findById(req.params.id);
    } else {
      users = await User.find();
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json({ message: "User not found." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User has been deleted." });
  } catch (error) {
    return res.status(404).json({ message: "User not found." });
  }
};

export const updateUser = async (req, res) => {
  try {
    let data = req.body;

    if (data.password) {
      data.password = await bcrypt.hash(req.body.password, 12);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...data,
        },
      },
      {
        new: true,
      }
    );
    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ message: "User not found." });
  }
};

export const generateForgotPasswordOTP = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ username: email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = generateOTP(6);

    const data = {
      name: `${user.firstName} ${user.lastName}`,
      otp: otp,
      year: new Date().getFullYear(),
    };

    const savedOTP = await saveOTP(otp, email, "FORGOTPASSWORD", 10);

    if (savedOTP.status !== "SUCCESS") {
      return res.status(500).json({ message: "Internal server error." });
    }

    sendEmail(
      user.username,
      "Request to Change Password",
      "forgotPassword",
      data
    );

    return res.status(200).json({ message: "OTP sent." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    let isVerified = false;

    const missingFields = [];
    if (!otp) missingFields.push("otp");
    if (!email) missingFields.push("email");

    if (missingFields.length) {
      return res
        .status(400)
        .json({ message: `Missing: ${missingFields.join(", ")}` });
    }

    const otpRes = await verifyOTP(otp, email, "FORGOTPASSWORD");
    isVerified = otpRes.isVerified;

    const resetToken = await saveToken(10);

    return res.status(200).json({ isVerified, resetToken });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password, email } = req.body;
    let isVerified = false;

    const missingFields = [];

    if (!token) missingFields.push("token");
    if (!password) missingFields.push("password");
    if (!email) missingFields.push("email");

    if (missingFields.length) {
      return res
        .status(400)
        .json({ message: `Missing: ${missingFields.join(", ")}` });
    }

    const tokenRes = await verifyToken(token);
    isVerified = tokenRes.isVerified;

    if (!isVerified) {
      return res
        .status(401)
        .json({ message: "Not allowed to change password. Try again." });
    }

    const newPassword = await bcrypt.hash(req.body.password, 12);

    await User.findOneAndUpdate(
      {
        username: new RegExp(`^${email}$`, "i"),
      },
      { password: newPassword }
    );

    return res.status(200).json({ message: "Password successfully changed." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
