import mysql from "mysql2";

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT || 3306;

const db = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  port: DB_PORT
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1); // Terminate the app if there's an error
  }
  console.log('Connected to MySQL database.');
});

export default db;
