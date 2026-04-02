import { Response } from 'express';
import User from '../models/User';
import { BaseController } from './base.controller';
import { AuthRequest } from '../types/auth.types';

class UserController extends BaseController {
  // Get all users except current user
  public getUsers = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const currentUserId = this.getUserId(req); // Now this works with authUser

      const users = await User.find({
        _id: { $ne: currentUserId }
      }).select('name email avatar role createdAt');

      return this.sendSuccess(res, users, 'Users retrieved successfully');
    } catch (error) {
      return this.sendError(res, 'Failed to get users', 500, error);
    }
  };

  // Search users by name or email
  public searchUsers = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const currentUserId = this.getUserId(req);
      const { query } = req.query;

      if (!query || typeof query !== 'string') {
        return this.sendError(res, 'Search query is required', 400);
      }

      const users = await User.find({
        $and: [
          { _id: { $ne: currentUserId } },
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { email: { $regex: query, $options: 'i' } }
            ]
          }
        ]
      }).select('name email avatar role');

      return this.sendSuccess(res, users, 'Users searched successfully');
    } catch (error) {
      return this.sendError(res, 'Failed to search users', 500, error);
    }
  };

  // Get user profile by ID
  public getUserProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId).select('name email avatar role country language');

      if (!user) {
        return this.sendError(res, 'User not found', 404);
      }

      return this.sendSuccess(res, user, 'User profile retrieved successfully');
    } catch (error) {
      return this.sendError(res, 'Failed to get user profile', 500, error);
    }
  };

  // Get current user profile
  public getCurrentUser = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const currentUserId = this.getUserId(req);

      const user = await User.findById(currentUserId)
        .select('-password')
        .populate('donationHistory');

      if (!user) {
        return this.sendError(res, 'User not found', 404);
      }

      return this.sendSuccess(res, user, 'Current user profile retrieved successfully');
    } catch (error) {
      return this.sendError(res, 'Failed to get current user', 500, error);
    }
  };
}

// Export individual methods
export const {
  getUsers,
  searchUsers,
  getUserProfile,
  getCurrentUser
} = new UserController();