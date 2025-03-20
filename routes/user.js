import express from 'express';
import { forgotPassword, loginUser, myProfile, register, resetPassword, updateProfile, verifyUser } from '../controller/user.js';
import { isAuth } from '../middlewares/isAuth.js';
import { getMeetings} from '../controller/meeting.js'

const router = express.Router();

router.post('/user/register' , register)
router.post('/user/verify' , verifyUser)
router.post('/user/login' , loginUser)
router.get('/user/me' , isAuth,myProfile)
router.get('/lecture/:courseId/meetings', isAuth, getMeetings);
router.post('/user/forgot-password', forgotPassword);
router.post('/user/reset-password', resetPassword);
router.put('/user/update-profile', isAuth, updateProfile);

export default router;