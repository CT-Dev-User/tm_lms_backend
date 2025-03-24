import { v2 as cloudinary } from 'cloudinary';
import { Courses } from '../models/courses.js';
import { Lecture } from '../models/lectures.js';
import { User } from '../models/user.js';
import { TryCatch } from '../middlewares/TryCatch.js';
import formidable from 'formidable';
import { Readable } from 'stream';
import fs from 'fs';

const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    Readable.from(buffer).pipe(stream);
  });
};

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      console.log('Parsed fields:', fields);
      console.log('Parsed files:', files);
      resolve({ fields, files });
    });
  });

export const createCourse = TryCatch(async (req, res) => {
  const { fields, files } = await parseForm(req);

  // Handle array structure from formidable v3
  const { title, description, price, duration, category, createdBy } = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, value[0]])
  );
  const imageFile = files.file?.[0]; // Access first file in array

  if (!imageFile || !imageFile.size) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  const buffer = fs.readFileSync(imageFile.filepath);
  const result = await uploadToCloudinary(buffer, {
    folder: 'courses',
    resource_type: 'image',
  });

  const course = await Courses.create({
    title,
    description,
    image: result.secure_url,
    price,
    duration,
    category,
    createdBy,
  });

  res.status(201).json({
    message: 'Course created successfully',
    course,
  });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const { fields, files } = await parseForm(req);

  // Handle array structure from formidable v3
  const { title, description } = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, value[0]])
  );
  const videoFile = files.file?.[0]; // Access first file in array

  if (!videoFile || !videoFile.size) {
    return res.status(400).json({ message: 'Please upload a video' });
  }

  const buffer = fs.readFileSync(videoFile.filepath);
  const result = await uploadToCloudinary(buffer, {
    folder: 'lectures',
    resource_type: 'video',
  });

  const lecture = await Lecture.create({
    title,
    description,
    video: result.secure_url,
    course: course._id,
  });

  res.status(201).json({
    message: 'Lecture added successfully',
    lecture,
  });
});

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  await Lecture.deleteMany({ course: course._id });
  const publicId = course.image.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(`courses/${publicId}`, { resource_type: 'image' });

  await course.deleteOne();
  res.status(200).json({ message: 'Course deleted successfully' });
});

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) {
    return res.status(404).json({ message: 'Lecture not found' });
  }

  const publicId = lecture.video.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(`lectures/${publicId}`, { resource_type: 'video' });

  await lecture.deleteOne();
  res.status(200).json({ message: 'Lecture deleted successfully' });
});

export const getAllStats = TryCatch(async (req, res) => {
  const totalCourses = await Courses.countDocuments();
  const totalLectures = await Lecture.countDocuments();
  const totalUsers = await User.countDocuments();

  const stats = { totalCourses, totalLectures, totalUsers };
  res.status(200).json({ success: true, stats });
});

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
  res.status(200).json({ success: true, users });
});

export const updateRole = TryCatch(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const validRoles = ['user', 'admin', 'instructor'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Role updated successfully',
  });
});