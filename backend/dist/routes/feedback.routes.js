"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const feedback_controller_1 = require("../controllers/feedback.controller");
const router = express_1.default.Router();
// Create new feedback
router.post('/', auth_1.authenticate, feedback_controller_1.createFeedback);
// Get all feedback (with optional filters)
router.get('/', auth_1.authenticate, feedback_controller_1.getAllFeedback);
// Get specific feedback by ID
router.get('/:id', auth_1.authenticate, feedback_controller_1.getFeedbackById);
// Update feedback status (leaders only)
router.patch('/:id/status', auth_1.authenticate, (0, auth_1.authorize)(['leader', 'admin']), feedback_controller_1.updateFeedbackStatus);
// Delete feedback (only by original submitter or admin)
router.delete('/:id', auth_1.authenticate, feedback_controller_1.deleteFeedback);
exports.default = router;
