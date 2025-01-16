import { Router, Request, Response, NextFunction, RequestHandler as ExpressRequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  updateFeedbackTags,
  assignLeader,
  addReply,
  deleteFeedback,
  getFeedbackMetrics
} from '../controllers/feedback.controller';
import {
  authenticateJWT,
  optionalAuth,
  requirePermission,
  requireOwnership
} from '../middleware/auth';
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
  FeedbackReplyBody,
  RequestHandler
} from '../types/express';

const router = Router();

// Helper to wrap async handlers
const asyncHandler = <P extends ParamsDictionary, B, Q extends ParsedQs>(
  handler: RequestHandler<P, ApiResponse, B, Q>
): ExpressRequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(
      req as TypedRequest<P, B, Q>,
      res as TypedResponse<ApiResponse>,
      next
    )).catch(next);
  };
};

// Public routes (with optional authentication)
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Feedback service is healthy' });
});

// Routes that allow anonymous access
router.post('/', optionalAuth, asyncHandler<ParamsDictionary, FeedbackRequestBody, ParsedQs>(createFeedback));

// Protected routes
router.use(authenticateJWT); // All routes below this require authentication

// Employee routes
router.get(
  '/my-feedback',
  requirePermission('view:own-feedback'),
  asyncHandler<ParamsDictionary, any, FeedbackQueryParams>(getAllFeedback)
);

// Leader routes
router.patch(
  '/:id/status',
  requirePermission('manage:feedback'),
  asyncHandler<FeedbackRouteParams, FeedbackStatusBody, ParsedQs>(updateFeedbackStatus)
);

router.patch(
  '/:id/tags',
  requirePermission('manage:feedback'),
  asyncHandler<FeedbackRouteParams, FeedbackTagsBody, ParsedQs>(updateFeedbackTags)
);

router.patch(
  '/:id/assign',
  requirePermission('manage:feedback'),
  asyncHandler<FeedbackRouteParams, FeedbackAssignBody, ParsedQs>(assignLeader)
);

// Routes with mixed permissions
router.get(
  '/',
  requirePermission('view:feedback'),
  asyncHandler<ParamsDictionary, any, FeedbackQueryParams>(getAllFeedback)
);

router.get(
  '/:id',
  requirePermission('view:feedback'),
  asyncHandler<FeedbackRouteParams, any, ParsedQs>(getFeedbackById)
);

router.delete(
  '/:id',
  [requirePermission('delete:own-feedback'), requireOwnership('id')],
  asyncHandler<FeedbackRouteParams, any, ParsedQs>(deleteFeedback)
);

router.post(
  '/:id/replies',
  requirePermission('respond:feedback'),
  asyncHandler<FeedbackRouteParams, FeedbackReplyBody, ParsedQs>(addReply)
);

// Metrics route (admin/leader only)
router.get(
  '/metrics/dashboard',
  requirePermission('view:metrics'),
  asyncHandler<ParamsDictionary, any, ParsedQs>(getFeedbackMetrics)
);

// Error handling for unsupported methods
router.all('*', (_req: Request, res: Response) => {
  res.status(405).json({
    status: 'error',
    message: `${_req.method} method is not supported on this endpoint`
  });
});

export default router;
