import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import './config/oauth'; // Import OAuth config

const app = express();
const PORT = 5000;

// Basic middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Test server running' });
});

// OAuth routes
app.get('/api/v1/auth/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

app.get('/api/v1/auth/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Mock success redirect
    res.redirect('http://localhost:3000/auth/oauth-callback?token=test-token&user={}');
  }
);

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Google OAuth: http://localhost:${PORT}/api/v1/auth/google`);
});