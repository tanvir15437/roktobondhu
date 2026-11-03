import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { StoreService } from '../services/store.service';
import { successResponse, errorResponse } from '../utils/response';

export const createConnection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { requestId, contactMethod = 'call', donorName, donorPhone } = req.body;

    const bloodRequest = await StoreService.findRequestById(requestId);
    if (!bloodRequest) {
      errorResponse(res, 'Blood request not found', 404);
      return;
    }

    const callerName = donorName || req.user?.name || 'Anonymous Donor';
    const callerPhone = donorPhone || req.user?.phone || 'Confidential';
    const donorId = req.user?._id || bloodRequest.requesterId;

    const connection = await StoreService.createConnection({
      requestId: bloodRequest._id,
      donorId,
      requesterId: bloodRequest.requesterId,
      contactMethod,
      status: 'contacted',
      donorName: callerName,
      donorPhone: callerPhone,
    });

    await StoreService.createNotification({
      recipientId: bloodRequest.requesterId,
      title: 'Donor Responded to Your Blood Request',
      message: `${callerName} (${callerPhone}) reached out to help with your ${bloodRequest.bloodGroup} requirement at ${bloodRequest.hospitalName}.`,
      type: 'donor_contacted',
      relatedRequestId: bloodRequest._id,
    });

    successResponse(res, connection, 'Connection recorded successfully', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const getRequestConnections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const connections = await StoreService.findConnectionsByRequest(requestId);
    successResponse(res, connections, 'Connections retrieved for request');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const getMyConnections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const connections = await StoreService.findConnectionsByRequest(userId);
    successResponse(res, connections, 'Your connection history retrieved');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};
