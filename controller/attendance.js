import {
  createAttendance,
  getAttendance,
  findAttendance,
  attendanceCheckout,
} from "../model/AttendanceModel.js";
import { getEventById } from "../model/EventModel.js";
import { getUserById } from "../model/UserModel.js";
import { getStudentById } from "../model/StudentModel.js";
import { ulid } from "ulidx";

export const markAttendance = async (req, res, next) => {
  const { eventId, studentId } = req.body;
  try {
    const [event] = await getEventById(eventId);

    if (event[0].status !== "1") {
      return res.status(403).json({
        success: false,
        message: "Event does not accept attendance at the moment",
      });
    }

    const student = await getStudentById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const [isCheckOut] = await findAttendance(studentId, eventId);

    if (isCheckOut.length > 0) {
      checkOut(studentId, eventId);
    } else {
      await createAttendance({
        event: eventId,
        student: studentId,
      });
    }
    res.status(201).json({
      success: true,
      message: "Attendance recorded",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const checkOut = async (student, event) => {
  try {
    const date = new Date().toISOString().slice(0, 19).replace("T", " "); //local timestamp

    const attendance = await attendanceCheckout({
      checkOut: date,
      student,
      event,
    });

    if (attendance) {
      return true;
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const fetchAttendance = async (req, res, next) => {
  try {
    const [attendance] = await getAttendance();

    if (attendance.length <= 0) {
      const error = new Error("No attendance found");
      error.status = 200;
      error.success = true;
      return next(error);
    }

    const students = await Promise.all(
      attendance.map(async (data) => {
        // Get student data
        const [sData] = await getStudentById(data.student);

        // Get user data based on student userId
        const [uData] = await getUserById(sData[0].userId);

        return {
          id: uData[0].id,
          studId: sData[0].studId,
          firstname: uData[0].firstname,
          lastname: uData[0].lastname,
          middlename: uData[0].middlename,
          email: uData[0].email,
          course: sData[0].course,
          year: sData[0].year,
          profilePicture: sData[0].profilePicture,
          checkIn: data.checkIn,
          checkOut:data.checkOut
        };
      })
    );


    res.status(200).json({
      success: true,
      data: students,
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
