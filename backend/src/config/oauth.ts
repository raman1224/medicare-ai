// backend/src/config/oauth.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User';
import dotenv from 'dotenv';

// Force load environment variables
dotenv.config();

// Debug: Log environment variables
console.log('=== OAuth Configuration Debug ===');
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_ID value:', process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...');
console.log('GITHUB_CLIENT_ID exists:', !!process.env.GITHUB_CLIENT_ID);
console.log('GITHUB_CLIENT_ID value:', process.env.GITHUB_CLIENT_ID?.substring(0, 10) + '...');
console.log('================================');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// FORCE GitHub strategy registration (remove the condition for testing)
try {
  console.log('🔧 Registering GitHub Strategy...');
  
  // Get credentials with fallback for testing
  const githubClientId = process.env.GITHUB_CLIENT_ID || 'Ov23liBkCx9rPz6x7fR0';
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || '0c6de60a3c9d821c9f04f08ba2a05d6f943a3359';
  
  console.log('GitHub Client ID (first 10 chars):', githubClientId.substring(0, 10));
  console.log('GitHub Callback URL:', `${SERVER_URL}/api/v1/auth/github/callback`);
  
  passport.use(
    new GitHubStrategy(
      {
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: `${SERVER_URL}/api/v1/auth/github/callback`,
        scope: ['user:email'],
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          console.log('✅ GitHub OAuth profile received:', profile.id, profile.username);
          
          const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
          
          let user = await User.findOne({ 
            $or: [
              { email },
              { githubId: profile.id }
            ]
          });
          
          if (!user) {
            user = await User.create({
              name: profile.displayName || profile.username,
              email,
              avatar: profile.photos?.[0]?.value,
              authProvider: 'github',
              githubId: profile.id,
              isVerified: true,
              role: 'patient',
              password: undefined
            });
            console.log('✅ New GitHub user created:', user.email);
          } else {
            user.githubId = profile.id;
            user.authProvider = 'github';
            user.lastLogin = new Date();
            user.isVerified = true;
            if (!user.avatar && profile.photos?.[0]?.value) {
              user.avatar = profile.photos?.[0]?.value;
            }
            await user.save();
            console.log('✅ Existing user updated via GitHub:', user.email);
          }
          
          return done(null, user);
        } catch (error) {
          console.error('❌ GitHub OAuth callback error:', error);
          return done(error as Error, undefined);
        }
      }
    )
  );
  console.log('✅ GitHub strategy registered successfully');
} catch (error) {
  console.error('❌ Failed to register GitHub strategy:', error);
}

// Register Google Strategy similarly
try {
  console.log('🔧 Registering Google Strategy...');
  
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (googleClientId && googleClientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: googleClientId,
          clientSecret: googleClientSecret,
          callbackURL: `${SERVER_URL}/api/v1/auth/google/callback`,
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            console.log('✅ Google OAuth profile received:', profile.id);
            
            let user = await User.findOne({ 
              $or: [
                { email: profile.emails?.[0]?.value },
                { googleId: profile.id }
              ]
            });
            
            if (!user) {
              user = await User.create({
                name: profile.displayName,
                email: profile.emails?.[0]?.value,
                avatar: profile.photos?.[0]?.value,
                authProvider: 'google',
                googleId: profile.id,
                isVerified: true,
                role: 'patient',
                password: undefined
              });
              console.log('✅ New Google user created:', user.email);
            } else {
              user.googleId = profile.id;
              user.authProvider = 'google';
              user.lastLogin = new Date();
              user.isVerified = true;
              await user.save();
              console.log('✅ Existing user updated via Google:', user.email);
            }
            
            return done(null, user as any);
          } catch (error) {
            console.error('❌ Google OAuth callback error:', error);
            return done(error as Error, undefined);
          }
        }
      )
    );
    console.log('✅ Google strategy registered successfully');
  } else {
    console.warn('⚠️ Google credentials missing, skipping Google strategy');
  }
} catch (error) {
  console.error('❌ Failed to register Google strategy:', error);
}

// Serialize/Deserialize
// backend/src/config/oauth.ts (add at the end)
// Make sure serialize/deserialize are properly set
passport.serializeUser((user: any, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    console.log('Deserializing user:', id);
    const user = await User.findById(id);
    done(null, user as any);
  } catch (error) {
    console.error('Deserialize error:', error);
    done(error, null);
  }
});


console.log('✅ Passport OAuth configuration complete');
// console.log('Registered strategies:', Object.keys(passport._strategies).join(', '));

export default passport;