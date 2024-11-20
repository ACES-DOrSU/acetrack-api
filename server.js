import express from "express";
import user from "./routes/user.js";
import event from "./routes/event.js";
import auth from "./routes/auth.js";
import attendance from "./routes/attendance.js";
import students from "./routes/student.js";
import errorHandler from "./middleware/error.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 8080;
const app = express();

const corsOptions = {
  origin: true,
  credentials: true, // Allow cookies and credentials
};

//enable cors for all origins
app.use(cors(corsOptions));
//parse cookies
app.use(cookieParser());

//auth routes
app.use("/api/", students);
app.use("/api/", attendance);
app.use("/api/", auth);
//user routes
app.use("/api/", user);
//event routes
app.use("/api/", event);
// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

//implement error handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
