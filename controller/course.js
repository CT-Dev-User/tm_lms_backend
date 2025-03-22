// controller/course.js
import { instance } from '../index.js';
import { TryCatch } from '../middlewares/TryCatch.js';
import { Courses } from '../models/courses.js';
import { Lecture } from '../models/lectures.js';
import { Payment } from '../models/Payment.js';
import { User } from '../models/user.js';
import crypto from 'crypto';

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({ courses });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json({ course });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (user.role === 'admin') {
    return res.json({ lectures });
  }

  if (lectures.length === 0) {
    return res.status(404).json({ message: 'No lectures found for this course' });
  }

  if (!user.subscription.includes(req.params.id)) {
    return res.status(403).json({ message: 'You have not subscribed to this course' });
  }

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) {
    return res.status(404).json({ message: 'Lecture not found' });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (user.role === 'admin') {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course)) {
    return res.status(403).json({ message: 'You have not subscribed to this course' });
  }

  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const courses = await Courses.find({ _id: { $in: user.subscription } });
  res.json({ courses });
});

export const checkout = TryCatch(async (req, res) => {
  console.log('Checkout started for user:', req.user._id, 'course:', req.params.id);
  const user = await User.findById(req.user._id);
  if (!user) {
    console.log('User not found');
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const course = await Courses.findById(req.params.id);
  if (!course) {
    console.log('Course not found');
    return res.status(404).json({ message: 'Course not found' });
  }

  if (user.subscription.includes(course._id)) {
    console.log('User already subscribed');
    return res.status(400).json({ message: 'You have already subscribed to this course' });
  }

  const options = {
    amount: Number(course.price * 100),
    currency: 'INR',
  };

  console.log('Creating Razorpay order:', options);
  const order = await instance.orders.create(options);
  console.log('Order created:', order);

  res.status(200).json({ order, course });
});

export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;
  if (!isAuthentic) {
    return res.status(400).json({ message: 'Payment verification failed' });
  }

  await Payment.create({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (!user || !course) {
    return res.status(404).json({ message: 'User or course not found' });
  }

  user.subscription.push(course._id);
  await user.save();

  res.status(200).json({
    message: 'Course purchased successfully',
    success: true,
  });
});