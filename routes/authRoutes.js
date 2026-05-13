import express from "express"
import { signupstore, loginstore, forgotPassword, resetPassword } from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signupstore);
authRouter.post("/login", loginstore);

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

export default authRouter