import db from "../database/database.js";

const table = "student";

export const createStudent = async (userData) => {
  let sql = `INSERT INTO ${table} (studId, userId, course, year, profilePicture) VALUES (?,?,?,?,?)`;
  const values = [
    userData.studentId,
    userData.userId,
    userData.course,
    userData.year,
    userData.profilePicture,
  ];
  return db.promise().query(sql, values);
};

export const getStudent = async () => {
  let sql = `SELECT * FROM ${table}`;
  return db.promise().query(sql);
};
//get student by user id during login
export const getStudentId = async (userId) => {
  let sql = `SELECT * FROM ${table} WHERE userId = ?`;
  return db.promise().query(sql, userId);
};
//get student using student id
export const getStudentById = async (studentId) => {
  let sql = `SELECT * FROM ${table} WHERE studId = ?`;
  return db.promise().query(sql, studentId);
};

export const uploadProfilePic = async (studentId, profilePath) => {
  let sql = `UPDATE ${table} SET profilePicture = ? WHERE studId = ?`;
  const values = [profilePath, studentId];

  return db.promise().query(sql, values);
};

export const updateStudent = async (id, userData) => {
  let sql = `UPDATE ${table} SET course = ?, year = ? WHERE studId = ?`;
  const values = [
    userData.course,
    userData.year,
    id
  ];

  return db.promise().query(sql, values);
};
