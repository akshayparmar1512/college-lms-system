import { SuperAdminService } from "../services/superadmin.service.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { destroyImageFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"

const superAdminService = new SuperAdminService()


export async function registerCollege(req, res, next) {
    let publicId
    try {
        // check req.file exists?
        // take localfilepath from req.file
        // call cloudinary file upload method
        // if its return null throw error
        // take secure url and public id for save in db and delete
        // call superadminservice register method
        // return succesful response
        // call destroy method of cloudinary in catch

        if (!req.file) {
            throw new ApiError(400, "college logo is required")
        }

        const localFilePath = req.file.path

        const uploadResult = await uploadOnCloudinary(localFilePath, "lms/colleges-logo")

        if (uploadResult === null) {
            throw new ApiError(500, "file upload failed")
        }

        const logourl = uploadResult.secure_url

        publicId = uploadResult.public_id

        const college = await superAdminService.registerCollege({ ...req.body, logourl })

        return res.status(201).json(new ApiResponse(201, college, "college register succesfully"))

    } catch (error) {
        if (publicId) {
            await destroyImageFromCloudinary(publicId)
        }
        console.log("error occured:", error)
        next(error)
    }


}