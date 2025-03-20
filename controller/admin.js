
import { TryCatch } from "../middlewares/TryCatch.js";
import { Courses } from "../models/courses.js";
import { Lecture } from "../models/lectures.js";
import { Meeting } from "../models/meetingData.js";
import { rm } from 'fs';
import { promisify } from 'util'
import fs from 'fs';
import { User } from '../models/user.js'

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


export const addLectures = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id)

    if (!course) return res.status(404).json({
        message: "No course for this id",
    });

    const { title, description } = req.body

    const file = req.file
    const lecture = await Lecture.create({
        title,
        description,
        video: file?.path,
        course: course._id,


    });
    res.status(200).json({
        message: " lecture added successfully",
        lecture,
    })
});

export const deleteLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id)
    rm(lecture.video, () => {
        console.log("video deleted")
    });

    await lecture.deleteOne()
    res.json({ message: "Lecture deleted" })

})

const unlinkAsync = promisify(fs.unlink)

export const deleteCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id)

    const lectures = await Lecture.find({ course: course._id })

    await Promise.all(
        lectures.map(async (lecture) => {
            await unlinkAsync(lecture.video);
            console.log("video deleted")
        })
    );

    rm(course.image, () => {
        console.log("image deleted")
    });

    await Lecture.find({ course: req.params.id }).deleteMany();

    await course.deleteOne();
    await User.updateMany({}, { $pull: { subscription: req.params.id } });

    res.json({
        message: "course deleted"
    })


})

// export const createMeeting = TryCatch(async(req, res) => {
//     const course = await Courses.findById(req.params.id);

//     if(!course) return res.status(404).json({
//         success: false,
//         message: "No course found for this id",
//     });

//     const {
//         meetingName,
//         meetingDescription,
//         meetingDate,
//         meetingTime,
//         meetingDuration,
//         meetingLink,
//         meetingStatus,
//     } = req.body;



//     const meeting = await Meeting.create({
//         meetingName,
//         meetingDescription,
//         meetingDate,
//         meetingTime,
//         meetingDuration,
//         meetingLink,
//         meetingStatus,
//         meetingCreatedBy: req.user._id, // Assuming you have user info in req.user from auth middleware
//         course: course._id,
//     });

//     res.status(201).json({
//         success: true,
//         message: "Meeting created successfully",
//         meeting,
//     });
// });

export const getAllStats = TryCatch(async (req, res) => {
    const totalCourses = (await Courses.find()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUsers = (await User.find()).length;


    const stats = {
        totalCourses,
        totalLectures,
        totalUsers,
    };
    res.json({
        stats,
    });
});

export const getAllUser = TryCatch(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } })
    .select(
        "-password"
    );
    res.json({users})
});

export const updateRole = TryCatch(async (req, res) => {
   const user = await User.findById(req.params.id)
   
      if(user.role==="user"){
        user.role="admin";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Role updated admin",
        });
      }

      if(user.role==="admin"){
        user.role="user";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Role updated user",
        });
      }

});