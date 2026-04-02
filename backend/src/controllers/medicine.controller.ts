// src/controllers/medicine.controller.ts
import { Request, Response } from 'express';
import Medicine from '../models/Medicine';
import cloudinary from '../config/cloudinary';
import User from '../models/User'; // ADD THIS IMPORT

export const scanMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
      return;
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'medicare/medicines',
    });

    // Here you would integrate with Google Vision API or your custom AI model
    // For now, we'll return mock data
    const mockMedicines = await Medicine.find().limit(5);

    res.status(200).json({
      success: true,
      message: 'Medicine scanned successfully',
      imageUrl: result.secure_url,
      possibleMatches: mockMedicines,
    });
  } catch (error: any) {
    console.error('Scan medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during medicine scanning',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const searchMedicines = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, category, requiresPrescription, page = 1, limit = 20 } = req.query;

    const searchQuery: any = {};

    if (query) {
      searchQuery.$text = { $search: query };
    }

    if (category) {
      searchQuery.category = category;
    }

    if (requiresPrescription === 'true') {
      searchQuery.requiresPrescription = true;
    } else if (requiresPrescription === 'false') {
      searchQuery.requiresPrescription = false;
    }

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const medicines = await Medicine.find(searchQuery)
      .skip(skip)
      .limit(parseInt(limit as string))
      .sort({ verified: -1, name: 1 });

    const total = await Medicine.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      count: medicines.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string),
      data: medicines,
    });
  } catch (error: any) {
    console.error('Search medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const getMedicineById = async (req: Request, res: Response): Promise<void> => {
  try {
    const medicine = await Medicine.findById(req.params.id)
      .populate('alternatives', 'name genericName brand priceNepal');

    if (!medicine) {
      res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error: any) {
    console.error('Get medicine by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
export const addMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is admin or pharmacist - FIXED
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to add medicines',
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user || !['admin', 'pharmacist'].includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to add medicines',
      });
      return;
    }

    const medicineData = req.body;

    // Upload images if provided
    if (req.files && Array.isArray(req.files)) {
      const imageUrls: string[] = [];
      for (const file of req.files as Express.Multer.File[]) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'medicare/medicines',
        });
        imageUrls.push(result.secure_url);
      }
      medicineData.images = imageUrls;
    }

    const medicine = await Medicine.create(medicineData);

    res.status(201).json({
      success: true,
      data: medicine,
    });
  } catch (error: any) {
    console.error('Add medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const updateMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is admin or pharmacist - FIXED
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update medicines',
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user || !['admin', 'pharmacist'].includes(user.role)) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update medicines',
      });
      return;
    }

    const updates = req.body;
    updates.lastUpdated = new Date();

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!medicine) {
      res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error: any) {
    console.error('Update medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const verifyMedicine = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is admin - FIXED
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to verify medicines',
      });
      return;
    }

    const { verified } = req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      { verified },
      { new: true, runValidators: true }
    );

    if (!medicine) {
      res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Medicine ${verified ? 'verified' : 'unverified'} successfully`,
      data: medicine,
    });
  } catch (error: any) {
    console.error('Verify medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};


// export const addMedicine = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Check if user is admin or pharmacist
//     if (!['admin', 'pharmacist'].includes(req.user?.role)) {
//       res.status(403).json({
//         success: false,
//         message: 'Not authorized to add medicines',
//       });
//       return;
//     }

//     const medicineData = req.body;

//     // Upload images if provided
//     if (req.files && Array.isArray(req.files)) {
//       const imageUrls: string[] = [];
//       for (const file of req.files as Express.Multer.File[]) {
//         const result = await cloudinary.uploader.upload(file.path, {
//           folder: 'medicare/medicines',
//         });
//         imageUrls.push(result.secure_url);
//       }
//       medicineData.images = imageUrls;
//     }

//     const medicine = await Medicine.create(medicineData);

//     res.status(201).json({
//       success: true,
//       data: medicine,
//     });
//   } catch (error: any) {
//     console.error('Add medicine error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//     });
//   }
// };

// export const updateMedicine = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Check if user is admin or pharmacist
//     if (!['admin', 'pharmacist'].includes(req.user?.role)) {
//       res.status(403).json({
//         success: false,
//         message: 'Not authorized to update medicines',
//       });
//       return;
//     }

//     const updates = req.body;
//     updates.lastUpdated = new Date();

//     const medicine = await Medicine.findByIdAndUpdate(
//       req.params.id,
//       updates,
//       { new: true, runValidators: true }
//     );

//     if (!medicine) {
//       res.status(404).json({
//         success: false,
//         message: 'Medicine not found',
//       });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       data: medicine,
//     });
//   } catch (error: any) {
//     console.error('Update medicine error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//     });
//   }
// };

// export const verifyMedicine = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Check if user is admin
//     if (req.user?.role !== 'admin') {
//       res.status(403).json({
//         success: false,
//         message: 'Not authorized to verify medicines',
//       });
//       return;
//     }

//     const { verified } = req.body;

//     const medicine = await Medicine.findByIdAndUpdate(
//       req.params.id,
//       { verified },
//       { new: true, runValidators: true }
//     );

//     if (!medicine) {
//       res.status(404).json({
//         success: false,
//         message: 'Medicine not found',
//       });
//       return;
//     }

//     res.status(200).json({
//       success: true,
//       message: `Medicine ${verified ? 'verified' : 'unverified'} successfully`,
//       data: medicine,
//     });
//   } catch (error: any) {
//     console.error('Verify medicine error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//     });
//   }
// };

export const getMedicineCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Medicine.distinct('category');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error: any) {
    console.error('Get medicine categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getMedicineByGenericName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { genericName } = req.params;

    const medicines = await Medicine.find({
      genericName: { $regex: genericName, $options: 'i' },
    }).sort({ verified: -1, priceNepal: 1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (error: any) {
    console.error('Get medicine by generic name error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const checkMedicineInteractions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { medicines } = req.body; // Array of medicine IDs

    if (!Array.isArray(medicines) || medicines.length < 2) {
      res.status(400).json({
        success: false,
        message: 'Please provide at least two medicines to check interactions',
      });
      return;
    }

    // Fetch medicines
    const medicineList = await Medicine.find({
      _id: { $in: medicines },
    }).select('name genericName category contraindications');

    // Here you would integrate with a drug interaction database
    // For now, return mock data
    const interactions = [
      {
        medicine1: medicineList[0]?.name,
        medicine2: medicineList[1]?.name,
        severity: 'Moderate',
        description: 'May increase risk of bleeding',
        recommendation: 'Monitor closely or avoid concurrent use',
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        medicines: medicineList,
        interactions,
      },
    });
  } catch (error: any) {
    console.error('Check medicine interactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
