import type { Request, Response } from 'express';
import { Feedback } from '../models/Feedback';

// Create feedback
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { content, isAnonymous } = req.body;
    const feedback = new Feedback({
      content,
      isAnonymous,
      submitter: isAnonymous ? null : req.user?.id,
      status: 'New'
    });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error creating feedback' });
  }
};

// Get all feedback
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback' });
  }
};

// Update feedback status
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback' });
  }
};

// Delete feedback
export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Only allow deletion by submitter or admin
    if (feedback.submitter && 
        feedback.submitter.toString() !== req.user?.id && 
        req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }

    await feedback.deleteOne();
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback' });
  }
};
