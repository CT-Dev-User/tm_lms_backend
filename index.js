// // index.js
// import express from 'express';
// import dotenv from 'dotenv';
// import { conn } from './database/db.js';
// import cors from 'cors';
// import Razorpay from 'razorpay';
// import { v2 as cloudinary } from 'cloudinary';

// // Load environment variables
// dotenv.config();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
//   api_key: process.env.CLOUDINARY_API_KEY ,
//   api_secret: process.env.CLOUDINARY_API_SECRET ,
// });

// // Razorpay instance
// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Initialize Express app
// const app = express();

// // Middlewares
// app.use(cors({
//   origin: ['https://main.d129psxc1ttzi.amplifyapp.com'], // Specify your frontend domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'token'],
//   credentials: true // Enable credentials (cookies, authorization headers)
// }));
// app.use(express.json());


// // Database connection
// conn();

// // Health check endpoint
// app.get('/', (req, res) => {
//   res.send('Server is working');
// });

// // Serve static files (optional, remove if fully using Cloudinary)
// app.use('/uploads', express.static('uploads'));

// // Routes
// import userRoutes from './routes/user.js';
// import courseRoutes from './routes/course.js';
// import adminRoutes from './routes/admin.js';

// app.use('/api', userRoutes);
// app.use('/api', courseRoutes);
// app.use('/api', adminRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Server error:', err.stack);
//   res.status(500).json({ message: 'Internal Server Error', error: err.message });
// });

// export default app;
import express from 'express';
import dotenv from 'dotenv';
import { conn } from './database/db.js';
import cors from 'cors';
import Razorpay from 'razorpay';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Razorpay instance
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Express app
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://main.d129psxc1ttzi.amplifyapp.com' : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Server is working');
});

// Routes
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';

app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Database connection
conn();

// Export Express app for Vercel
export default app;
