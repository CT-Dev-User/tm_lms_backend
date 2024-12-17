import express from 'express';
import { myProfile, register,loginUser } from '../controller/user.js';

import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/user/register' , register)
router.post('/user/login' , loginUser)
router.get('/user/me' , isAuth,myProfile)


export default router;