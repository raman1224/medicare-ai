const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

async function testAuth() {
  console.log('Testing auth system...\n');
  
  try {
    // Test 1: Server health
    console.log('1. Testing server health...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Server is running:', health.data);
    
    // Test 2: API test endpoint
    console.log('\n2. Testing API endpoint...');
    const test = await axios.get(`${API_URL}/test`);
    console.log('✅ API is working:', test.data);
    
    // Test 3: Registration
    console.log('\n3. Testing registration...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      country: 'Nepal',
      language: 'English',
      role: 'patient'
    };
    
    try {
      const register = await axios.post(`${API_URL}/auth/register`, testUser);
      console.log('✅ Registration successful:', {
        success: register.data.success,
        token: register.data.token ? 'Present' : 'Missing',
        user: register.data.user ? 'Present' : 'Missing'
      });
      
      // Test 4: Login with registered user
      console.log('\n4. Testing login...');
      const login = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful:', {
        success: login.data.success,
        token: login.data.token ? 'Present' : 'Missing'
      });
      
      // Test 5: Get current user with token
      console.log('\n5. Testing get current user...');
      const me = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${login.data.token}`
        }
      });
      console.log('✅ Get current user successful:', {
        success: me.data.success,
        user: me.data.data ? 'Present' : 'Missing'
      });
      
    } catch (regError) {
      console.log('❌ Registration/Login test failed:', regError.response?.data || regError.message);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    if (error.response) {
      console.log('Response data:', error.response.data);
      console.log('Response status:', error.response.status);
    }
  }
}

testAuth();