"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFeedback = exports.updateFeedbackStatus = exports.getFeedbackById = exports.getAllFeedback = exports.createFeedback = void 0;
const Feedback_1 = require("../models/Feedback");
// Create feedback
const createFeedback = async (req, res) => {
    try {
        const { content, isAnonymous } = req.body;
        const feedback = new Feedback_1.Feedback({
            content,
            isAnonymous,
            submitter: isAnonymous ? null : req.user?.id,
            status: 'New'
        });
        await feedback.save();
        res.status(201).json(feedback);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating feedback' });
    }
};
exports.createFeedback = createFeedback;
// Get all feedback
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback_1.Feedback.find()
            .sort({ createdAt: -1 });
        res.json(feedback);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching feedback' });
    }
};
exports.getAllFeedback = getAllFeedback;
// Get feedback by ID
const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback_1.Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(feedback);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching feedback' });
    }
};
exports.getFeedbackById = getFeedbackById;
// Update feedback status
const updateFeedbackStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const feedback = await Feedback_1.Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(feedback);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating feedback' });
    }
};
exports.updateFeedbackStatus = updateFeedbackStatus;
// Delete feedback
const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback_1.Feedback.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting feedback' });
    }
};
exports.deleteFeedback = deleteFeedback;
