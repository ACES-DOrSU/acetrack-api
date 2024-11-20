import { ulid } from "ulidx";
import bcrypt from "bcryptjs";
import { createStudent, getStudentById } from "../../model/StudentModel.js";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "../../model/UserModel.js";
import jwt from "jsonwebtoken";

const ACCESS_KEY = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_KEY = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const [rows] = await getUserByEmail(email);
    const user = rows[0];

    if (!user) {
      const error = new Error("Invalid email or password");
      error.status = 400;
      error.success = false;
      return next(error);
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.status = 400;
      error.success = false;
      return next(error);
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      ACCESS_KEY, //secret key
      { expiresIn: ACCESS_EXPIRATION } // Token expiration time
    );

    //generate refresh token
    const refreshToken = jwt.sign({ userId: user.id, role: user.role }, REFRESH_KEY, {
      expiresIn: REFRESH_EXPIRATION,
    });

    //for testing
    if (process.env.VERSION == "prod") {
      //send refresh token as HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }); // 7 days
    } else if (process.env.VERSION == "dev") {
      //send refresh token as HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }); // 7 days
    }

    //send refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 7 days

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};
export const register = async (req, res, next) => {
  try {
    const data = req.body;

    // validate if student exists
    const [rows] = await getStudentById(data.studentId);
    const user = rows[0];

    if (user) {
      const error = new Error("Student already registered");
      error.status = 403;
      error.success = false;
      return next(error);
    }

    //generate unique id
    const userId = ulid();

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    //student role
    const ROLE = "1";

    const userData = {
      userId: userId,
      firstname: data.firstname,
      lastname: data.lastname,
      middlename: data.middlename,
      email: data.email,
      password: hashPassword,
      role: ROLE,
    };

    const studentData = {
      studentId: data.studentId,
      userId: userId,
      course: data.course,
      year: data.year,
    };

    await createUser(userData);
    await createStudent(studentData);
    res.status(201).json({ success: true, message: "User created" });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // Check if the refresh token exists
  if (!refreshToken)
    return res.status(401).json({
      success: false,
      message: "Refresh token required",
    });

  // Verify the refresh token
  jwt.verify(refreshToken, REFRESH_KEY, async (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    try {
      // Fetch user details using the user ID
      const [users] = await getUserById(user.userId);
      const currentUser = users[0];

      // If user is not found
      if (!currentUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate a new access token with both id and email in the payload
      const newAccessToken = jwt.sign(
        { userId: currentUser.id, email: createUser.email,  role: currentUser.role},
        ACCESS_KEY, //secret key
        { expiresIn: ACCESS_EXPIRATION } // Token expiration time
      );

      // Return the new access token
      return res.json({
        success: true,
        token: newAccessToken,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to refresh access token",
      });
    }
  });
};
