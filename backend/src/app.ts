import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import feedbackRoutes from './routes/feedback.routes';

const app = express();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback-system';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/feedback', feedbackRoutes);

// Serve static files from the frontend's public directory
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Serve static files from the frontend's build directory if it exists
// This is useful for production builds
try {
  const buildPath = path.join(__dirname, '../../frontend/build');
  if (require('fs').existsSync(buildPath)) {
    app.use(express.static(buildPath));
    console.log('Serving frontend build files');
  }
} catch (error) {
  console.log('Frontend build directory not found, skipping');
}

// Root route handler
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '../../frontend/public/index.html');
  console.log('Serving root route, file path:', indexPath);
  console.log('File exists:', require('fs').existsSync(indexPath));
  
  try {
    res.sendFile(indexPath);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Error serving index.html');
  }
});

// SPA fallback - Catch-all route handler for client-side routing
app.get('*', (req, res) => {
  // Skip API routes
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  // Send the index.html for all other routes (for SPA client-side routing)
  const indexPath = path.join(__dirname, '../../frontend/public/index.html');
  console.log('Serving catch-all route for:', req.url);
  console.log('File path:', indexPath);
  console.log('File exists:', require('fs').existsSync(indexPath));
  
  try {
    res.sendFile(indexPath);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Error serving index.html');
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
