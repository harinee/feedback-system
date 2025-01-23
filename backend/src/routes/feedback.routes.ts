import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  createFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback
} from '../controllers/feedback.controller';

const router = express.Router();

// Create new feedback
router.post('/', authenticate, createFeedback);

// Get all feedback (with optional filters)
router.get('/', authenticate, getFeedback);

// Get specific feedback by ID
router.get('/:id', authenticate, getFeedbackById);

// Update feedback status (leaders only)
router.patch('/:id/status', authenticate, authorize(['leader', 'admin']), updateFeedbackStatus);

// Delete feedback (only by original submitter or admin)
router.delete('/:id', authenticate, deleteFeedback);

export default router;
