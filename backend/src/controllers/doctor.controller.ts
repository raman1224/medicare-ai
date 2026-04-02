// src/controllers/doctor.controller.ts
import { Request, Response } from 'express';
import Doctor from '../models/Doctor';
import Appointment from '../models/Appointment';

export const getDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      specialization,
      minRating,
      maxFee,
      available,
      verified,
      search,
      page = 1,
      limit = 10,
      sort = '-rating',
    } = req.query;

    // Build query
    const query: any = {};

    if (specialization) {
      query.specialization = specialization;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating as string) };
    }

    if (maxFee) {
      query.consultationFee = { $lte: parseFloat(maxFee as string) };
    }

    if (available === 'true') {
      query.isAvailable = true;
    }

    if (verified === 'true') {
      query.verified = true;
    }

    if (search) {
      query.$or = [
        { 'user.name': { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { qualifications: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const doctors = await Doctor.find(query)
      .populate({
        path: 'user',
        select: 'name email phone avatar',
      })
      .populate('hospital', 'name address')
      .sort(sort as string)
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Doctor.countDocuments(query);

    res.status(200).json({
      success: true,
      count: doctors.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string),
      data: doctors,
    });
  } catch (error: any) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email phone avatar dateOfBirth gender',
      })
      .populate('hospital', 'name address contact facilities')
      .populate('reviews');

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
      return;
    }

    // Get doctor's upcoming appointments count
    const upcomingAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: { $in: ['Scheduled', 'Confirmed'] },
      date: { $gte: new Date() },
    });

    // Get doctor statistics
    const totalAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: 'Completed',
    });

    const responseData = {
      ...doctor.toObject(),
      statistics: {
        totalAppointments,
        upcomingAppointments,
        patientSatisfaction: doctor.rating,
      },
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error: any) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};


export const createDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.create(req.body);
    
    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const deleteDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};




export const getDoctorAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
      return;
    }

    const targetDate = date ? new Date(date as string) : new Date();

    // Check if doctor is available on this day
    const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
    if (!doctor.availableDays.includes(dayName)) {
      res.status(200).json({
        success: true,
        available: false,
        message: `Doctor is not available on ${dayName}`,
      });
      return;
    }

    // Get booked appointments for the day
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const appointments = await Appointment.find({
      doctor: id,
      date: { $gte: startOfDay, $lt: endOfDay },
      status: { $in: ['Scheduled', 'Confirmed'] },
    }).select('timeSlot duration');

    // Generate available slots
    const [startHour, startMinute] = doctor.availableHours.start.split(':').map(Number);
    const [endHour, endMinute] = doctor.availableHours.end.split(':').map(Number);
    
    const slotDuration = 30; // minutes
    const availableSlots: string[] = [];

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const slotTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Check if slot is booked
      const isBooked = appointments.some(appointment => {
        const [appHour, appMinute] = appointment.timeSlot.split(':').map(Number);
        return (
          appHour === currentHour &&
          appMinute === currentMinute
        );
      });

      if (!isBooked) {
        availableSlots.push(slotTime);
      }

      // Move to next slot
      currentMinute += slotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }

    res.status(200).json({
      success: true,
      available: availableSlots.length > 0,
      availableSlots,
      workingHours: doctor.availableHours,
      consultationTypes: doctor.consultationTypes,
    });
  } catch (error: any) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateDoctorProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = req.params.id;
    const updates = req.body;
    const userId = (req as any).user?.id;

    // Check if user is authorized
    const doctor = await Doctor.findById(doctorId).populate('user');
    if (!doctor || (doctor.user as any)._id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
      return;
    }

    // Allowed updates
    const allowedUpdates = [
      'specialization',
      'qualifications',
      'experience',
      'consultationFee',
      'availableDays',
      'availableHours',
      'languages',
      'services',
      'education',
      'isAvailable',
      'consultationTypes',
    ];

    // Filter updates
    const filteredUpdates: any = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      filteredUpdates,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone avatar');

    res.status(200).json({
      success: true,
      data: updatedDoctor,
    });
  } catch (error: any) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getDoctorAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = req.params.id;
    const { status, date, page = 1, limit = 10 } = req.query;

    // Build query
    const query: any = { doctor: doctorId };

    if (status) {
      query.status = status;
    }

    if (date) {
      const targetDate = new Date(date as string);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lt: endOfDay };
    }

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone avatar')
      .populate('hospital', 'name address')
      .sort({ date: 1, timeSlot: 1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string),
      data: appointments,
    });
  } catch (error: any) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
export const verifyDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    // Check if user is admin
    // First get the user to check role
    const userId = (req as any).user?.id; // FIXED: Use type assertion
    if (!userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    // You need to import User model to check role
    const User = require('../models/User').default; // Import dynamically
    const user = await User.findById(userId);
    
    if (!user || user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to verify doctors',
      });
      return;
    }

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { verified },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Doctor ${verified ? 'verified' : 'unverified'} successfully`,
      data: doctor,
    });
  } catch (error: any) {
    console.error('Verify doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const searchDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, location, specialization } = req.query;

    const searchQuery: any = {};

    if (query) {
      searchQuery.$or = [
        { 'user.name': { $regex: query, $options: 'i' } },
        { specialization: { $regex: query, $options: 'i' } },
        { qualifications: { $regex: query, $options: 'i' } },
      ];
    }

    if (specialization) {
      searchQuery.specialization = specialization;
    }

    // If location is provided, search doctors in that location
    if (location) {
      const doctorsInLocation = await Doctor.find(searchQuery)
        .populate({
          path: 'hospital',
          match: {
            $or: [
              { 'address.district': { $regex: location, $options: 'i' } },
              { 'address.province': { $regex: location, $options: 'i' } },
            ],
          },
          select: 'name address',
        })
        .populate('user', 'name avatar')
        .limit(20);

      // Filter out doctors without hospitals in the location
      const filteredDoctors = doctorsInLocation.filter(doctor => doctor.hospital);

      res.status(200).json({
        success: true,
        count: filteredDoctors.length,
        data: filteredDoctors,
      });
    } else {
      const doctors = await Doctor.find(searchQuery)
        .populate('user', 'name avatar')
        .populate('hospital', 'name address')
        .limit(20);

      res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors,
      });
    }
  } catch (error: any) {
    console.error('Search doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getTopDoctors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const topDoctors = await Doctor.find({ verified: true, rating: { $gte: 4 } })
      .populate('user', 'name avatar')
      .populate('hospital', 'name')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: topDoctors.length,
      data: topDoctors,
    });
  } catch (error: any) {
    console.error('Get top doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
