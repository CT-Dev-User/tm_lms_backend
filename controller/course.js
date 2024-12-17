import { TryCatch } from "../middlewares/TryCatch.js";
import {Courses} from "../models/courses.js";
import {Lecture} from  "../models/lectures.js";
import {User} from "../models/user.js"

export const getAllCourses = TryCatch(async(req,res) =>{
    const courses = await Courses.find()
    res.json({
        courses,
    });
});
 export const getSingleCourse = TryCatch(async(req,res) =>{
    const course = await Courses.findById(req.params.id)
    res.json({
        course,
    });
 });

 export const fetchLectures = TryCatch(async(req,res) =>{
    const lectures = await Lecture.find({course: req.params.id})
    if (lectures.length === 0) {
        return res.status(404).json({
            message: "No lectures found for this course",
        });
    }

    const user = await User.findById(req.user._id)

    if(user.role === "admin"){
        return res.json({lectures})
    }

    if(!user.subscription.includes(req.params.id)) return res.status(400).json({
        message : "you have not subscribed to this course",
    });

    res.json({lectures})

 })