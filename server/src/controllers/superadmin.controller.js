import { SuperAdminService } from "../services/superadmin.service.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { destroyImageFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { sendAdminCredentialsMail } from "../utils/nodemailer.js"
import crypto from "node:crypto"
import bcrypt from "bcrypt"

const superAdminService = new SuperAdminService()

export async function registerCollegeWithAdmin(req, res, next) {
    let publicId;

    try {
        if (!req.file) {
            throw new ApiError(400, "College logo is required");
        }

        const localFilePath = req.file.path;
        const uploadResult = await uploadOnCloudinary(localFilePath, "lms/colleges-logo");

        if (uploadResult === null) {
            throw new ApiError(500, "File upload failed");
        }

        const logourl = uploadResult.secure_url;
        publicId = uploadResult.public_id;


        const temporaryPassword = crypto.randomBytes(4).toString("hex");
        const salt = 11;
        const hashPassword = await bcrypt.hash(temporaryPassword, salt);

        const { collegeName, aicteId, collegeSlug, adminName, adminEmail } = req.body
        
        const data = {
            collegeName: collegeName,
            aicteId: aicteId,
            collegeSlug: collegeSlug,
            adminName: adminName,
            adminEmail: adminEmail,
            logourl,
            hashPassword

        }

        const result = await superAdminService.registerCollegeAndAdmin(data)

        await sendAdminCredentialsMail(
            result.admin.full_name,
            result.college.name,
            result.admin.email,
            temporaryPassword,
            result.admin.email
        );

        return res.status(201).json(
            new ApiResponse(201, result, "College and Admin registered successfully")
        );

    } catch (error) {

        if (publicId) {
            await destroyImageFromCloudinary(publicId);
        }

        console.log("Error occurred in Registration:", error);
        next(error);
    }
}
