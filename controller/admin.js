import { getUser, getUserById, updateUser } from "../model/UserModel.js";
import {
  getStudent,
  getStudentById,
  getStudentId,
  updateStudent,
  uploadProfilePic,
} from "../model/StudentModel.js";
import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryPublicId } from "../helper/getPublicId.js";
//fetch user by id
export const findUser = async (req, res, next) => {
  try {
    // console.log(req.user)

    // Find the user by id
    const [users] = await getUserById(req.user.userId);
    const user = users[0];

    if (!user) {
      const error = new Error("Student not found");
      error.status = 404;
      error.success = false;
      return next(error);
    }

    // Find the student by id
    const [students] = await getStudentId(req.user.userId);
    const student = students[0];

    if (!student) {
      const error = new Error("Student not found");
      error.status = 404;
      error.success = false;
      return next(error);
    }

    const data = {
      id: user.id,
      studId: student.studId,
      firstname: user.firstname,
      lastname: user.lastname,
      middlename: user.middlename,
      email: user.email,
      course: student.course,
      year: student.year,
      profilePicture: student.profilePicture,
    };
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    //check if invalid id format
    if (err.name === "Cast Error") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const data = req.body;

    // Find the user by id
    const [users] = await getUserById(req.user.userId);
    const user = users[0];

    if (!user) {
      const error = new Error("Student not found");
      error.status = 404;
      error.success = false;
      return next(error);
    }

    // Find the student by id
    const [students] = await getStudentId(req.user.userId);
    const student = students[0];

    if (!student) {
      const error = new Error("Student not found");
      error.status = 404;
      error.success = false;
      return next(error);
    }

    // Use existing values if the new data is an empty string or null
    const userData = {
      firstname: data.firstname || user.firstname, // If data.firstname is empty or null, fallback to user.firstname
      lastname: data.lastname || user.lastname,
      middlename: data.middlename || user.middlename,
      email: data.email || user.email,
    };

    const studentData = {
      course: data.course || student.course,
      year: data.year || student.year,
    };

    await updateUser(req.user.userId, userData);
    await updateStudent(student.studId, studentData);

    res.status(200).json({ success: true, message: "User updated" });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};

export const uploadProfile = async (req, res, next) => {
  const profilePic = req.file; // Access the uploaded file

  //require upload profile pic
  if (!profilePic) {
    const error = new Error("No profile picture uploaded");
    error.status = 400;
    error.success = false;
    return next(error);
  }

  try {
    // Find the user by id
    const [users] = await getUserById(req.user.userId);
    const user = users[0];
    console.log(user)
    if (!user) {
      const error = new Error("Student not found");
      error.status = 404;
      error.success = false;
      return next(error);
    }

    // Find the student by id
    const [students] = await getStudentId(req.user.userId);
    const student = students[0];

    if (!student) {
      const error = new Error("Student not found");
      error.status = 404;
      error.success = false;
      return next(error);
    }

    
    // If the student has an existing profile picture in Cloudinary, delete it
    if (student.profilePicture) {
      const publicId = `acetrack/${getCloudinaryPublicId(
        student.profilePicture
      )}`;

      await cloudinary.uploader.destroy(publicId);
      console.log("Old profile picture deleted from Cloudinary");
    }
    //get file url
    const filePath = req.file.path;

    // Update the student's profile picture in the database with the Cloudinary URL
    await uploadProfilePic(student.studId, filePath);

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully!",
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};
