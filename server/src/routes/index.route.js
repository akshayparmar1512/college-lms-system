import {Router} from "express"
import { superAdminRoute } from "./superadmin/super-admin.route.js"
import { authRoute } from "./auth/auth.route.js"

export const route = Router()

route.use("/super-admin",superAdminRoute)
route.use("/auth",authRoute)

