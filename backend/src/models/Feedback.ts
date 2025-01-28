import mongoose from 'mongoose';

export interface IFeedback {
  content: string;
  isAnonymous: boolean;
  submitter?: string;
  status: 'New' | 'In Action' | 'Hold' | 'Closed';
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new mongoose.Schema<IFeedback>({
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
    type: mongoose.Schema.Types.ObjectId,
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

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
