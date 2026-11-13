import { Router } from "express";
import { forgotPassword, generateNewRefreshAccessToken, login, logout, verifyOtp } from "../../controllers/auth.controller.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.middleware.js";

export const authRoute = Router()
authRoute.post("/login",login)
authRoute.post("/refresh-token",generateNewRefreshAccessToken)
authRoute.post("/logout",isAuthenticated,logout)
authRoute.post("/forgot-password",forgotPassword)
authRoute.post("/verify-otp",verifyOtp)