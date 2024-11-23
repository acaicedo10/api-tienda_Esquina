const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../config/env");
const ApiResponse = require("../utils/apiResponse");

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.error(res, "Email already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      profile: { firstName, lastName },
    });

    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    return ApiResponse.success(
      res,
      { user, token },
      "Registration successful",
      201
    );
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return ApiResponse.error(res, "Email incorent", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return ApiResponse.error(res, "Password incorent", 401);
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    user.lastLogin = new Date();
    await user.save();

    return ApiResponse.success(res, { user, token }, "Login successful");
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  register,
  login,
};
