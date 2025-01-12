import { body } from "express-validator"

export const RegisterUserValidationSchema = [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").isLength({min:8}).withMessage("Password must be 8  character"),
    body("name").notEmpty().withMessage("Name is required")
];