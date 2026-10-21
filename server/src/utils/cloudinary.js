import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  
})


export const uploadOnCloudinary = async (localFilePath, folder) => {
    try {
        if (!localFilePath) return null

        const uploadResult = await cloudinary.uploader.upload(localFilePath,
            {
                folder: folder,
                resource_type: "auto",
                
            }
        )

        console.log("file uploaded succesfully")
        console.log(uploadResult)

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }

        return uploadResult
    } catch (error) {

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        console.log("file upload error", error)
        return null
    }
}

export const destroyImageFromCloudinary = async (publicId) => {
    try {

        const destroyResult = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
            invalidate: true
        })

        console.log("file deleted succesfully from cloudinary")
    } catch (error) {
        console.log("file destroy error",error)
        throw error
    }

}