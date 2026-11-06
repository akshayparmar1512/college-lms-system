import { Router } from "express";
import { generateNewRefreshAccessToken, login } from "../../controllers/auth.controller.js";

export const authRoute = Router()
authRoute.post("/login",login)
authRoute.post("/refresh-token",generateNewRefreshAccessToken)