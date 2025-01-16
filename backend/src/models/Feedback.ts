import { Schema, model, Document, Types } from 'mongoose';

export enum FeedbackStatus {
  New = 'New',
  InAction = 'In Action',
  Hold = 'Hold',
  Closed = 'Closed'
}

export enum FeedbackTag {
  Important = 'Important',
  NotRelevant = 'Not Relevant'
}

export interface IReply {
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
}

export interface IFeedback extends Document {
  content: string;
  isAnonymous: boolean;
  submitter?: Types.ObjectId;
  assignedLeader?: Types.ObjectId;
  status: FeedbackStatus;
  tags: FeedbackTag[];
  replies: IReply[];
  createdAt: Date;
  updatedAt: Date;
}

const replySchema = new Schema<IReply>({
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const feedbackSchema = new Schema<IFeedback>({
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
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedLeader: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: Object.values(FeedbackStatus),
    default: FeedbackStatus.New
  },
  tags: [{
    type: String,
    enum: Object.values(FeedbackTag)
  }],
  replies: [replySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt timestamp
feedbackSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ tags: 1 });
feedbackSchema.index({ assignedLeader: 1 });
feedbackSchema.index({ submitter: 1 });
feedbackSchema.index({ createdAt: -1 });

export const Feedback = model<IFeedback>('Feedback', feedbackSchema);
