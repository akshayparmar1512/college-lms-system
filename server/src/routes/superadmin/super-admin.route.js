import {Router} from "express"
import { registerCollege } from "../../controllers/superadmin.controller.js"
import { upload } from "../../middlewares/multer.middleware.js"

export const superAdminRoute = Router()

superAdminRoute.post("/register-college",upload.single("logo"),registerCollege)