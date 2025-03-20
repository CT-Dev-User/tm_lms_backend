import express from 'express';
import {
    addLectures,
    createCourse,
    deleteCourse,
    deleteLecture,
    getAllStats,
    getAllUser,
    updateRole
} from "../controller/admin.js";
import { 
    createMeeting, 
    updateMeeting, 
    getMeetings,
    deleteMeeting 
} from "../controller/meeting.js";
import { isAdmin, isAuth } from '../middlewares/isAuth.js';
import { uploadFiles } from '../middlewares/multer.js';

const router = express.Router();

router.post('/course/new', isAuth, isAdmin, uploadFiles, createCourse);
router.post('/course/:id', isAuth, isAdmin, uploadFiles, addLectures);
router.delete('/course/:id', isAuth, isAdmin, deleteCourse);
router.delete('/lecture/:id', isAuth, isAdmin, deleteLecture);
router.get('/stats', isAuth, isAdmin, getAllStats);
router.put('/user/:id', isAuth, isAdmin, updateRole);
router.get('/users', isAuth, isAdmin, getAllUser);

/* ============================
   MEETING ROUTES (Updated)
   ============================ */
// Create a meeting for a course
router.post('/course/:courseId/meeting', isAuth, isAdmin, createMeeting);

// Create a meeting for a lecture (if needed)
router.post('/lecture/:lectureId/meeting', isAuth, isAdmin, createMeeting);

// Update an existing meeting
router.put('/meeting/:meetingId', isAuth, isAdmin, updateMeeting);

// Get all meetings for a specific course
router.get('/course/:courseId/meetings', isAuth, isAdmin, getMeetings);

// Delete a meeting
router.delete('/course/:courseId/meeting/:meetingId', isAuth, isAdmin, deleteMeeting);

export default router;
