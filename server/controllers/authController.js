import "dotenv/config";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { deleteCloudinaryImages } from "../middleware/multer.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

function createAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
}

function sendRefreshToken(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const duplicate = await User.findOne({ email });
    if (duplicate)
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });

    const image = req.files?.map((f) => f.secure_url || f.path);

    const user = await User.create({ name, email, password, image });
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    sendRefreshToken(res, refreshToken);
    return res.status(201).json({
      success: true,
      message: `${user.name} created successfully`,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image,
      },
    });
  } catch (error) {
    console.error(error);
    req.files?.map(
      async (file) =>
        await deleteCloudinaryImages(file.secure_url || file.path),
    );
    return res.status(500).json({
      success: false,
      message: "User registeration error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await User.save({ validateBeforeSave: false });
    sendRefreshToken(res, refreshToken);

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: `${user.name} logged in successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login error",
    });
  }
}

export async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(400).json({
        success: false,
        message: "No refreshToken",
      });

    let decoded;
    try {
      decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
      console.error(error);
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      return res.status(400).json({
        success: false,
        messaege: "Token expired",
      });
    }

    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token reuse attempt captured",
      });
    }

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    sendRefreshToken(res, newRefreshToken);
    return res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Refresh token error",
    });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(400).json({
        success: false,
        message: "No user found",
      });

    return res.status(200).json({
      success: true,
      message: "User info fetched successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error failed to fetch user",
    });
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(400).json({
        success: false,
        message: "No token found",
      });

    await User.findOneAndUpdate(
      { refreshToken: token },
      { refreshToken: null },
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: `User deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Logout error",
    });
  }
}
