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
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Razorpay instance
// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middlewares
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' ? 'https://your-production-url.com' : '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'token'],
// }));
// app.use(express.json({ limit: '10mb' })); // For JSON payloads
// app.use(express.urlencoded({ limit: '10mb', extended: true })); // For form data

// // Health check endpoint
// app.get('/', (req, res) => {
//   res.send('Server is working');
// });

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

// // Start server and connect to DB
// const startServer = async () => {
//   try {
//     await conn();
//     console.log('Database connected');
//     app.listen(PORT, () => {
//       console.log(`Server running @ http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };
// export const handler = serverless(app);



// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import Razorpay from 'razorpay';
// import { v2 as cloudinary } from 'cloudinary';
// import serverless from 'serverless-http';

// import { conn } from './database/db.js';
// import userRoutes from './routes/user.js';
// import courseRoutes from './routes/course.js';
// import adminRoutes from './routes/admin.js';

// // Load environment variables
// dotenv.config();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Razorpay instance
// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middlewares
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' ? 'https://your-production-url.com' : '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'token'],
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));

// // Health check route
// app.get('/', (req, res) => {
//   res.send('Server is working');
// });

// // API Routes
// app.use('/api', userRoutes);
// app.use('/api', courseRoutes);
// app.use('/api', adminRoutes);

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('Server Error:', err.stack);
//   res.status(500).json({ message: 'Internal Server Error', error: err.message });
// });

// // Start server and connect DB (only when not serverless)
// const startServer = async () => {
//   try {
//     await conn();
//     console.log('Database connected');
//     app.listen(PORT, () => {
//       console.log(`Server running @ http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// if (process.env.RUN_MODE !== 'serverless') {
//   startServer();
// }

// export const handler = serverless(app);


import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Razorpay from 'razorpay';
import { v2 as cloudinary } from 'cloudinary';
import serverless from 'serverless-http';

import { conn } from './database/db.js';
import userRoutes from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Razorpay instance export
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = [
  'https://lms.techmomentum.in',
  'https://www.lms.techmomentum.in',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files if any
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/', (req, res) => {
  res.send('Server is working');
});

// API routes
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server in non-serverless mode
const startServer = async () => {
  try {
    await conn();
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running @ http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Conditional server start
if (process.env.RUN_MODE !== 'serverless') {
  startServer();
} else {
  // Cold start DB connection for serverless
  conn().then(() => console.log('DB connected (serverless mode)')).catch(err => {
    console.error('DB connection error (serverless):', err);
  });
}

// Export for serverless deployment
export const handler = serverless(app);

