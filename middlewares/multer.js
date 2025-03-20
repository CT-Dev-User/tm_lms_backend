// import multer from 'multer'
// import {v4 as uuid} from 'uuid'

// const storage = multer.diskStorage({
//     destination:  (req,file,cb) =>{
//         cb(null,"uploads/")
//     },
//     filename(req,file,cb){
//         const id = uuid()

//         const extName = file.originalname.split(".").pop();
//         const fileName = `${id}.${extName}`;

//         cb(null,fileName);
//     },
// })

// export const uploadFiles = multer({storage}).single("file");


import multer from 'multer'
import {v4 as uuid} from 'uuid'

const storage = multer.diskStorage({
    destination:  (req,file,cb) =>{
        cb(null,"uploads")
    },
    filename(req,file,cb){
        const id = uuid()

        const extName = file.originalname.split(".").pop();
        const fileName = `${id}.${extName}`;

        cb(null,fileName);
    },
})

// Define the file filter to allow both image and video files
const fileFilter = (req, file, cb) => {
    console.log("File received in Multer:", file); // Debugging to check the uploaded file
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4"]; // Add more video formats as needed

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Only image (.jpg, .jpeg, .png) and video (.mp4) files are allowed!"), false);
    }
};

// Initialize Multer with storage and file filter
export const uploadFiles = multer({ storage, fileFilter }).single("file"); // Ensure the field name matches the frontend input
