// src/controllers/hospital.controller.ts
import { Request, Response } from 'express';
import Hospital from '../models/Hospital';
import Doctor from '../models/Doctor';
import User from '../models/User';
export const getHospitals = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      province,
      district,
      type,
      emergency,
      specialty,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query: any = {};

    if (province) {
      query['address.province'] = province;
    }

    if (district) {
      query['address.district'] = district;
    }

    if (type) {
      query.type = type;
    }

    if (emergency === 'true') {
      query['emergency.available'] = true;
    }

    if (specialty) {
      query.departments = specialty;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'address.district': { $regex: search, $options: 'i' } },
        { 'address.municipality': { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const hospitals = await Hospital.find(query)
      .skip(skip)
      .limit(parseInt(limit as string))
      .sort({ verified: -1, rating: -1 });

    const total = await Hospital.countDocuments(query);

    res.status(200).json({
      success: true,
      count: hospitals.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string),
      data: hospitals,
    });
  } catch (error: any) {
    console.error('Get hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const getHospitalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const hospital = await Hospital.findById(req.params.id)
      .populate('doctors', 'specialization consultationFee rating')
      .populate({
        path: 'doctors',
        populate: {
          path: 'user',
          select: 'name avatar',
        },
      });

    if (!hospital) {
      res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
      return;
    }

    // Get nearby hospitals (within 10km)
    const nearbyHospitals = await Hospital.find({
      _id: { $ne: hospital._id },
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [hospital.coordinates.lng, hospital.coordinates.lat],
          },
          $maxDistance: 10000, // 10km in meters
        },
      },
    }).limit(5).select('name address type emergency');

    res.status(200).json({
      success: true,
      data: {
        hospital,
        nearbyHospitals,
      },
    });
  } catch (error: any) {
    console.error('Get hospital by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getHospitalDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const hospitalId = req.params.id;
    const { specialization, available } = req.query;

    const query: any = { hospital: hospitalId };

    if (specialization) {
      query.specialization = specialization;
    }

    if (available === 'true') {
      query.isAvailable = true;
    }

    const doctors = await Doctor.find(query)
      .populate('user', 'name avatar')
      .populate('hospital', 'name')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error: any) {
    console.error('Get hospital doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const searchHospitalsByLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng, radius = 5000, emergency } = req.query; // radius in meters

    if (!lat || !lng) {
      res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude',
      });
      return;
    }

    const query: any = {
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
          },
          $maxDistance: parseInt(radius as string),
        },
      },
    };

    if (emergency === 'true') {
      query['emergency.available'] = true;
    }

    const hospitals = await Hospital.find(query)
      .limit(20)
      .select('name address type emergency beds.coordinates');

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error: any) {
    console.error('Search hospitals by location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getEmergencyHospitals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { province, district } = req.query;

    const query: any = {
      'emergency.available': true,
    };

    if (province) {
      query['address.province'] = province;
    }

    if (district) {
      query['address.district'] = district;
    }

    const hospitals = await Hospital.find(query)
      .select('name address contact emergency beds')
      .sort({ 'emergency.beds': -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error: any) {
    console.error('Get emergency hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const addHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is admin
   const userId = (req as any).user?.id;
const user = await User.findById(userId);
if (!user || user.role !== 'admin'){
      res.status(403).json({
        success: false,
        message: 'Not authorized to add hospitals',
      });
      return;
    }

    const hospitalData = req.body;
    const hospital = await Hospital.create(hospitalData);

    res.status(201).json({
      success: true,
      data: hospital,
    });
  } catch (error: any) {
    console.error('Add hospital error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const updateHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    const userId = (req as any).user?.id;
const user = await User.findById(userId);
if (!user || user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update hospitals',
      });
      return;
    }

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!hospital) {
      res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const verifyHospital = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    const userId = (req as any).user?.id;
const user = await User.findById(userId);
if (!user || user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to verify hospitals',
      });
      return;
    }

    const { verified } = req.body;

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { verified },
      { new: true, runValidators: true }
    );

    if (!hospital) {
      res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Hospital ${verified ? 'verified' : 'unverified'} successfully`,
      data: hospital,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getHospitalStatistics = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Get total hospitals by type
    const hospitalsByType = await Hospital.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalBeds: { $sum: '$beds.total' },
          availableBeds: { $sum: '$beds.available' },
        },
      },
    ]);

    // Get hospitals by province
    const hospitalsByProvince = await Hospital.aggregate([
      {
        $group: {
          _id: '$address.province',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get emergency hospitals count
    const emergencyHospitals = await Hospital.countDocuments({
      'emergency.available': true,
    });

    // Get verified hospitals count
    const verifiedHospitals = await Hospital.countDocuments({
      verified: true,
    });

    res.status(200).json({
      success: true,
      data: {
        hospitalsByType,
        hospitalsByProvince,
        emergencyHospitals,
        verifiedHospitals,
        totalHospitals: await Hospital.countDocuments(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
