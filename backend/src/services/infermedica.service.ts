import axios from 'axios';

interface Evidence {
  id: string;
  choice_id: 'present' | 'absent' | 'unknown';
}

interface DiagnosisRequest {
  sex: 'male' | 'female';
  age: number;
  evidence: Evidence[];
}

interface Condition {
  id: string;
  name: string;
  probability: number;
  common_name?: string;
}

interface Symptom {
  id: string;
  name: string;
  common_name?: string;
}

class InfermedicaService {
  private appId: string;
  private appKey: string;
  private baseUrl: string;
  private symptomMap: Map<string, string> = new Map();

  constructor() {
    this.appId = process.env.INFERMEDICA_APP_ID || '';
    this.appKey = process.env.INFERMEDICA_API_KEY || '';
    this.baseUrl = 'https://api.infermedica.com/v3';
    
    if (!this.appId || !this.appKey) {
      console.warn('⚠️ Infermedica API credentials not found. Using mock mode.');
    }
  }

  private async request(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) {
    if (!this.appId || !this.appKey) {
      return this.mockResponse(endpoint, data);
    }

    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'App-Id': this.appId,
          'App-Key': this.appKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data,
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      console.error('Infermedica API Error:', error.response?.data || error.message);
      return this.mockResponse(endpoint, data);
    }
  }

  private mockResponse(endpoint: string, data?: any): any {
    console.log('📱 Using mock mode for:', endpoint);
    
    if (endpoint === '/symptoms') {
      return this.getMockSymptoms();
    }
    
    if (endpoint === '/diagnosis') {
      return this.getMockDiagnosis(data);
    }
    
    if (endpoint === '/explain') {
      return this.getMockExplanation(data);
    }
    
    return {};
  }

  private getMockSymptoms(): Symptom[] {
    return [
      { id: "s_21", name: "Fever", common_name: "Fever" },
      { id: "s_98", name: "Cough", common_name: "Cough" },
      { id: "s_36", name: "Headache", common_name: "Headache" },
      { id: "s_45", name: "Fatigue", common_name: "Fatigue" },
      { id: "s_8", name: "Nausea", common_name: "Nausea" },
      { id: "s_42", name: "Dizziness", common_name: "Dizziness" },
      { id: "s_101", name: "Shortness of breath", common_name: "Breathing difficulty" },
      { id: "s_28", name: "Chest pain", common_name: "Chest pain" },
      { id: "s_76", name: "Sore throat", common_name: "Throat pain" },
      { id: "s_84", name: "Body aches", common_name: "Muscle pain" }
    ];
  }

  private getMockDiagnosis(data: DiagnosisRequest): any {
    const { age, evidence } = data;
    const hasFever = evidence.some(e => e.id === 's_21' && e.choice_id === 'present');
    const hasCough = evidence.some(e => e.id === 's_98' && e.choice_id === 'present');
    const hasHeadache = evidence.some(e => e.id === 's_36' && e.choice_id === 'present');
    
    let conditions: Condition[] = [];
    
    if (hasFever && hasCough) {
      conditions = [
        { id: "c_1", name: "Influenza", probability: 0.72, common_name: "Flu" },
        { id: "c_2", name: "COVID-19", probability: 0.48, common_name: "Coronavirus" },
        { id: "c_3", name: "Common Cold", probability: 0.35, common_name: "Cold" }
      ];
    } else if (hasHeadache && hasFever) {
      conditions = [
        { id: "c_4", name: "Viral Infection", probability: 0.65, common_name: "Viral Fever" },
        { id: "c_5", name: "Sinusitis", probability: 0.45, common_name: "Sinus Infection" },
        { id: "c_6", name: "Migraine", probability: 0.30, common_name: "Migraine" }
      ];
    } else if (hasCough) {
      conditions = [
        { id: "c_7", name: "Acute Bronchitis", probability: 0.55, common_name: "Bronchitis" },
        { id: "c_8", name: "Upper Respiratory Infection", probability: 0.50, common_name: "URI" },
        { id: "c_9", name: "Allergic Rhinitis", probability: 0.40, common_name: "Allergies" }
      ];
    } else {
      conditions = [
        { id: "c_10", name: "General Malaise", probability: 0.60, common_name: "General Illness" },
        { id: "c_11", name: "Stress Related", probability: 0.45, common_name: "Stress" },
        { id: "c_12", name: "Dehydration", probability: 0.35, common_name: "Dehydration" }
      ];
    }
    
    return { conditions, question: null, should_stop: true };
  }

  private getMockExplanation(data: any): any {
    return {
      conditions: [
        {
          id: "c_1",
          name: "Influenza",
          common_name: "Flu",
          probability: 0.72,
          description: "Influenza is a viral infection that attacks your respiratory system."
        }
      ]
    };
  }

  async getSymptoms(): Promise<Symptom[]> {
    const data = await this.request('/symptoms');
    return data || this.getMockSymptoms();
  }

  async getDiagnosis(request: DiagnosisRequest): Promise<any> {
    const data = await this.request('/diagnosis', 'POST', request);
    return data;
  }

  async getExplanation(evidence: Evidence[], target: string): Promise<any> {
    const data = await this.request('/explain', 'POST', { evidence, target });
    return data;
  }

  async getConditionInfo(conditionId: string): Promise<any> {
    const data = await this.request(`/conditions/${conditionId}`);
    return data;
  }

  mapSymptomsToIds(symptomNames: string[]): Promise<Evidence[]> {
    // Simple mapping for common symptoms
    const symptomMapping: Record<string, string> = {
      'Fever': 's_21',
      'Cough': 's_98',
      'Headache': 's_36',
      'Fatigue': 's_45',
      'Nausea': 's_8',
      'Dizziness': 's_42',
      'Shortness of breath': 's_101',
      'Chest pain': 's_28',
      'Sore throat': 's_76',
      'Body aches': 's_84',
      'Runny nose': 's_79',
      'Sneezing': 's_82',
      'Chills': 's_23',
      'Vomiting': 's_95',
      'Diarrhea': 's_32',
      'Loss of taste/smell': 's_106',
      'Joint pain': 's_50',
      'Muscle pain': 's_84'
    };

    return Promise.resolve(
      symptomNames.map(name => ({
        id: symptomMapping[name] || `s_${Math.random()}`,
        choice_id: 'present'
      }))
    );
  }
}

export default new InfermedicaService();