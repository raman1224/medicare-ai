import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Mock data for blood bank
const mockDonors = [
  {
    _id: '1',
    name: 'Ramesh Sharma',
    email: 'ramesh@example.com',
    bloodGroup: 'O+',
    location: { province: 'Bagmati', district: 'Kathmandu', address: 'Thamel' },
    lastDonation: '2024-01-15',
    donorAvailable: true,
    verified: true,
    totalDonations: 5
  },
  {
    _id: '2',
    name: 'Sita Maharjan',
    email: 'sita@example.com',
    bloodGroup: 'B-',
    location: { province: 'Gandaki', district: 'Pokhara', address: 'Lakeside' },
    lastDonation: '2024-02-10',
    donorAvailable: true,
    verified: true,
    totalDonations: 3
  },
  {
    _id: '3',
    name: 'Hari Prasad',
    email: 'hari@example.com',
    bloodGroup: 'A+',
    location: { province: 'Province 1', district: 'Biratnagar', address: 'Main Road' },
    lastDonation: '2024-01-20',
    donorAvailable: false,
    verified: false,
    totalDonations: 2
  }
];

const mockRequests = [
  {
    _id: '101',
    bloodGroup: 'O+',
    units: 2,
    urgency: 'High',
    location: { province: 'Bagmati', district: 'Kathmandu', address: 'Teaching Hospital' },
    patientInfo: { name: 'Patient A', age: 45, gender: 'male', condition: 'Surgery' },
    contact: { phone: '9812345678', relationship: 'Son' },
    requiredBy: '2024-03-01',
    status: 'Pending',
    createdAt: new Date().toISOString()
  },
  {
    _id: '102',
    bloodGroup: 'B-',
    units: 1,
    urgency: 'Critical',
    location: { province: 'Gandaki', district: 'Pokhara', address: 'Manipal Hospital' },
    patientInfo: { name: 'Patient B', age: 60, gender: 'female', condition: 'Accident' },
    contact: { phone: '9823456789', relationship: 'Daughter' },
    requiredBy: '2024-02-28',
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
];

// Blood Bank Routes
app.get('/api/v1/blood/requests', (req, res) => {
  const { bloodGroup, urgency, province } = req.query;
  let filtered = [...mockRequests];
  
  if (bloodGroup) filtered = filtered.filter(r => r.bloodGroup === bloodGroup);
  if (urgency) filtered = filtered.filter(r => r.urgency === urgency);
  if (province) filtered = filtered.filter(r => r.location.province === province);
  
  res.json({
    success: true,
    count: filtered.length,
    total: mockRequests.length,
    data: filtered
  });
});

app.post('/api/v1/blood/requests', (req, res) => {
  const newRequest = {
    _id: Date.now().toString(),
    ...req.body,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    data: newRequest
  });
});

app.get('/api/v1/blood/donors', (req, res) => {
  const { bloodGroup, location } = req.query;
  let filtered = [...mockDonors];
  
  if (bloodGroup) filtered = filtered.filter(d => d.bloodGroup === bloodGroup);
  if (location) filtered = filtered.filter(d => d.location.province === location);
  
  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

app.get('/api/v1/blood/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalDonors: 2458,
      availableDonors: 1475,
      totalRequests: 1234,
      urgentNeeds: 12,
      livesSaved: 1234,
      bloodGroups: [
        { _id: 'A+', count: 450 },
        { _id: 'A-', count: 120 },
        { _id: 'B+', count: 380 },
        { _id: 'B-', count: 95 },
        { _id: 'O+', count: 620 },
        { _id: 'O-', count: 180 },
        { _id: 'AB+', count: 75 },
        { _id: 'AB-', count: 38 }
      ]
    }
  });
});

app.post('/api/v1/blood/donors/register', (req, res) => {
  res.json({
    success: true,
    data: {
      _id: Date.now().toString(),
      ...req.body,
      role: 'donor',
      donorAvailable: true,
      verified: false,
      totalDonations: 0
    }
  });
});

app.put('/api/v1/blood/donors/status', (req, res) => {
  res.json({
    success: true,
    data: { donorAvailable: req.body.available }
  });
});

app.post('/api/v1/blood/requests/:id/match', (req, res) => {
  res.json({
    success: true,
    data: {
      matchingDonors: mockDonors.slice(0, 3),
      matchCount: 3
    }
  });
});

// User routes for donor profile
app.get('/api/v1/users/me', (req, res) => {
  res.json({
    success: true,
    data: {
      _id: 'user123',
      name: 'Current User',
      email: 'user@example.com',
      role: 'donor',
      bloodGroup: 'O+',
      lastDonation: '2024-01-15',
      donorAvailable: true,
      donorVerified: true,
      totalDonations: 5
    }
  });
});

app.put('/api/v1/users/update-role', (req, res) => {
  res.json({
    success: true,
    data: { role: req.body.role }
  });
});

app.put('/api/v1/users/donor-info', (req, res) => {
  res.json({
    success: true,
    data: req.body
  });
});

app.put('/api/v1/users/donor-status', (req, res) => {
  res.json({
    success: true,
    data: { donorAvailable: req.body.available }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api/v1`);
});

// Try to connect to MongoDB but don't fail if it doesn't work
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medicare')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.log('⚠️ MongoDB not connected - using mock data');
    console.log(err.message);
  });