import {Router} from "express"
import { superAdminRoute } from "./superadmin/super-admin.route.js"
import { authRoute } from "./auth/auth.route.js"
import { testRoute } from "../controllers/tes.controller.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js"

export const route = Router()

route.use("/super-admin",superAdminRoute)
route.use("/auth",authRoute)
route.use("/protected-route",isAuthenticated,testRoute)
