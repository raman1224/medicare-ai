export class DiseaseDatabase {
  private diseases: Map<string, any> = new Map();
  private symptoms: string[] = [];

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Comprehensive disease database with symptoms, medicines, and advice
    const diseaseData = [
      {
        id: "dengue",
        name: "Dengue Fever",
        commonName: "Dengue",
        symptoms: ["Fever", "Headache", "Body aches", "Fatigue", "Nausea", "Joint pain", "Rash"],
        symptomWeights: {
          "Fever": 0.9,
          "Headache": 0.7,
          "Body aches": 0.85,
          "Fatigue": 0.8,
          "Nausea": 0.6,
          "Joint pain": 0.75,
          "Rash": 0.5
        },
        severity: "High",
        medicines: [
          { name: "Paracetamol 500mg", dosage: "1 tablet every 6 hours", for: "Fever and pain", note: "Avoid aspirin and ibuprofen" },
          { name: "Oral Rehydration Salts (ORS)", dosage: "As needed", for: "Hydration", note: "Prevents dehydration" }
        ],
        homeCare: [
          "Drink plenty of fluids (water, ORS, coconut water)",
          "Complete bed rest",
          "Monitor platelet count",
          "Use mosquito net to prevent spread"
        ],
        foods: [
          "Papaya leaf juice (may help increase platelets)",
          "Pomegranate",
          "Coconut water",
          "Herbal teas",
          "Light soups"
        ],
        avoid: [
          "Aspirin and ibuprofen (risk of bleeding)",
          "Dark-colored urine foods",
          "Oily and spicy foods",
          "Caffeine"
        ],
        whenToSeeDoctor: [
          "Severe abdominal pain",
          "Persistent vomiting",
          "Bleeding gums or nose",
          "Blood in vomit or stool",
          "Difficulty breathing"
        ]
      },
      {
        id: "viral_fever",
        name: "Viral Fever (Influenza/Flu)",
        commonName: "Flu",
        symptoms: ["Fever", "Cough", "Headache", "Fatigue", "Body aches", "Sore throat", "Runny nose"],
        symptomWeights: {
          "Fever": 0.85,
          "Cough": 0.7,
          "Headache": 0.65,
          "Fatigue": 0.8,
          "Body aches": 0.75,
          "Sore throat": 0.6,
          "Runny nose": 0.55
        },
        severity: "Moderate",
        medicines: [
          { name: "Paracetamol 500mg", dosage: "1 tablet every 6 hours", for: "Fever and pain", note: "Max 4g per day" },
          { name: "Cetirizine 10mg", dosage: "1 tablet daily", for: "Runny nose and allergies", note: "May cause drowsiness" },
          { name: "Cough syrup", dosage: "As directed", for: "Cough relief", note: "Choose based on cough type" }
        ],
        homeCare: [
          "Get plenty of rest (7-9 hours sleep)",
          "Stay hydrated (2-3 liters water daily)",
          "Gargle with warm salt water for sore throat",
          "Use humidifier for congestion"
        ],
        foods: [
          "Chicken soup",
          "Ginger tea with honey",
          "Warm lemon water",
          "Garlic",
          "Citrus fruits (Vitamin C)"
        ],
        avoid: [
          "Cold drinks and ice cream",
          "Dairy products (may increase mucus)",
          "Alcohol",
          "Smoking",
          "Processed sugar"
        ],
        whenToSeeDoctor: [
          "Fever above 39.5°C (103°F)",
          "Difficulty breathing",
          "Chest pain",
          "Confusion",
          "Symptoms lasting > 7 days"
        ]
      },
      {
        id: "typhoid",
        name: "Typhoid Fever",
        commonName: "Typhoid",
        symptoms: ["Fever", "Headache", "Fatigue", "Abdominal pain", "Nausea", "Constipation", "Loss of appetite"],
        symptomWeights: {
          "Fever": 0.9,
          "Headache": 0.7,
          "Fatigue": 0.8,
          "Abdominal pain": 0.75,
          "Nausea": 0.65,
          "Constipation": 0.6,
          "Loss of appetite": 0.7
        },
        severity: "High",
        medicines: [
          { name: "Azithromycin 500mg", dosage: "1 tablet daily for 5-7 days", for: "Bacterial infection", note: "Take with food" },
          { name: "Paracetamol 500mg", dosage: "1 tablet every 6 hours", for: "Fever", note: "As needed" },
          { name: "Probiotics", dosage: "As directed", for: "Gut health", note: "During and after antibiotics" }
        ],
        homeCare: [
          "Complete bed rest",
          "Strict hydration",
          "Maintain hygiene",
          "Monitor temperature regularly"
        ],
        foods: [
          "Rice porridge (congee)",
          "Bananas",
          "Applesauce",
          "Toast",
          "Clear soups"
        ],
        avoid: [
          "Solid foods until fever subsides",
          "Spicy and oily foods",
          "Raw vegetables",
          "Unpasteurized milk",
          "Street food"
        ],
        whenToSeeDoctor: [
          "High fever > 5 days",
          "Severe abdominal pain",
          "Blood in stool",
          "Confusion",
          "Dehydration signs"
        ]
      },
      {
        id: "malaria",
        name: "Malaria",
        commonName: "Malaria",
        symptoms: ["Fever", "Headache", "Body aches", "Fatigue", "Nausea", "Chills", "Sweating"],
        symptomWeights: {
          "Fever": 0.9,
          "Headache": 0.7,
          "Body aches": 0.75,
          "Fatigue": 0.8,
          "Nausea": 0.6,
          "Chills": 0.85,
          "Sweating": 0.8
        },
        severity: "High",
        medicines: [
          { name: "Artemether/Lumefantrine", dosage: "As prescribed", for: "Malaria treatment", note: "Complete full course" },
          { name: "Paracetamol 500mg", dosage: "1 tablet every 6 hours", for: "Fever", note: "For symptom relief" }
        ],
        homeCare: [
          "Rest in a cool, dark room",
          "Drink plenty of fluids",
          "Use mosquito nets",
          "Monitor fever patterns"
        ],
        foods: [
          "Light, easily digestible foods",
          "Coconut water",
          "Fresh juices",
          "Soups",
          "Fruits"
        ],
        avoid: [
          "Strenuous activity",
          "Alcohol",
          "Caffeine",
          "Heavy meals"
        ],
        whenToSeeDoctor: [
          "High fever with chills",
          "Severe headache",
          "Difficulty breathing",
          "Jaundice",
          "Seizures"
        ]
      },
      {
        id: "gastroenteritis",
        name: "Gastroenteritis (Stomach Flu)",
        commonName: "Stomach Infection",
        symptoms: ["Nausea", "Diarrhea", "Vomiting", "Abdominal pain", "Fatigue", "Headache"],
        symptomWeights: {
          "Nausea": 0.85,
          "Diarrhea": 0.9,
          "Vomiting": 0.85,
          "Abdominal pain": 0.7,
          "Fatigue": 0.6,
          "Headache": 0.5
        },
        severity: "Moderate",
        medicines: [
          { name: "Oral Rehydration Salts (ORS)", dosage: "After each loose stool", for: "Hydration", note: "Most important" },
          { name: "Probiotics", dosage: "2 times daily", for: "Gut health", note: "Helps recovery" },
          { name: "Loperamide", dosage: "As directed", for: "Diarrhea", note: "Only if no fever/blood" }
        ],
        homeCare: [
          "Strict hydration with ORS",
          "Rest digestive system",
          "BRAT diet (Bananas, Rice, Applesauce, Toast)",
          "Hand washing"
        ],
        foods: [
          "Bananas",
          "Rice",
          "Applesauce",
          "Toast",
          "Clear broths",
          "Yogurt"
        ],
        avoid: [
          "Dairy products",
          "Spicy foods",
          "Fried foods",
          "Caffeine",
          "Alcohol",
          "Raw vegetables"
        ],
        whenToSeeDoctor: [
          "Diarrhea > 3 days",
          "Blood in stool",
          "High fever",
          "Severe abdominal pain",
          "Signs of dehydration"
        ]
      },
      {
        id: "migraine",
        name: "Migraine",
        commonName: "Severe Headache",
        symptoms: ["Headache", "Nausea", "Sensitivity to light", "Sensitivity to sound", "Blurred vision"],
        symptomWeights: {
          "Headache": 0.95,
          "Nausea": 0.7,
          "Sensitivity to light": 0.85,
          "Sensitivity to sound": 0.8,
          "Blurred vision": 0.65
        },
        severity: "Moderate",
        medicines: [
          { name: "Ibuprofen 400mg", dosage: "1 tablet every 8 hours", for: "Pain relief", note: "Take with food" },
          { name: "Sumatriptan", dosage: "As prescribed", for: "Migraine-specific", note: "Doctor prescription needed" }
        ],
        homeCare: [
          "Rest in dark, quiet room",
          "Apply cold compress to head",
          "Sleep regular hours",
          "Avoid triggers"
        ],
        foods: [
          "Ginger tea",
          "Magnesium-rich foods (nuts, seeds)",
          "Hydrating fluids",
          "Small, frequent meals"
        ],
        avoid: [
          "Bright lights",
          "Loud noises",
          "Caffeine (if trigger)",
          "Alcohol",
          "Skipping meals"
        ],
        whenToSeeDoctor: [
          "Sudden severe headache",
          "Headache with fever",
          "Vision changes",
          "Frequent attacks (>4/month)",
          "Neurological symptoms"
        ]
      },
      {
        id: "uti",
        name: "Urinary Tract Infection (UTI)",
        commonName: "UTI",
        symptoms: ["Fever", "Abdominal pain", "Nausea", "Burning urination", "Frequent urination"],
        symptomWeights: {
          "Fever": 0.7,
          "Abdominal pain": 0.65,
          "Nausea": 0.5,
          "Burning urination": 0.9,
          "Frequent urination": 0.85
        },
        severity: "High",
        medicines: [
          { name: "Nitrofurantoin", dosage: "As prescribed", for: "Bacterial infection", note: "Complete full course" },
          { name: "Paracetamol 500mg", dosage: "1 tablet every 6 hours", for: "Pain and fever", note: "For symptom relief" },
          { name: "Cranberry extract", dosage: "As directed", for: "Prevention", note: "Not a treatment" }
        ],
        homeCare: [
          "Drink 2-3 liters water daily",
          "Urinate frequently",
          "Avoid holding urine",
          "Wear cotton underwear"
        ],
        foods: [
          "Cranberry juice",
          "Water",
          "Blueberries",
          "Probiotic yogurt",
          "Vitamin C rich foods"
        ],
        avoid: [
          "Caffeine",
          "Alcohol",
          "Spicy foods",
          "Carbonated drinks",
          "Artificial sweeteners"
        ],
        whenToSeeDoctor: [
          "Fever with chills",
          "Back pain",
          "Blood in urine",
          "Nausea/vomiting",
          "Symptoms > 3 days"
        ]
      },
      {
        id: "pneumonia",
        name: "Pneumonia",
        commonName: "Lung Infection",
        symptoms: ["Fever", "Cough", "Shortness of breath", "Chest pain", "Fatigue", "Chills"],
        symptomWeights: {
          "Fever": 0.85,
          "Cough": 0.9,
          "Shortness of breath": 0.95,
          "Chest pain": 0.8,
          "Fatigue": 0.7,
          "Chills": 0.75
        },
        severity: "Critical",
        medicines: [
          { name: "Amoxicillin", dosage: "As prescribed", for: "Bacterial infection", note: "Doctor prescription needed" },
          { name: "Paracetamol 500mg", dosage: "1 tablet every 6 hours", for: "Fever", note: "For symptom relief" }
        ],
        homeCare: [
          "Complete bed rest",
          "Stay hydrated",
          "Use humidifier",
          "Deep breathing exercises"
        ],
        foods: [
          "Warm soups",
          "Garlic",
          "Ginger tea",
          "Honey",
          "Protein-rich foods"
        ],
        avoid: [
          "Cold foods",
          "Dairy (may increase mucus)",
          "Alcohol",
          "Smoking"
        ],
        whenToSeeDoctor: [
          "Difficulty breathing",
          "Chest pain",
          "High fever",
          "Coughing blood",
          "Bluish lips/nails"
        ]
      }
    ];

    // Store diseases
    diseaseData.forEach(disease => {
      this.diseases.set(disease.id, disease);
    });

    // Collect all unique symptoms
    const allSymptoms = new Set<string>();
    diseaseData.forEach(disease => {
      disease.symptoms.forEach(symptom => allSymptoms.add(symptom));
    });
    this.symptoms = Array.from(allSymptoms).sort();
  }

  getAllSymptoms(): string[] {
    return this.symptoms;
  }

  analyzeSymptoms(symptoms: string[], symptomDetails: any, temperature: string, duration: string): any {
    // Calculate match scores for each disease
    const scores: Array<{ disease: any, score: number, matchCount: number }> = [];
    
    this.diseases.forEach((disease) => {
      let score = 0;
      let matchCount = 0;
      
      symptoms.forEach(symptom => {
        if (disease.symptoms.includes(symptom)) {
          const weight = disease.symptomWeights[symptom] || 0.5;
          score += weight;
          matchCount++;
        }
      });
      
      // Normalize score based on number of symptoms
      const normalizedScore = (score / disease.symptoms.length) * 100;
      
      scores.push({
        disease,
        score: normalizedScore,
        matchCount
      });
    });
    
    // Sort by score descending and get top 5
    const topConditions = scores
      .filter(s => s.score > 15)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => ({
        id: s.disease.id,
        name: s.disease.name,
        commonName: s.disease.commonName,
        probability: Math.min(Math.round(s.score), 95),
        description: this.getDiseaseDescription(s.disease.id),
        severity: s.disease.severity,
        matchCount: s.matchCount
      }));
    
    // Determine urgency based on symptoms and temperature
    const urgency = this.calculateUrgency(symptoms, temperature, topConditions);
    
    // Get recommendations for top condition
    const topDisease = topConditions[0]?.id ? this.diseases.get(topConditions[0].id) : null;
    
    const recommendations = topDisease ? {
      do: [
        "Get plenty of rest and sleep 7-9 hours",
        "Stay hydrated - drink 2-3 liters of water daily",
        "Monitor symptoms and temperature",
        "Take prescribed medications as directed"
      ],
      dont: [
        "Avoid smoking and alcohol",
        "Don't skip meals - eat light, nutritious food",
        "Avoid self-medication with antibiotics",
        "Don't ignore worsening symptoms"
      ],
      medications: topDisease.medicines || [],
      homeCare: topDisease.homeCare || [],
      foods: topDisease.foods || [],
      avoid: topDisease.avoid || [],
      whenToSeeDoctor: topDisease.whenToSeeDoctor || []
    } : {
      do: [
        "Get plenty of rest and sleep",
        "Stay hydrated",
        "Monitor symptoms",
        "Consult a doctor if symptoms persist"
      ],
      dont: [
        "Avoid self-medication",
        "Don't ignore persistent symptoms",
        "Avoid smoking and alcohol"
      ],
      medications: [],
      homeCare: [],
      foods: [],
      avoid: [],
      whenToSeeDoctor: [
        "Symptoms worsen",
        "Fever persists > 3 days",
        "Severe pain",
        "Difficulty breathing"
      ]
    };
    
    return {
      conditions: topConditions,
      urgency,
      recommendations,
      message: topConditions.length > 0 
        ? `Based on your symptoms, you may have ${topConditions[0].name}. This is AI-generated and not a final diagnosis.`
        : "No specific condition found. Please consult a doctor for proper diagnosis.",
      disclaimer: "This is an AI-powered preliminary assessment. Always consult a qualified healthcare provider for accurate diagnosis and treatment."
    };
  }

  private getDiseaseDescription(diseaseId: string): string {
    const descriptions: Record<string, string> = {
      dengue: "Dengue is a mosquito-borne viral infection causing high fever, severe headache, joint pain, and rash. It requires proper monitoring as it can lead to complications.",
      viral_fever: "Viral fever is a common condition caused by various viruses. It typically resolves on its own with rest and hydration within 5-7 days.",
      typhoid: "Typhoid is a bacterial infection spread through contaminated food or water. It causes prolonged fever and requires antibiotic treatment.",
      malaria: "Malaria is a mosquito-borne parasitic infection causing cyclical fevers with chills and sweating. It requires specific antimalarial treatment.",
      gastroenteritis: "Gastroenteritis is inflammation of the stomach and intestines, usually caused by viral or bacterial infection. It causes diarrhea, vomiting, and dehydration.",
      migraine: "Migraine is a neurological condition characterized by severe, throbbing headaches often accompanied by nausea and sensitivity to light and sound.",
      uti: "Urinary tract infection is a bacterial infection affecting the urinary system. It causes burning sensation during urination and frequent urges.",
      pneumonia: "Pneumonia is a serious lung infection that inflames air sacs, causing cough with phlegm, fever, and difficulty breathing. Requires prompt medical attention."
    };
    return descriptions[diseaseId] || "This condition requires medical evaluation. Please consult a healthcare provider for accurate diagnosis.";
  }

  private calculateUrgency(symptoms: string[], temperature: string, conditions: any[]): string {
    const urgentSymptoms = [
      "Chest pain", "Shortness of breath", "Difficulty breathing",
      "Severe bleeding", "Loss of consciousness", "Seizure"
    ];
    
    const hasUrgentSymptom = symptoms.some(s => urgentSymptoms.includes(s));
    
    if (hasUrgentSymptom) return "Critical";
    
    const temp = parseFloat(temperature);
    if (!isNaN(temp) && temp > 39.5) return "High";
    
    const hasHighRisk = conditions.some(c => c.severity === "High" || c.severity === "Critical");
    if (hasHighRisk) return "High";
    
    if (symptoms.length > 5 || (!isNaN(temp) && temp > 38.5)) return "Moderate";
    
    return "Low";
  }
}