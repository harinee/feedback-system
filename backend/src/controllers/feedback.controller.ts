import { ParamsDictionary } from 'express-serve-static-core';
import { Types } from 'mongoose';
import { Feedback, FeedbackStatus, FeedbackTag } from '../models/Feedback';
import { User } from '../models/User';
import {
  TypedRequest,
  TypedResponse,
  ApiResponse,
  FeedbackRequestBody,
  FeedbackQueryParams,
  FeedbackRouteParams,
  FeedbackStatusBody,
  FeedbackTagsBody,
  FeedbackAssignBody,
  FeedbackReplyBody
} from '../types/express';

// Create new feedback
export const createFeedback = async (
  req: TypedRequest<ParamsDictionary, FeedbackRequestBody>,
  res: TypedResponse<ApiResponse>
) => {
  const { content, isAnonymous } = req.body;
  const submitterId = req.user?.id;

  const feedback = await Feedback.create({
    content,
    isAnonymous: isAnonymous || false,
    submitter: isAnonymous ? undefined : submitterId,
    status: FeedbackStatus.New,
    tags: [],
    replies: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return res.status(201).json({
    status: 'success',
    data: feedback
  });
};

// Get all feedback with filters
export const getAllFeedback = async (
  req: TypedRequest<ParamsDictionary, any, FeedbackQueryParams>,
  res: TypedResponse<ApiResponse>
) => {
  const {
    status,
    tag,
    assignedLeader,
    submitter,
    isAnonymous,
    startDate,
    endDate,
    page = '1',
    limit = '10'
  } = req.query;

  const query: any = {};

  if (status) query.status = status;
  if (tag) query.tags = tag;
  if (assignedLeader) query.assignedLeader = assignedLeader;
  if (submitter) query.submitter = submitter;
  if (isAnonymous) query.isAnonymous = isAnonymous === 'true';
  if (startDate) query.createdAt = { $gte: new Date(startDate) };
  if (endDate) query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const feedback = await Feedback.find(query)
    .skip(skip)
    .limit(limitNum)
    .populate('submitter', 'email')
    .populate('assignedLeader', 'email')
    .sort('-createdAt');

  const total = await Feedback.countDocuments(query);

  return res.json({
    status: 'success',
    data: {
      feedback,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total
      }
    }
  });
};

// Get feedback by ID
export const getFeedbackById = async (
  req: TypedRequest<FeedbackRouteParams>,
  res: TypedResponse<ApiResponse>
) => {
  const feedback = await Feedback.findById(req.params.id)
    .populate('submitter', 'email')
    .populate('assignedLeader', 'email')
    .populate('replies.author', 'email');

  if (!feedback) {
    return res.status(404).json({
      status: 'error',
      message: 'Feedback not found'
    });
  }

  return res.json({
    status: 'success',
    data: feedback
  });
};

// Update feedback status
export const updateFeedbackStatus = async (
  req: TypedRequest<FeedbackRouteParams, FeedbackStatusBody>,
  res: TypedResponse<ApiResponse>
) => {
  const { status } = req.body;

  if (!Object.values(FeedbackStatus).includes(status as FeedbackStatus)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid status value'
    });
  }

  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    {
      status,
      updatedAt: new Date()
    },
    { new: true }
  );

  if (!feedback) {
    return res.status(404).json({
      status: 'error',
      message: 'Feedback not found'
    });
  }

  return res.json({
    status: 'success',
    data: feedback
  });
};

// Update feedback tags
export const updateFeedbackTags = async (
  req: TypedRequest<FeedbackRouteParams, FeedbackTagsBody>,
  res: TypedResponse<ApiResponse>
) => {
  const { tags } = req.body;

  const invalidTags = tags.filter(tag => !Object.values(FeedbackTag).includes(tag as FeedbackTag));
  if (invalidTags.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: `Invalid tag(s): ${invalidTags.join(', ')}`
    });
  }

  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    {
      tags,
      updatedAt: new Date()
    },
    { new: true }
  );

  if (!feedback) {
    return res.status(404).json({
      status: 'error',
      message: 'Feedback not found'
    });
  }

  return res.json({
    status: 'success',
    data: feedback
  });
};

// Assign leader to feedback
export const assignLeader = async (
  req: TypedRequest<FeedbackRouteParams, FeedbackAssignBody>,
  res: TypedResponse<ApiResponse>
) => {
  const { leaderId } = req.body;

  // Verify leader exists and has leader role
  const leader = await User.findOne({
    _id: leaderId,
    role: 'Leader'
  });

  if (!leader) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid leader ID'
    });
  }

  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    {
      assignedLeader: leaderId,
      updatedAt: new Date()
    },
    { new: true }
  );

  if (!feedback) {
    return res.status(404).json({
      status: 'error',
      message: 'Feedback not found'
    });
  }

  return res.json({
    status: 'success',
    data: feedback
  });
};

// Add reply to feedback
export const addReply = async (
  req: TypedRequest<FeedbackRouteParams, FeedbackReplyBody>,
  res: TypedResponse<ApiResponse>
) => {
  const { content } = req.body;
  const authorId = req.user?.id;

  if (!authorId) {
    return res.status(401).json({
      status: 'error',
      message: 'User not authenticated'
    });
  }

  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        replies: {
          content,
          author: new Types.ObjectId(authorId),
          createdAt: new Date()
        }
      },
      updatedAt: new Date()
    },
    { new: true }
  ).populate('replies.author', 'email');

  if (!feedback) {
    return res.status(404).json({
      status: 'error',
      message: 'Feedback not found'
    });
  }

  return res.json({
    status: 'success',
    data: feedback
  });
};

// Delete feedback
export const deleteFeedback = async (
  req: TypedRequest<FeedbackRouteParams>,
  res: TypedResponse<ApiResponse>
) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    return res.status(404).json({
      status: 'error',
      message: 'Feedback not found'
    });
  }

  // Only allow deletion if status is 'New'
  if (feedback.status !== FeedbackStatus.New) {
    return res.status(400).json({
      status: 'error',
      message: 'Can only delete feedback with status "New"'
    });
  }

  await feedback.deleteOne();

  return res.json({
    status: 'success',
    message: 'Feedback deleted successfully'
  });
};

// Get feedback metrics for dashboard
export const getFeedbackMetrics = async (
  req: TypedRequest<ParamsDictionary>,
  res: TypedResponse<ApiResponse>
) => {
  const [
    statusMetrics,
    tagMetrics,
    submitterMetrics,
    anonymousCount,
    totalFeedback
  ] = await Promise.all([
    // Status distribution
    Feedback.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    // Tag distribution
    Feedback.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } }
    ]),
    // Top submitters (excluding anonymous)
    Feedback.aggregate([
      { $match: { isAnonymous: false } },
      { $group: { _id: '$submitter', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'submitter'
        }
      },
      { $unwind: '$submitter' },
      {
        $project: {
          _id: 1,
          count: 1,
          'submitter.email': 1
        }
      }
    ]),
    // Anonymous feedback count
    Feedback.countDocuments({ isAnonymous: true }),
    // Total feedback count
    Feedback.countDocuments()
  ]);

  return res.json({
    status: 'success',
    data: {
      statusDistribution: statusMetrics,
      tagDistribution: tagMetrics,
      topSubmitters: submitterMetrics,
      anonymous: {
        count: anonymousCount,
        percentage: (anonymousCount / totalFeedback) * 100
      },
      total: totalFeedback
    }
  });
};
