import multer from "multer"
import path from "path"
import fs from "fs"


const uploadsDir = path.resolve("uploads")
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer(
    {
        storage: storage,
        limits: 12 * 1024 * 1024
    }
)