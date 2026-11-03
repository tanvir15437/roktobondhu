import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { StoreService } from '../services/store.service';
import { CacheService } from '../services/cache.service';
import { successResponse, errorResponse } from '../utils/response';

export const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bloodGroup, division, urgency, status, search, page = '1', limit = '20' } = req.query;

    const cacheKey = `requests:list:${JSON.stringify(req.query)}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      successResponse(res, cached, 'Requests retrieved (cached)');
      return;
    }

    const filter: Record<string, any> = {};

    if (status && status !== 'ALL') {
      filter.status = status;
    } else if (!status) {
      filter.status = { $in: ['active', 'partially_fulfilled'] };
    }

    if (bloodGroup && bloodGroup !== 'ALL') {
      filter.bloodGroup = bloodGroup;
    }

    if (division && division !== 'ALL') {
      filter.division = division;
    }

    if (urgency && urgency !== 'ALL') {
      filter.urgency = (urgency as string).toLowerCase();
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { hospitalName: { $regex: q, $options: 'i' } },
        { hospitalLocation: { $regex: q, $options: 'i' } },
        { patientName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const p = parseInt(page as string, 10) || 1;
    const l = parseInt(limit as string, 10) || 20;
    const skip = (p - 1) * l;

    const { requests, total } = await StoreService.findRequests(filter, l, skip);

    const result = {
      requests,
      pagination: {
        total,
        page: p,
        limit: l,
        pages: Math.ceil(total / l),
      },
    };

    // Cache list for 120 seconds
    await CacheService.set(cacheKey, result, 120);

    successResponse(res, result, 'Blood requests retrieved successfully');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const getUrgentRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = 'requests:urgent';
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      successResponse(res, cached, 'Urgent requests retrieved (cached)');
      return;
    }

    const { requests } = await StoreService.findRequests(
      {
        status: { $in: ['active', 'partially_fulfilled'] },
        urgency: { $in: ['critical', 'urgent'] },
      },
      6,
      0
    );

    await CacheService.set(cacheKey, requests, 60);
    successResponse(res, requests, 'Urgent blood requests retrieved');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const getRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const cacheKey = `requests:detail:${id}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      successResponse(res, cached, 'Request details retrieved (cached)');
      return;
    }

    const bloodRequest = await StoreService.findRequestById(id);
    if (!bloodRequest) {
      errorResponse(res, 'Blood request not found', 404);
      return;
    }

    const connections = await StoreService.findConnectionsByRequest(id);
    const data = {
      ...(bloodRequest.toObject ? bloodRequest.toObject() : bloodRequest),
      responsesCount: connections.length,
    };

    await CacheService.set(cacheKey, data, 180);
    successResponse(res, data, 'Blood request details retrieved');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const createRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requesterId = req.user?._id;
    if (!requesterId) {
      errorResponse(res, 'Authentication required to post blood requests.', 401);
      return;
    }

    const {
      patientName,
      patientRelation,
      bloodGroup,
      unitsRequired,
      hospitalName,
      hospitalLocation,
      division,
      requiredDate,
      requiredTime,
      contactPhone,
      alternatePhone,
      description,
      urgency = 'urgent',
    } = req.body;

    const newRequest = await StoreService.createRequest({
      requesterId,
      patientName,
      patientRelation,
      bloodGroup,
      unitsRequired,
      hospitalName,
      hospitalLocation,
      division,
      requiredDate,
      requiredTime,
      contactPhone,
      alternatePhone: alternatePhone || '',
      description: description || '',
      urgency,
      status: 'active',
    });

    await CacheService.invalidateRequestCaches();

    successResponse(res, newRequest, 'Emergency blood request posted successfully', 201);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const updateRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const bloodRequest = await StoreService.findRequestById(id);

    if (!bloodRequest) {
      errorResponse(res, 'Blood request not found', 404);
      return;
    }

    if (
      bloodRequest.requesterId.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'admin'
    ) {
      errorResponse(res, 'You are not authorized to edit this request', 403);
      return;
    }

    const allowed = [
      'unitsRequired',
      'requiredDate',
      'requiredTime',
      'hospitalName',
      'hospitalLocation',
      'description',
      'contactPhone',
      'urgency',
    ];

    const updates: Record<string, any> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updated = await StoreService.updateRequest(id, updates);
    await CacheService.invalidateRequestCaches();

    successResponse(res, updated, 'Blood request updated successfully');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, unitsFulfilled } = req.body;

    const bloodRequest = await StoreService.findRequestById(id);
    if (!bloodRequest) {
      errorResponse(res, 'Blood request not found', 404);
      return;
    }

    if (
      bloodRequest.requesterId.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'admin'
    ) {
      errorResponse(res, 'Unauthorized', 403);
      return;
    }

    const updateData: Record<string, any> = { status };
    if (unitsFulfilled !== undefined) {
      updateData.unitsFulfilled = unitsFulfilled;
    } else if (status === 'fulfilled') {
      updateData.unitsFulfilled = bloodRequest.unitsRequired;
    }

    const updated = await StoreService.updateRequest(id, updateData);
    await CacheService.invalidateRequestCaches();

    successResponse(res, updated, `Request status updated to "${status}"`);
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const deleteRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const bloodRequest = await StoreService.findRequestById(id);

    if (!bloodRequest) {
      errorResponse(res, 'Request not found', 404);
      return;
    }

    if (
      bloodRequest.requesterId.toString() !== req.user!._id.toString() &&
      req.user!.role !== 'admin'
    ) {
      errorResponse(res, 'Unauthorized', 403);
      return;
    }

    await StoreService.updateRequest(id, { status: 'cancelled' });
    await CacheService.invalidateRequestCaches();

    successResponse(res, null, 'Blood request cancelled successfully');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};

export const getMyRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { requests } = await StoreService.findRequests({
      status: 'ALL',
    });

    const userReqs = requests.filter(
      (r: any) => r.requesterId.toString() === req.user!._id.toString()
    );

    const populated = await Promise.all(
      userReqs.map(async (r: any) => {
        const connections = await StoreService.findConnectionsByRequest(r._id);
        return {
          ...r,
          responsesCount: connections.length,
          contactedDonors: connections.map((c: any) => ({
            id: c._id,
            donorName: c.donorName,
            phone: c.donorPhone,
            timestamp: new Date(c.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          })),
        };
      })
    );

    successResponse(res, populated, 'Your posted requests retrieved');
  } catch (err: any) {
    errorResponse(res, err.message, 500);
  }
};
