"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const feedbackSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    submitter: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    status: {
        type: String,
        enum: ['New', 'In Action', 'Hold', 'Closed'],
        default: 'New'
    }
}, {
    timestamps: true
});
exports.Feedback = mongoose_1.default.model('Feedback', feedbackSchema);
