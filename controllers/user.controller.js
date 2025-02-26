import { User, UserLogin } from "../models/user.model.js";
import bcrypt from "bcrypt";

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
    return res.status(200).json({ message: "Login successful." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
