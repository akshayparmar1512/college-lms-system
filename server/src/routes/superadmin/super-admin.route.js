import {Router} from "express"
import { registerCollegeWithAdmin } from "../../controllers/superadmin.controller.js"
import { upload } from "../../middlewares/multer.middleware.js"

export const superAdminRoute = Router()

superAdminRoute.post("/register-college-admin",upload.single("logo"),registerCollegeWithAdmin)

