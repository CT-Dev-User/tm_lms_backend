
import { TryCatch } from "../middlewares/TryCatch.js";
import { Courses } from "../models/courses.js";
import { Lecture } from "../models/lectures.js";

export const createCourse = TryCatch(async (req, res) => {
    const { title, description, category, createdBy, duration, price } = req.body;

    const image = req.file ? req.file.path : null;

    if (!image) {
        return res.status(400).json({
            success: false,
            message: "Image is required",
        });
    }

    await Courses.create({
        title,
        description,
        category,
        createdBy,
        image, 
        duration,
        price,
    });

    res.status(201).json({
        success: true,
        message: "Course created successfully",
    });
});


export const addLectures = TryCatch(async(req,res) =>{
    const course = await Courses.findById(req.params.id)

    if(!course) return res.status(404).json({
        message: "No course for this id",
    });

    const {title,description} = req.body

    const file = req.file
    const lecture = await Lecture.create({
        title,
        description,
        video : file?.path,
        course : course._id,


    });
    res.status(200).json({
        message:" lecture added successfully",
        lecture,
    })
});

