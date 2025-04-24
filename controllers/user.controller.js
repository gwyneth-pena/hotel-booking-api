import { User, UserLogin } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      password: req.body.password,
    });

    await user.validate();

    const password = await bcrypt.hash(req.body.password, 12);
    user.password = password;
    user.save();
    return res.status(200).json({ message: "User already created." });
  } catch (error) {
    return res.status(404).json({ message: error.message });
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
    return res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "None",
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

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.status(200).json({
      username: user?.username,
      firstName: user?.firstName,
      lastName: user.lastName,
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
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: req.body.password,
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
