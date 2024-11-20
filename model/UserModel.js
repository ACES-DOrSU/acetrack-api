import db from "../database/database.js";

const table = "user";

export const createUser = async (userData) => {
  let sql = `INSERT INTO ${table} (id, firstname, lastname, middlename, email, password, role) VALUES (?,?,?,?,?,?,?)`;
  const values = [
    userData.userId,
    userData.firstname,
    userData.lastname,
    userData.middlename,
    userData.email,
    userData.password,
    userData.role
  ];
  // console.log(userData)
  return db.promise().query(sql, values);
};

export const getUser = async () => {
  let sql = `SELECT * FROM ${table} WHERE role != '1'`;
  return db.promise().query(sql);
};

export const getUserByEmail = async (email) => {
  let sql = `SELECT * FROM ${table} WHERE email = ?`;

  return db.promise().query(sql, email);
};

export const getUserById = async (id) => {

  let sql = `SELECT * FROM ${table} WHERE id = ?`;
  return db.promise().query(sql, id);
};

export const updateUser = async (userId, userData) => {
  let sql = `UPDATE ${table} SET firstname = ?, lastname= ?, middlename = ?, email = ? WHERE id = ?`;
  const values = [
    userData.firstname,
    userData.lastname,
    userData.middlename,
    userData.email,
    userId,
  ];

  return db.promise().query(sql, values);
};

export const deleteUser = async (id) => {
  let sql = `DELETE FROM ${table} WHERE id = ?`;
  
  return db.promise().query(sql, id);
};
