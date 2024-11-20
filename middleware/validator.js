import { body, validationResult } from "express-validator";

//define validation rules for creating a new user
export const userValidationRules = () => [
  body("firstname").notEmpty().withMessage("Firstname is required"),
  body("lastname").notEmpty().withMessage("Lastname is required"),
  body("email").notEmpty().withMessage("Email is required"),
  body("course").notEmpty().withMessage("Course is required"),
  body("year").notEmpty().withMessage("Year is required"),
  body("studentId").notEmpty().withMessage("Student ID is required"),
  body("password").isLength({ min: 8 }).withMessage("Password length is less than 8"),
];

export const loginValidationRules = () => [
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
export const eventValidationRules = () =>[
  body("name").notEmpty().withMessage("Name is required"),
  body("startDate").notEmpty().withMessage("Start date is required"),
  body("endDate").notEmpty().withMessage("End date is required"),
  body("location").notEmpty().withMessage("Location is required")
]

// Middleware to handle validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => error.msg),
    });
  }
  next();
};
