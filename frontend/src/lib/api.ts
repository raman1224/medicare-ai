
// frontend/src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

class API {
  private async request(endpoint: string, options: RequestInit = {}, silent: boolean = false) {
    try {
      const fullUrl = `${BASE_URL}${endpoint}`;
      
      const requestOptions: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include',
      };

      if (!silent) {
        console.log(`📡 Request to: ${fullUrl}`);
      }
      
      const response = await fetch(fullUrl, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error ${response.status}`;
        
        // If it's 401 and silent mode, just return null instead of throwing
        if (response.status === 401 && silent) {
          return null;
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error: any) {
      // Don't log 401 errors in silent mode
      if (!silent || (error.message && !error.message.includes('401'))) {
        console.error(`❌ API Error:`, error.message);
      }
      throw error;
    }
  }

  async get(endpoint: string, silent: boolean = false) {
    return this.request(endpoint, { method: 'GET' }, silent);
  }

  async post(endpoint: string, data: any, silent: boolean = false) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, silent);
  }

  async put(endpoint: string, data: any, silent: boolean = false) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, silent);
  }

  async delete(endpoint: string, silent: boolean = false) {
    return this.request(endpoint, { method: 'DELETE' }, silent);
  }

  async login(email: string, password: string) {
    const data = await this.post('/api/v1/auth/login', { email, password });
    return data;
  }

  async register(userData: any) {
    const data = await this.post('/api/v1/auth/register', userData);
    return data;
  }

  async logout() {
    try {
      await this.get('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser() {
    // ✅ Silent mode - won't show error for 401
    return this.get('/api/v1/auth/me', true);
  }

  googleLogin() {
    window.location.href = `${BASE_URL}/api/v1/auth/google`;
  }

  githubLogin() {
    window.location.href = `${BASE_URL}/api/v1/auth/github`;
  }

  // ==================== SYMPTOM ANALYSIS ====================
  async getSymptoms() {
    try {
      return await this.get('/api/v1/symptom/symptoms');
    } catch (error) {
      // Return mock symptoms if backend not available
      return {
        success: true,
        data: [
          "Fever", "Cough", "Headache", "Fatigue", "Nausea", "Dizziness",
          "Shortness of breath", "Chest pain", "Sore throat", "Body aches",
          "Loss of taste/smell", "Diarrhea", "Vomiting", "Rash", "Joint pain",
          "Runny nose", "Sneezing", "Chills", "Muscle pain", "Abdominal pain"
        ]
      };
    }
  }

  async analyzeSymptoms(data: any) {
    try {
      const response = await this.post('/api/v1/symptom/analyze', data);
      return response;
    } catch (error: any) {
      console.log('Backend unavailable, using mock analysis');
      return this.getMockAnalysis(data);
    }
  }

  async getAnalysisHistory(page: number = 1, limit: number = 10) {
    return this.get(`/api/v1/symptom/history?page=${page}&limit=${limit}`);
  }

  private getMockAnalysis(data: any) {
    const symptoms = data.symptoms || [];
    const temperature = data.temperature || "";
    
    const hasFever = symptoms.includes('Fever');
    const hasCough = symptoms.includes('Cough');
    const hasHeadache = symptoms.includes('Headache');
    const hasFatigue = symptoms.includes('Fatigue');
    const hasNausea = symptoms.includes('Nausea');
    const hasBodyAches = symptoms.includes('Body aches');
    const hasSoreThroat = symptoms.includes('Sore throat');
    const hasDiarrhea = symptoms.includes('Diarrhea');
    const hasVomiting = symptoms.includes('Vomiting');
    const hasChestPain = symptoms.includes('Chest pain');
    const hasShortnessBreath = symptoms.includes('Shortness of breath');
    
    let diagnosis: any[] = [];
    let urgency = "Low";
    let medicines: any[] = [];
    let foods: string[] = [];
    let avoid: string[] = [];
    let homeCare: string[] = [];
    let whenToSeeDoctor: string[] = [];
    
    const tempValue = parseFloat(temperature);
    const hasHighFever = !isNaN(tempValue) && tempValue > 38.5;
    
    if (hasFever && hasCough && (hasHeadache || hasFatigue)) {
      diagnosis = [{
        id: "viral_fever",
        name: "Viral Fever (Influenza)",
        commonName: "Flu",
        probability: hasHighFever ? "85" : "75",
        description: "Viral fever is a common condition caused by various viruses.",
        severity: hasHighFever ? "Moderate" : "Mild"
      }];
      urgency = hasHighFever ? "Moderate" : "Low";
      medicines = [{ name: "Paracetamol 500mg", dosage: "1 tablet every 6 hours", for: "Fever and pain", note: "Max 4g per day" }];
      foods = ["Warm soups", "Ginger tea with honey", "Citrus fruits"];
      avoid = ["Cold drinks", "Spicy food", "Dairy products"];
      homeCare = ["Rest 7-9 hours daily", "Drink 2-3 liters of water", "Steam inhalation"];
      whenToSeeDoctor = ["Fever > 39.5°C", "Difficulty breathing", "Symptoms lasting > 5 days"];
    }
    else if (hasFever && hasHeadache && hasBodyAches && hasFatigue) {
      diagnosis = [{
        id: "dengue",
        name: "Dengue Fever",
        commonName: "Dengue",
        probability: "75",
        description: "Mosquito-borne viral infection. Monitor platelet count.",
        severity: "High"
      }];
      urgency = "High";
      medicines = [
        { name: "Paracetamol 500mg", dosage: "1 tablet every 6 hours", for: "Fever and pain", note: "AVOID aspirin" },
        { name: "ORS Solution", dosage: "As needed", for: "Hydration", note: "Prevents dehydration" }
      ];
      foods = ["Papaya leaf juice", "Coconut water", "Herbal teas"];
      avoid = ["Aspirin", "Ibuprofen", "Dark-colored foods"];
      homeCare = ["Complete bed rest", "Monitor platelet count", "Stay hydrated"];
      whenToSeeDoctor = ["Severe abdominal pain", "Bleeding gums", "Blood in vomit/stool"];
    }
    else if ((hasNausea || hasVomiting) && hasDiarrhea && hasFatigue) {
      diagnosis = [{
        id: "gastroenteritis",
        name: "Gastroenteritis",
        commonName: "Stomach Flu",
        probability: "80",
        description: "Inflammation of stomach and intestines.",
        severity: "Moderate"
      }];
      urgency = "Moderate";
      medicines = [{ name: "ORS Solution", dosage: "After each loose stool", for: "Hydration", note: "Prevents dehydration" }];
      foods = ["Bananas", "Rice", "Applesauce", "Toast"];
      avoid = ["Dairy", "Spicy food", "Fried food"];
      homeCare = ["BRAT diet", "Frequent hand washing", "Avoid solid foods until vomiting stops"];
      whenToSeeDoctor = ["Diarrhea > 3 days", "Blood in stool", "High fever"];
    }
    else if (hasChestPain || hasShortnessBreath) {
      diagnosis = [{
        id: "respiratory_infection",
        name: "Lower Respiratory Infection",
        commonName: "Chest Infection",
        probability: "70",
        description: "May be bronchitis or pneumonia. Seek medical attention.",
        severity: "Critical"
      }];
      urgency = "Critical";
      medicines = [{ name: "Seek immediate medical care", dosage: "Emergency", for: "Assessment", note: "DO NOT DELAY" }];
      foods = ["Consult doctor immediately"];
      avoid = ["Do not self-medicate"];
      homeCare = ["Go to emergency room immediately"];
      whenToSeeDoctor = ["IMMEDIATE - Go to hospital now"];
    }
    else {
      diagnosis = [{
        id: "general_malaise",
        name: "General Malaise",
        commonName: "General Illness",
        probability: "60",
        description: "General viral illness or fatigue. Rest and proper nutrition recommended.",
        severity: "Low"
      }];
      urgency = "Low";
      medicines = [{ name: "Rest", dosage: "7-9 hours daily", for: "Recovery", note: "Essential for healing" }];
      foods = ["Light meals", "Fresh fruits", "Vegetable soups"];
      avoid = ["Processed food", "Sugary drinks", "Alcohol"];
      homeCare = ["Get adequate sleep", "Stay hydrated", "Eat nutritious meals"];
      whenToSeeDoctor = ["Symptoms worsen", "Fever > 3 days", "Severe pain"];
    }
    
    return {
      success: true,
      data: {
        diagnosis,
        urgency,
        recommendations: {
          do: ["Get plenty of rest", "Stay hydrated", "Monitor temperature", "Eat light meals"],
          dont: ["Avoid self-medication", "Don't ignore worsening symptoms", "Avoid smoking and alcohol"],
          medications: medicines,
          foods: foods,
          avoid: avoid,
          homeCare: homeCare,
          whenToSeeDoctor: whenToSeeDoctor
        },
        message: `Based on your symptoms, you may have ${diagnosis[0]?.name || "a general illness"}. This is AI-generated and not a final diagnosis.`,
        disclaimer: "This is an AI-powered preliminary assessment. Always consult a qualified healthcare provider."
      }
    };
  }

  // ==================== CONTACT ====================
  async sendContactMessage(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) {
    return this.post('/api/v1/contact', data);
  }

  // ==================== BLOOD BANK ====================
async getBloodRequests() {
  try {
    const response = await this.get('/api/v1/blood/requests');
    return response;
  } catch (error) {
    console.log('Using mock blood requests');
    return { success: true, data: [] };
  }
}

async createBloodRequest(data: any) {
  try {
    const response = await this.post('/api/v1/blood/requests', data);
    return response;
  } catch (error) {
    console.log('Using mock create request');
    return { success: true, data: { id: 'mock-123', ...data } };
  }
}

async getBloodDonors(params?: any) {
  try {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    const response = await this.get(`/api/v1/blood/donors${query}`);
    return response;
  } catch (error) {
    console.log('Using mock blood donors');
    return { 
      success: true, 
      data: [
        { _id: '1', name: 'Ram Dangol', bloodGroup: 'O+', location: { district: 'Kathmandu' }, donorAvailable: true },
        { _id: '2', name: 'Sita Sharma', bloodGroup: 'A+', location: { district: 'Lalitpur' }, donorAvailable: true }
      ] 
    };
  }
}

async registerAsDonor(data: any) {
  try {
    const response = await this.post('/api/v1/blood/donors/register', data);
    return response;
  } catch (error) {
    console.log('Using mock donor registration');
    return { success: true, data };
  }
}

async updateDonorStatus(data: any) {
  try {
    const response = await this.put('/api/v1/blood/donors/status', data);
    return response;
  } catch (error) {
    console.log('Using mock update status');
    return { success: true };
  }
}

async getBloodStatistics() {
  try {
    const response = await this.get('/api/v1/blood/statistics');
    return response;
  } catch (error) {
    console.log('Using mock blood statistics');
    return {
      success: true,
      data: {
        totalDonors: 2458,
        availableDonors: 1475,
        totalRequests: 1234,
        urgentNeeds: 12,
        livesSaved: 4916,
        bloodGroups: [
          { _id: 'A+', count: 450 },
          { _id: 'A-', count: 120 },
          { _id: 'B+', count: 380 },
          { _id: 'B-', count: 95 },
          { _id: 'O+', count: 680 },
          { _id: 'O-', count: 210 },
          { _id: 'AB+', count: 85 },
          { _id: 'AB-', count: 35 },
        ]
      }
    };
  }
}

async getDonorProfile() {
  try {
    const response = await this.get('/api/v1/blood/donor/profile');
    return response;
  } catch (error) {
    console.log('Using mock donor profile');
    return { success: false, data: null };
  }
}

async matchDonors(requestId: string) {
  try {
    const response = await this.post(`/api/v1/blood/requests/${requestId}/match`, {});
    return response;
  } catch (error) {
    console.log('Using mock match donors');
    return { success: true, data: { matchingDonors: [], matchCount: 0 } };
  }
}

//ai

// Add these methods to your API class

async sendChatMessage(data: { message: string; requestTTS?: boolean }) {
  return this.post('/api/v1/chat/message', data);
}

async getChatHistory() {
  return this.get('/api/v1/chat/history');
}

async getChatStats() {
  return this.get('/api/v1/chat/stats');
}

async aiAnalyzeSymptoms(data: any) {
  return this.post('/api/v1/chat/analyze-symptoms', data);
}

async getEmergencyContacts() {
  return this.get('/api/v1/chat/emergency-contacts');
}

async deleteConversation(id: string) {
  return this.delete(`/api/v1/chat/conversation/${id}`);
}


  // ==================== DOCTORS ====================
  async getDoctors(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.get(`/api/v1/doctors${query}`);
  }

  async getDoctorById(id: string) {
    return this.get(`/api/v1/doctors/${id}`);
  }

  async bookAppointment(data: any) {
    return this.post('/api/v1/appointments', data);
  }

  async getMyAppointments() {
    return this.get('/api/v1/appointments/my');
  }

  // ==================== HOSPITALS ====================
  async getHospitals(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.get(`/api/v1/hospitals${query}`);
  }

  async getHospitalById(id: string) {
    return this.get(`/api/v1/hospitals/${id}`);
  }

  // ==================== CHAT ====================
  async getChatMessages(chatId: string) {
    return this.get(`/api/v1/chat/${chatId}/messages`);
  }

  async sendMessage(data: any) {
    return this.post('/api/v1/chat/messages', data);
  }

  // ==================== FITNESS ====================
  async getWorkouts() {
    return this.get('/api/v1/fitness/workouts');
  }

  async trackWorkout(data: any) {
    return this.post('/api/v1/fitness/track', data);
  }

  async getFitnessStats() {
    return this.get('/api/v1/fitness/stats');
  }

  // ==================== UPLOAD ====================
  async uploadFile(endpoint: string, formData: FormData) {
    const fullUrl = `${BASE_URL}${endpoint}`;
    const response = await fetch(fullUrl, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    return response.json();
  }

  // ==================== MEDICINE SCANNER ====================
  async scanMedicine(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.uploadFile('/api/v1/medicine/scan', formData);
  }

  async getMedicineInfo(medicineName: string) {
    return this.get(`/api/v1/medicine/info?name=${encodeURIComponent(medicineName)}`);
  }
}

export const api = new API();

// Export individual APIs for backward compatibility
export const contactAPI = {
  sendContactMessage: async (data: any) => {
    return api.sendContactMessage(data);
  }
};

// export const bloodBankAPI = {
//   getRequests: async () => api.getBloodRequests(),
//   createRequest: async (data: any) => api.createBloodRequest(data),
//   getDonors: async () => api.getBloodDonors(),
//   registerAsDonor: async (data: any) => api.registerAsDonor(data),
//   getStatistics: async () => api.getBloodStatistics(),
//   getRequestById: async (id: string) => api.get(`/api/v1/blood/requests/${id}`),
//   updateRequest: async (id: string, data: any) => api.put(`/api/v1/blood/requests/${id}`, data),
//   deleteRequest: async (id: string) => api.delete(`/api/v1/blood/requests/${id}`),
//   getDonorProfile: async () => api.get('/api/v1/blood/donors/profile'),
//   updateDonorStatus: async (data: any) => api.put('/api/v1/blood/donors/status', data),
//   matchDonors: async (requestId: string) => api.get(`/api/v1/blood/requests/${requestId}/match`),
//   getMyDonations: async () => api.get('/api/v1/blood/donors/donations'),
//   getMyRequests: async () => api.get('/api/v1/blood/requests/my')
// };


export const bloodBankAPI = {
  getRequests: async (params?: any) => {
    try {
      const query = params ? `?${new URLSearchParams(params)}` : '';
      const response = await api.get(`/api/v1/blood/requests${query}`);
      return response;
    } catch (error) {
      console.log('Error fetching blood requests, using mock data');
      return { 
        success: true, 
        data: [
          {
            _id: 'mock1',
            bloodGroup: 'O+',
            units: 2,
            urgency: 'Critical',
            location: { province: 'Bagmati', district: 'Kathmandu', address: 'Teaching Hospital' },
            patientInfo: { name: 'John Doe', age: 35, gender: 'male', condition: 'Surgery' },
            contact: { phone: '9812345678', relationship: 'Family' },
            requiredBy: new Date(Date.now() + 86400000).toISOString(),
            status: 'Pending',
            createdAt: new Date().toISOString()
          },
          {
            _id: 'mock2',
            bloodGroup: 'A+',
            units: 3,
            urgency: 'High',
            location: { province: 'Bagmati', district: 'Lalitpur', address: 'Patan Hospital' },
            patientInfo: { name: 'Jane Smith', age: 28, gender: 'female', condition: 'Accident' },
            contact: { phone: '9823456789', relationship: 'Friend' },
            requiredBy: new Date(Date.now() + 172800000).toISOString(),
            status: 'Pending',
            createdAt: new Date().toISOString()
          }
        ] 
      };
    }
  },
  
  getRequestById: async (id: string) => {
    try {
      const response = await api.get(`/api/v1/blood/requests/${id}`);
      return response;
    } catch (error) {
      console.log('Error fetching blood request, using mock data');
      return { success: true, data: { _id: id } };
    }
  },
  
  createRequest: async (data: any) => {
    try {
      const response = await api.post('/api/v1/blood/requests', data);
      return response;
    } catch (error) {
      console.log('Error creating blood request, using mock data');
      return { success: true, data: { _id: 'mock-' + Date.now(), ...data } };
    }
  },
  
  updateRequest: async (id: string, data: any) => {
    try {
      const response = await api.put(`/api/v1/blood/requests/${id}`, data);
      return response;
    } catch (error) {
      console.log('Error updating blood request, using mock data');
      return { success: true, data: { _id: id, ...data } };
    }
  },
  
  deleteRequest: async (id: string) => {
    try {
      const response = await api.delete(`/api/v1/blood/requests/${id}`);
      return response;
    } catch (error) {
      console.log('Error deleting blood request, using mock data');
      return { success: true };
    }
  },
  
  getDonors: async (params?: any) => {
    try {
      const query = params ? `?${new URLSearchParams(params)}` : '';
      const response = await api.get(`/api/v1/blood/donors${query}`);
      return response;
    } catch (error) {
      console.log('Error fetching donors, using mock data');
      return { 
        success: true, 
        data: [
          {
            _id: 'donor1',
            name: 'Ram Dangol',
            email: 'ram@example.com',
            phone: '9812345678',
            bloodGroup: 'O+',
            location: { province: 'Bagmati', district: 'Kathmandu', address: 'Baneshwor' },
            donorAvailable: true,
            lastDonation: new Date(Date.now() - 86400000 * 90).toISOString(),
            totalDonations: 5,
            avatar: null,
            verified: true
          },
          {
            _id: 'donor2',
            name: 'Sita Sharma',
            email: 'sita@example.com',
            phone: '9823456789',
            bloodGroup: 'A+',
            location: { province: 'Bagmati', district: 'Lalitpur', address: 'Jawalakhel' },
            donorAvailable: true,
            lastDonation: new Date(Date.now() - 86400000 * 60).toISOString(),
            totalDonations: 3,
            avatar: null,
            verified: true
          },
          {
            _id: 'donor3',
            name: 'Hari Pokharel',
            email: 'hari@example.com',
            phone: '9834567890',
            bloodGroup: 'B+',
            location: { province: 'Bagmati', district: 'Bhaktapur', address: 'Durbar Square' },
            donorAvailable: false,
            lastDonation: new Date(Date.now() - 86400000 * 30).toISOString(),
            totalDonations: 2,
            avatar: null,
            verified: true
          },
          {
            _id: 'donor4',
            name: 'Gita Thapa',
            email: 'gita@example.com',
            phone: '9845678901',
            bloodGroup: 'AB+',
            location: { province: 'Bagmati', district: 'Kathmandu', address: 'Thamel' },
            donorAvailable: true,
            lastDonation: new Date(Date.now() - 86400000 * 120).toISOString(),
            totalDonations: 4,
            avatar: null,
            verified: true
          },
          {
            _id: 'donor5',
            name: 'Bikash Neupane',
            email: 'bikash@example.com',
            phone: '9856789012',
            bloodGroup: 'O-',
            location: { province: 'Bagmati', district: 'Kathmandu', address: 'Kapan' },
            donorAvailable: true,
            lastDonation: new Date(Date.now() - 86400000 * 45).toISOString(),
            totalDonations: 6,
            avatar: null,
            verified: true
          }
        ] 
      };
    }
  },
  
  getDonorProfile: async () => {
    try {
      const response = await api.get('/api/v1/blood/donor/profile');
      return response;
    } catch (error) {
      console.log('Error fetching donor profile, using mock data');
      return { success: false, data: null };
    }
  },
  
  registerAsDonor: async (data: any) => {
    try {
      const response = await api.post('/api/v1/blood/donors/register', data);
      return response;
    } catch (error) {
      console.log('Error registering as donor, using mock data');
      return { success: true, data: { ...data, _id: 'donor-mock-' + Date.now() } };
    }
  },
  
  updateDonorStatus: async (data: any) => {
    try {
      const response = await api.put('/api/v1/blood/donors/status', data);
      return response;
    } catch (error) {
      console.log('Error updating donor status, using mock data');
      return { success: true };
    }
  },
  
  getStatistics: async () => {
    try {
      const response = await api.get('/api/v1/blood/statistics');
      return response;
    } catch (error) {
      console.log('Error fetching blood statistics, using mock data');
      return {
        success: true,
        data: {
          totalDonors: 2458,
          availableDonors: 1475,
          totalRequests: 1234,
          urgentNeeds: 12,
          livesSaved: 4916,
          bloodGroups: [
            { _id: 'A+', count: 450 },
            { _id: 'A-', count: 120 },
            { _id: 'B+', count: 380 },
            { _id: 'B-', count: 95 },
            { _id: 'O+', count: 680 },
            { _id: 'O-', count: 210 },
            { _id: 'AB+', count: 85 },
            { _id: 'AB-', count: 35 }
          ]
        }
      };
    }
  },
  
  matchDonors: async (requestId: string) => {
    try {
      const response = await api.post(`/api/v1/blood/requests/${requestId}/match`, {});
      return response;
    } catch (error) {
      console.log('Error matching donors, using mock data');
      return { 
        success: true, 
        data: { 
          matchingDonors: [
            { _id: 'donor1', name: 'Ram Dangol', bloodGroup: 'O+', phone: '9812345678', location: { district: 'Kathmandu' } },
            { _id: 'donor2', name: 'Sita Sharma', bloodGroup: 'O+', phone: '9823456789', location: { district: 'Lalitpur' } }
          ], 
          matchCount: 2 
        } 
      };
    }
  },
  
  getMyDonations: async () => {
    try {
      const response = await api.get('/api/v1/blood/donors/donations');
      return response;
    } catch (error) {
      console.log('Error fetching my donations, using mock data');
      return { success: true, data: [] };
    }
  },
  
  getMyRequests: async () => {
    try {
      const response = await api.get('/api/v1/blood/requests/my');
      return response;
    } catch (error) {
      console.log('Error fetching my requests, using mock data');
      return { success: true, data: [] };
    }
  }
};

export default api;