import { getUser, getUserById, updateUser } from "../model/UserModel.js";
import {
  getStudent,
  getStudentById,
  getStudentId,
  updateStudent,
  uploadProfilePic,
} from "../model/StudentModel.js";

export const getStudents = async (req, res, next) => {
  try {
    const [students] = await getStudent();

    if (students.length <= 0) {
      const error = new Error("No students found");
      error.status = 200;
      error.success = true;
      return next(error);
    }

    const users = await Promise.all(
      students.map(async (student) => {
        const [data] = await getUserById(student.userId);

        return {
          id: student.userId,
          studId: student.studId,
          firstname: data[0].firstname,
          lastname: data[0].lastname,
          middlename: data[0].middlename,
          email: data[0].email,
          course: student.course,
          year: student.year,
          profilePicture: student.profilePicture,
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    const error = new Error(err.message);
    error.status = 500;
    error.success = false;
    return next(error);
  }
};
