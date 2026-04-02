import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Doctor from '../models/Doctor';
import User from '../models/User';

export const getAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    const userId = (req as any).user?.id; // FIXED

    const query: any = { $or: [{ patient: userId }, { doctor: userId }] };

    if (status) query.status = status;
    if (date) {
      const targetDate = new Date(date as string);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lt: endOfDay };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const appointments = await Appointment.find(query)
      .populate('patient', 'name avatar')
      .populate('doctor', 'specialization consultationFee')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name avatar' }
      })
      .populate('hospital', 'name address')
      .sort({ date: 1, timeSlot: 1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      data: appointments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id; // FIXED
    const appointmentData = {
      ...req.body,
      patient: userId,
      status: 'Scheduled',
      payment: {
        amount: req.body.consultationFee || 0,
        currency: 'NPR',
        status: 'Pending',
      },
    };

    // Check doctor availability
    const doctor = await Doctor.findById(req.body.doctor);
    if (!doctor || !doctor.isAvailable) {
      res.status(400).json({
        success: false,
        message: 'Doctor is not available',
      });
      return;
    }

    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      date: new Date(req.body.date),
      timeSlot: req.body.timeSlot,
      status: { $in: ['Scheduled', 'Confirmed'] },
    });

    if (existingAppointment) {
      res.status(400).json({
        success: false,
        message: 'Time slot is already booked',
      });
      return;
    }

    const appointment = await Appointment.create(appointmentData);

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone avatar')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone avatar' }
      })
      .populate('hospital', 'name address contact');

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
      return;
    }

    // Check authorization - FIXED
    const userId = (req as any).user?.id;
    if (
      appointment.patient.toString() !== userId &&
      appointment.doctor.toString() !== userId
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
      return;
    }

    // Check authorization - FIXED
    const userId = (req as any).user?.id;
    if (appointment.patient.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment',
      });
      return;
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedAppointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const cancelAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
      return;
    }

    // Check authorization - FIXED
    const userId = (req as any).user?.id;
    if (
      appointment.patient.toString() !== userId &&
      appointment.doctor.toString() !== userId
    ) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment',
      });
      return;
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
      return;
    }

    const targetDate = new Date(date as string);
    const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (!doctor.availableDays.includes(dayName)) {
      res.status(200).json({
        success: true,
        available: false,
        message: `Doctor is not available on ${dayName}`,
        slots: [],
      });
      return;
    }

    // Get booked appointments
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lt: endOfDay },
      status: { $in: ['Scheduled', 'Confirmed'] },
    }).select('timeSlot duration');

    // Generate slots
    const [startHour, startMinute] = doctor.availableHours.start.split(':').map(Number);
    const [endHour, endMinute] = doctor.availableHours.end.split(':').map(Number);

    const slots: string[] = [];
    const slotDuration = 30; // minutes

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const slotTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      const isBooked = bookedAppointments.some(appointment => 
        appointment.timeSlot === slotTime
      );

      if (!isBooked) {
        slots.push(slotTime);
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
      available: slots.length > 0,
      slots,
      workingHours: doctor.availableHours,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const confirmAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
      return;
    }

    // Only doctor can confirm - FIXED
    const userId = (req as any).user?.id;
    if (appointment.doctor.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to confirm this appointment',
      });
      return;
    }

    appointment.status = 'Confirmed';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment confirmed',
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const completeAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
      return;
    }

    // Only doctor can mark as complete - FIXED
    const userId = (req as any).user?.id;
    if (appointment.doctor.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to complete this appointment',
      });
      return;
    }

    appointment.status = 'Completed';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment marked as completed',
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getAppointmentStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id; // FIXED

    const stats = await Appointment.aggregate([
      {
        $match: {
          $or: [{ patient: userId }, { doctor: userId }]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$payment.amount' }
        }
      }
    ]);

    const totalAppointments = stats.reduce((sum, stat) => sum + stat.count, 0);
    const upcoming = await Appointment.countDocuments({
      $or: [{ patient: userId }, { doctor: userId }],
      status: { $in: ['Scheduled', 'Confirmed'] },
      date: { $gte: new Date() }
    });

    res.status(200).json({
      success: true,
      data: {
        stats,
        totalAppointments,
        upcoming,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};