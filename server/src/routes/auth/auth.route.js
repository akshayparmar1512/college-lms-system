import { Router } from "express";
import { login } from "../../controllers/auth.controller.js";

export const authRoute = Router()
authRoute.post("/login",login)