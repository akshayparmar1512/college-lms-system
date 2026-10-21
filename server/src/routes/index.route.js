import {Router} from "express"
import { superAdminRoute } from "./superadmin/super-admin.route.js"

export const route = Router()

route.use("/super-admin",superAdminRoute)

