export interface MedicineResult {
  name: string;
  genericName: string;
  brand: string;
  dosage: string;
  form: string;
  category: string;
  uses: string[];
  sideEffects: string[];
  precautions: string[];
  contraindications: string[];
  dosageInstructions: {
    adult: string;
    pediatric: string;
    geriatric: string;
  };
  priceNepal: {
    min: number;
    max: number;
    currency: string;
  };
  alternatives: Array<{ name: string; genericName: string }>;
  requiresPrescription: boolean;
  pregnancyCategory?: string;
  lactationSafe?: boolean;
  verified: boolean;
  expiryWarning: number;
  storage: string;
  confidence: number;
}

export interface ScanHistory {
  id: string;
  imageUrl: string;
  medicineName: string;
  timestamp: string;
  confidence: number;
}

export interface PopularMedicine {
  name: string;
  genericName: string;
  price: {
    min: number;
    max: number;
  };
}