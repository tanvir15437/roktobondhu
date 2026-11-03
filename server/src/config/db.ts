import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ENV } from './env';
import { User } from '../models/User.model';
import { BloodRequest } from '../models/BloodRequest.model';
import { Donation } from '../models/Donation.model';

export const connectDB = async (): Promise<boolean> => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to ${ENV.MONGODB_URI}`);
    await seedInitialData();
    return true;
  } catch (err: any) {
    console.warn(
      `[MongoDB] Notice: Could not connect to MongoDB (${err.message}). Set MONGODB_URI in .env to point to your MongoDB instance or Atlas cluster.`
    );
    return false;
  }
};

/**
 * Seed initial realistic Bangladeshi mock data if database is fresh
 */
export const seedInitialData = async (): Promise<void> => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    console.log('[MongoDB] Seeding initial Bangladesh mock dataset...');

    const defaultPasswordHash = await bcrypt.hash('password123', 10);

    // 1. Create Default Donor (Rahim Ahmed)
    const donorUser = await User.create({
      name: 'Rahim Ahmed',
      email: 'rahim.ahmed@example.com',
      phone: '+880 1712-345678',
      passwordHash: defaultPasswordHash,
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
    });

    // 2. Create Default Requester (Tanjil Hasan)
    const requesterUser = await User.create({
      name: 'Tanjil Hasan',
      email: 'tanjil.hasan@example.com',
      phone: '+880 1819-234567',
      passwordHash: defaultPasswordHash,
      bloodGroup: 'B+',
      division: 'Dhaka',
      location: 'Shahbagh, Dhaka',
      role: 'user',
      isAvailable: true,
      totalDonations: 2,
      lastDonationDate: '2025-11-20',
      nextEligibleDate: '2026-02-20',
    });

    // 3. Create Sample Blood Requests
    await BloodRequest.create([
      {
        requesterId: requesterUser._id,
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
          'Urgent requirement for immediate abdominal surgery at DMCH Emergency Surgery Ward 4. Pre-op prep ongoing.',
        urgency: 'critical',
        status: 'active',
      },
      {
        requesterId: requesterUser._id,
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
        alternatePhone: '+880 1622-334455',
        description: 'Road traffic accident trauma victim. Attendants are at SBMC blood bank counter.',
        urgency: 'urgent',
        status: 'active',
      },
      {
        requesterId: requesterUser._id,
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
      },
      {
        requesterId: requesterUser._id,
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
        description: 'Rare AB- blood requirement for orthopedic reconstructive surgery scheduled tomorrow.',
        urgency: 'normal',
        status: 'active',
      },
      {
        requesterId: requesterUser._id,
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
      },
      {
        requesterId: donorUser._id,
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
        description: 'Arranged via RoktoBondhu voluntary donors. Transfusion completed safely.',
        urgency: 'urgent',
        status: 'fulfilled',
      },
    ]);

    // 4. Create Sample Donations for Rahim
    await Donation.create([
      {
        donorId: donorUser._id,
        donationDate: '2026-09-12',
        hospitalName: 'Chattogram Medical College Hospital',
        location: 'Chattogram',
        bloodGroup: 'O+',
        units: 1,
        notes: 'Voluntary response for pediatric cardiac emergency.',
        verified: true,
      },
      {
        donorId: donorUser._id,
        donationDate: '2026-06-18',
        hospitalName: 'Popular Diagnostic Centre',
        location: 'Dhanmondi, Dhaka',
        bloodGroup: 'O+',
        units: 1,
        notes: 'Emergency blood request fulfilled via RoktoBondhu.',
        verified: true,
      },
      {
        donorId: donorUser._id,
        donationDate: '2026-02-10',
        hospitalName: 'Dhaka Medical College Hospital',
        location: 'Shahbagh, Dhaka',
        bloodGroup: 'O+',
        units: 1,
        notes: 'National Youth Blood Donation Drive volunteer camp.',
        verified: true,
      },
    ]);

    console.log('[MongoDB] Initial dataset seeded successfully.');
  } catch (err: any) {
    console.error('[MongoDB] Error seeding initial data:', err.message);
  }
};
