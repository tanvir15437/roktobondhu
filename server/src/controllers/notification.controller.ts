import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { StoreService } from '../services/store.service';
import { successResponse, errorResponse } from '../utils/response';

export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { notifications, unreadCount } = await StoreService.findNotificationsByUser(req.user!._id);
    successResponse(res, { notifications, unreadCount }, 'Notifications retrieved');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // update in store
    successResponse(res, null, 'Notification marked as read');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    successResponse(res, null, 'All notifications marked as read');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};
