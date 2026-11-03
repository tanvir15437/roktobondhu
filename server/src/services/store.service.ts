import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User.model';
import { BloodRequest, IBloodRequest } from '../models/BloodRequest.model';
import { Donation, IDonation } from '../models/Donation.model';
import { Connection, IConnection } from '../models/Connection.model';
import { Notification, INotification } from '../models/Notification.model';

// In-Memory collections for resilient standalone mode
let memoryUsers: any[] = [];
let memoryRequests: any[] = [];
let memoryDonations: any[] = [];
let memoryConnections: any[] = [];
let memoryNotifications: any[] = [];

// Initialize memory store with realistic Bangladesh dataset
export const initMemoryStore = async () => {
  if (memoryUsers.length > 0) return;

  const defaultHash = await bcrypt.hash('password123', 10);

  const rahimId = new mongoose.Types.ObjectId().toString();
  const tanjilId = new mongoose.Types.ObjectId().toString();

  memoryUsers = [
    {
      _id: rahimId,
      name: 'Rahim Ahmed',
      email: 'rahim.ahmed@example.com',
      phone: '+880 1712-345678',
      passwordHash: defaultHash,
      bloodGroup: 'O+',
      division: 'Dhaka',
      location: 'Dhanmondi, Dhaka',
      role: 'user',
      isAvailable: true,
      lastDonationDate: '2026-09-12',
      nextEligibleDate: '2026-12-15',
      totalDonations: 8,
      settings: {
        smsUrgentAlerts: true,
        emailDigest: false,
        hidePhoneUntilContact: false,
        showInDonorDirectory: true,
      },
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date(),
    },
    {
      _id: tanjilId,
      name: 'Tanjil Hasan',
      email: 'tanjil.hasan@example.com',
      phone: '+880 1819-234567',
      passwordHash: defaultHash,
      bloodGroup: 'B+',
      division: 'Dhaka',
      location: 'Shahbagh, Dhaka',
      role: 'user',
      isAvailable: true,
      totalDonations: 2,
      lastDonationDate: '2025-11-20',
      nextEligibleDate: '2026-02-20',
      settings: {
        smsUrgentAlerts: true,
        emailDigest: false,
        hidePhoneUntilContact: false,
        showInDonorDirectory: true,
      },
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date(),
    },
  ];

  memoryRequests = [
    {
      _id: 'req-001',
      requesterId: tanjilId,
      patientName: 'Rahim Ahmed',
      patientRelation: 'Father',
      bloodGroup: 'O+',
      unitsRequired: 2,
      unitsFulfilled: 0,
      hospitalName: 'Dhaka Medical College Hospital',
      hospitalLocation: 'Shahbagh, Dhaka',
      division: 'Dhaka',
      requiredDate: '2026-11-03',
      requiredTime: '07:00 PM',
      contactPhone: '+880 1819-234567',
      alternatePhone: '+880 1711-987654',
      description:
        'Urgent requirement for immediate abdominal surgery at DMCH Emergency Surgery Ward 4.',
      urgency: 'critical',
      status: 'active',
      createdAt: new Date(Date.now() - 24 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      _id: 'req-002',
      requesterId: tanjilId,
      patientName: 'Kazi Shariful Islam',
      patientRelation: 'Brother',
      bloodGroup: 'A+',
      unitsRequired: 1,
      unitsFulfilled: 0,
      hospitalName: 'Sher-e-Bangla Medical College Hospital',
      hospitalLocation: 'Band Road, Barishal',
      division: 'Barishal',
      requiredDate: '2026-11-03',
      requiredTime: '08:30 PM',
      contactPhone: '+880 1715-889900',
      description: 'Road traffic accident trauma victim. Attendants are at SBMC blood bank counter.',
      urgency: 'urgent',
      status: 'active',
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      _id: 'req-003',
      requesterId: tanjilId,
      patientName: 'Nusrat Jahan',
      patientRelation: 'Mother',
      bloodGroup: 'B+',
      unitsRequired: 3,
      unitsFulfilled: 1,
      hospitalName: 'Chattogram Medical College Hospital',
      hospitalLocation: 'Panchlaish, Chattogram',
      division: 'Chattogram',
      requiredDate: '2026-11-03',
      requiredTime: '06:00 PM',
      contactPhone: '+880 1819-776655',
      description: 'Emergency cesarean section transfusion needed. 1 unit managed, 2 more required.',
      urgency: 'critical',
      status: 'partially_fulfilled',
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      _id: 'req-004',
      requesterId: rahimId,
      patientName: 'Shamima Nasrin',
      patientRelation: 'Self',
      bloodGroup: 'AB-',
      unitsRequired: 1,
      unitsFulfilled: 0,
      hospitalName: 'Evercare Hospital Dhaka',
      hospitalLocation: 'Bashundhara R/A, Dhaka',
      division: 'Dhaka',
      requiredDate: '2026-11-04',
      requiredTime: '10:00 AM',
      contactPhone: '+880 1718-443322',
      description: 'Rare AB- blood requirement for orthopedic reconstructive surgery.',
      urgency: 'normal',
      status: 'active',
      createdAt: new Date(Date.now() - 120 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      _id: 'req-005',
      requesterId: tanjilId,
      patientName: 'Tariqul Islam',
      patientRelation: 'Uncle',
      bloodGroup: 'O-',
      unitsRequired: 2,
      unitsFulfilled: 0,
      hospitalName: 'Rajshahi Medical College Hospital',
      hospitalLocation: 'Laxmipur, Rajshahi',
      division: 'Rajshahi',
      requiredDate: '2026-11-03',
      requiredTime: '09:00 PM',
      contactPhone: '+880 1913-665544',
      description: 'Universal donor O- needed urgently for internal hemorrhage patient.',
      urgency: 'critical',
      status: 'active',
      createdAt: new Date(Date.now() - 180 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      _id: 'req-008',
      requesterId: rahimId,
      patientName: 'Monirul Islam',
      patientRelation: 'Brother-in-law',
      bloodGroup: 'O+',
      unitsRequired: 2,
      unitsFulfilled: 2,
      hospitalName: 'Square Hospital',
      hospitalLocation: 'Panthapath, Dhaka',
      division: 'Dhaka',
      requiredDate: '2026-11-02',
      requiredTime: '05:00 PM',
      contactPhone: '+880 1714-332211',
      description: 'Transfusion completed safely via RoktoBondhu volunteer donors.',
      urgency: 'urgent',
      status: 'fulfilled',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];

  memoryDonations = [
    {
      _id: 'don-001',
      donorId: rahimId,
      donationDate: '2026-09-12',
      hospitalName: 'Chattogram Medical College Hospital',
      location: 'Chattogram',
      bloodGroup: 'O+',
      units: 1,
      notes: 'Voluntary response for pediatric cardiac emergency.',
      verified: true,
      createdAt: new Date('2026-09-12'),
    },
    {
      _id: 'don-002',
      donorId: rahimId,
      donationDate: '2026-06-18',
      hospitalName: 'Popular Diagnostic Centre',
      location: 'Dhanmondi, Dhaka',
      bloodGroup: 'O+',
      units: 1,
      notes: 'Emergency blood request fulfilled via RoktoBondhu.',
      verified: true,
      createdAt: new Date('2026-06-18'),
    },
    {
      _id: 'don-003',
      donorId: rahimId,
      donationDate: '2026-02-10',
      hospitalName: 'Dhaka Medical College Hospital',
      location: 'Shahbagh, Dhaka',
      bloodGroup: 'O+',
      units: 1,
      notes: 'National Youth Blood Donation Drive volunteer camp.',
      verified: true,
      createdAt: new Date('2026-02-10'),
    },
  ];
};

export class StoreService {
  static isMongoLive(): boolean {
    return mongoose.connection.readyState === 1;
  }

  // USER OPERATIONS
  static async findUserByEmailOrPhone(identifier: string) {
    if (this.isMongoLive()) {
      return User.findOne({
        $or: [{ email: identifier.toLowerCase().trim() }, { phone: identifier.trim() }],
      }).select('+passwordHash');
    }
    await initMemoryStore();
    const idClean = identifier.trim().toLowerCase();
    return (
      memoryUsers.find(
        (u) => u.email.toLowerCase() === idClean || u.phone.replace(/[\s-]/g, '') === idClean.replace(/[\s-]/g, '')
      ) || null
    );
  }

  static async findUserById(id: string) {
    if (this.isMongoLive()) {
      return User.findById(id);
    }
    await initMemoryStore();
    return memoryUsers.find((u) => u._id.toString() === id.toString()) || null;
  }

  static async createUser(userData: any) {
    if (this.isMongoLive()) {
      return User.create(userData);
    }
    await initMemoryStore();
    const newUser = {
      ...userData,
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryUsers.push(newUser);
    return newUser;
  }

  static async updateUser(id: string, updates: any) {
    if (this.isMongoLive()) {
      return User.findByIdAndUpdate(id, { $set: updates }, { new: true });
    }
    await initMemoryStore();
    const user = memoryUsers.find((u) => u._id.toString() === id.toString());
    if (!user) return null;
    Object.assign(user, updates, { updatedAt: new Date() });
    return user;
  }

  static async findDonors(filter: any) {
    if (this.isMongoLive()) {
      return User.find(filter)
        .select('name bloodGroup division location isAvailable totalDonations lastDonationDate nextEligibleDate')
        .limit(50)
        .lean();
    }
    await initMemoryStore();
    return memoryUsers.filter((u) => {
      if (filter.bloodGroup && u.bloodGroup !== filter.bloodGroup) return false;
      if (filter.division && u.division !== filter.division) return false;
      if (filter.isAvailable !== undefined && u.isAvailable !== filter.isAvailable) return false;
      return true;
    });
  }

  // REQUEST OPERATIONS
  static async findRequests(filter: any, limit = 20, skip = 0) {
    if (this.isMongoLive()) {
      const [requests, total] = await Promise.all([
        BloodRequest.find(filter)
          .populate('requesterId', 'name phone')
          .sort({ urgency: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        BloodRequest.countDocuments(filter),
      ]);
      return { requests, total };
    }
    await initMemoryStore();
    let res = [...memoryRequests];

    if (filter.status && typeof filter.status === 'string') {
      res = res.filter((r) => r.status === filter.status);
    } else if (filter.status?.$in) {
      res = res.filter((r) => filter.status.$in.includes(r.status));
    }

    if (filter.bloodGroup) {
      res = res.filter((r) => r.bloodGroup === filter.bloodGroup);
    }

    if (filter.division) {
      res = res.filter((r) => r.division === filter.division);
    }

    if (filter.urgency) {
      if (typeof filter.urgency === 'string') {
        res = res.filter((r) => r.urgency === filter.urgency);
      } else if (filter.urgency.$in) {
        res = res.filter((r) => filter.urgency.$in.includes(r.urgency));
      }
    }

    if (filter.$or) {
      // search query
      const q = filter.$or[0].hospitalName.$regex.toLowerCase();
      res = res.filter(
        (r) =>
          r.hospitalName.toLowerCase().includes(q) ||
          r.hospitalLocation.toLowerCase().includes(q) ||
          r.patientName.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    // Sort: critical first, then urgent, then normal
    const urgencyOrder: Record<string, number> = { critical: 3, urgent: 2, normal: 1 };
    res.sort((a, b) => {
      const diff = (urgencyOrder[b.urgency] || 0) - (urgencyOrder[a.urgency] || 0);
      if (diff !== 0) return diff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = res.length;
    const paginated = res.slice(skip, skip + limit);
    return { requests: paginated, total };
  }

  static async findRequestById(id: string) {
    if (this.isMongoLive()) {
      return BloodRequest.findById(id).populate('requesterId', 'name phone');
    }
    await initMemoryStore();
    return memoryRequests.find((r) => r._id.toString() === id.toString()) || null;
  }

  static async createRequest(data: any) {
    if (this.isMongoLive()) {
      return BloodRequest.create(data);
    }
    await initMemoryStore();
    const newReq = {
      ...data,
      _id: `req-${Date.now().toString().slice(-4)}`,
      unitsFulfilled: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryRequests.unshift(newReq);
    return newReq;
  }

  static async updateRequest(id: string, updates: any) {
    if (this.isMongoLive()) {
      return BloodRequest.findByIdAndUpdate(id, { $set: updates }, { new: true });
    }
    await initMemoryStore();
    const req = memoryRequests.find((r) => r._id.toString() === id.toString());
    if (!req) return null;
    Object.assign(req, updates, { updatedAt: new Date() });
    return req;
  }

  // DONATIONS OPERATIONS
  static async findDonationsByDonor(donorId: string) {
    if (this.isMongoLive()) {
      return Donation.find({ donorId }).sort({ donationDate: -1 }).lean();
    }
    await initMemoryStore();
    return memoryDonations
      .filter((d) => d.donorId.toString() === donorId.toString())
      .sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime());
  }

  static async createDonation(data: any) {
    if (this.isMongoLive()) {
      return Donation.create(data);
    }
    await initMemoryStore();
    const newDonation = {
      ...data,
      _id: `don-${Date.now().toString().slice(-4)}`,
      verified: true,
      createdAt: new Date(),
    };
    memoryDonations.unshift(newDonation);
    return newDonation;
  }

  static async deleteDonation(id: string, donorId: string) {
    if (this.isMongoLive()) {
      return Donation.findOneAndDelete({ _id: id, donorId });
    }
    await initMemoryStore();
    const index = memoryDonations.findIndex(
      (d) => d._id.toString() === id.toString() && d.donorId.toString() === donorId.toString()
    );
    if (index !== -1) {
      const removed = memoryDonations.splice(index, 1)[0];
      return removed;
    }
    return null;
  }

  // CONNECTIONS OPERATIONS
  static async createConnection(data: any) {
    if (this.isMongoLive()) {
      return Connection.create(data);
    }
    await initMemoryStore();
    const newConn = {
      ...data,
      _id: `cd-${Date.now()}`,
      createdAt: new Date(),
    };
    memoryConnections.unshift(newConn);
    return newConn;
  }

  static async findConnectionsByRequest(requestId: string) {
    if (this.isMongoLive()) {
      return Connection.find({ requestId }).sort({ createdAt: -1 }).lean();
    }
    await initMemoryStore();
    return memoryConnections.filter((c) => c.requestId.toString() === requestId.toString());
  }

  // NOTIFICATIONS OPERATIONS
  static async createNotification(data: any) {
    if (this.isMongoLive()) {
      return Notification.create(data);
    }
    await initMemoryStore();
    const notif = {
      ...data,
      _id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date(),
    };
    memoryNotifications.unshift(notif);
    return notif;
  }

  static async findNotificationsByUser(userId: string) {
    if (this.isMongoLive()) {
      const [notifications, unreadCount] = await Promise.all([
        Notification.find({ recipientId: userId }).sort({ createdAt: -1 }).limit(30).lean(),
        Notification.countDocuments({ recipientId: userId, isRead: false }),
      ]);
      return { notifications, unreadCount };
    }
    await initMemoryStore();
    const userNotifs = memoryNotifications.filter((n) => n.recipientId.toString() === userId.toString());
    const unreadCount = userNotifs.filter((n) => !n.isRead).length;
    return { notifications: userNotifs, unreadCount };
  }
}
