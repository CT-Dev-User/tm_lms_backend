import express from 'express';
import {
  addLectures,
  createAssignment,
  createCourse,
  deleteAssignment,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  getAssignmentsByCourse,
  getAssignmentSubmissions,
  submitAssignment,
  updateRole,
  updateSubmissionMarks,
} from '../controller/admin.js';
import {
  createMeeting,
  deleteMeeting,
  getMeetings,
  updateMeeting,
} from '../controller/meeting.js';
import { isAdmin, isAuth, isInstructorOrAdmin } from '../middlewares/isAuth.js';
import { uploadFiles } from '../middlewares/multer.js';
import Payout from '../models/instructor.js';
const router = express.Router();

// Admin-only routes (create/delete courses, lectures, meetings)
router.post('/course/new', isAuth, isAdmin, uploadFiles, createCourse);
router.post('/course/:id', isAuth, isAdmin, uploadFiles, addLectures);
router.delete('/course/:id', isAuth, isAdmin, deleteCourse);
router.delete('/lecture/:id', isAuth, isAdmin, deleteLecture);
router.post('/course/:courseId/meeting', isAuth, isAdmin, createMeeting);
router.post('/lecture/:lectureId/meeting', isAuth, isAdmin, createMeeting);
router.delete('/course/:courseId/meeting/:meetingId', isAuth, isAdmin, deleteMeeting);

// Instructor or Admin routes (viewing stats, users, updating meetings, assignments)
router.get('/stats', isAuth, isInstructorOrAdmin, getAllStats);
router.get('/users', isAuth, isInstructorOrAdmin, getAllUser);
router.put('/meeting/:meetingId', isAuth, isInstructorOrAdmin, updateMeeting);
router.get('/course/:courseId/meetings', isAuth, isInstructorOrAdmin, getMeetings);

// Assignment routes
router.post('/course/:courseId/assignment', isAuth, isInstructorOrAdmin, createAssignment);
router.get('/course/:courseId/assignments', isAuth, getAssignmentsByCourse);
router.post('/assignment/:assignmentId/submit', isAuth, submitAssignment);
router.delete('/assignment/:assignmentId', isAuth, isInstructorOrAdmin, deleteAssignment);

// Submission management routes
router.get('/assignment/:assignmentId/submissions', isAuth, isInstructorOrAdmin, getAssignmentSubmissions);
router.put('/assignment/:assignmentId/submission/:submissionId', isAuth, isInstructorOrAdmin, updateSubmissionMarks);

// Role update (admin only)
router.put('/user/:id', isAuth, isAdmin, updateRole);



// Then add these routes (or uncomment and fix them if they're already there)
router.get('/withdrawal-requests', isAuth, isAdmin, async (req, res) => {
  try {
    // Fetch all withdrawal requests with instructor details
    const requests = await Payout.find()
      .populate('instructorId', 'name email')
      .sort({ dateRequested: -1 });
    
    // Format the data for frontend
    const formattedRequests = requests.map(req => ({
      _id: req._id,
      instructorId: req.instructorId._id,
      instructorName: req.instructorId.name,
      instructorEmail: req.instructorId.email,
      amount: req.amount,
      status: req.status,
      dateRequested: req.dateRequested,
      dateProcessed: req.dateProcessed
    }));
    
    res.status(200).json({ success: true, requests: formattedRequests });
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch withdrawal requests' });
  }
});

// Update the withdrawal request update endpoint
router.put('/withdrawal-requests/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['pending', 'processed', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status value: ${status}. Must be one of: pending, processed, approved, rejected` 
      });
    }
    
    const withdrawalRequest = await Payout.findById(id);
    
    if (!withdrawalRequest) {
      return res.status(404).json({ success: false, message: 'Withdrawal request not found' });
    }
    
    withdrawalRequest.status = status;
    
    // Only set dateProcessed if the status is changing from pending
    if (withdrawalRequest.status !== 'pending' && !withdrawalRequest.dateProcessed) {
      withdrawalRequest.dateProcessed = new Date();
    }
    
    await withdrawalRequest.save();
    
    res.status(200).json({ 
      success: true, 
      message: `Withdrawal request ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'} successfully` 
    });
  } catch (error) {
    console.error('Error updating withdrawal request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update withdrawal request',
      error: error.message 
    });
  }
});

export default router;