import { Request, Response, NextFunction, RequestHandler as ExpressRequestHandler } from 'express';
import { UserRole } from '../models/User';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        oktaId: string;
      };
    }
  }
}

export type TypedRequest<
  TParams extends ParamsDictionary = ParamsDictionary,
  TBody = any,
  TQuery extends ParsedQs = ParsedQs
> = Request<TParams, any, TBody, TQuery>;

export type TypedResponse<ResBody = any> = Response<ResBody>;

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export type RequestHandler<
  TParams extends ParamsDictionary = ParamsDictionary,
  TResBody = any,
  TReqBody = any,
  TReqQuery extends ParsedQs = ParsedQs
> = (
  req: TypedRequest<TParams, TReqBody, TReqQuery>,
  res: TypedResponse<TResBody>,
  next: NextFunction
) => Promise<void | Response>;

export interface FeedbackRequestBody {
  content: string;
  isAnonymous?: boolean;
}

export interface FeedbackQueryParams extends ParsedQs {
  status?: string;
  tag?: string;
  assignedLeader?: string;
  submitter?: string;
  isAnonymous?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
}

export interface FeedbackRouteParams extends ParamsDictionary {
  id: string;
}

export interface FeedbackStatusBody {
  status: string;
}

export interface FeedbackTagsBody {
  tags: string[];
}

export interface FeedbackAssignBody {
  leaderId: string;
}

export interface FeedbackReplyBody {
  content: string;
}

export type RouterMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type RouteConfig<
  TParams extends ParamsDictionary = ParamsDictionary,
  TBody = any,
  TQuery extends ParsedQs = ParsedQs
> = {
  method: RouterMethod;
  path: string;
  handler: RequestHandler<TParams, ApiResponse, TBody, TQuery>;
  middleware?: ExpressRequestHandler[];
};

export type AsyncHandler = ExpressRequestHandler;
export type SyncHandler = ExpressRequestHandler;
export type Middleware = ExpressRequestHandler;
