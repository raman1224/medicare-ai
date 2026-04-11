
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithGithub } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check URL for OAuth parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userData = urlParams.get('user');
        
        if (token && userData) {
          const user = JSON.parse(decodeURIComponent(userData));
          
          // Set token and user
          // localStorage.setItem('medicare_token', token);
          // localStorage.setItem('medicare_user', userData);
          
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Redirect based on role
          if (user.role === 'doctor') {
            router.push('/dashboard/doctor');
          } else {
            router.push('/dashboard');
          }
        } else {
          // No token in URL, check for error
          const error = urlParams.get('error');
          if (error) {
            router.push(`/auth/login?error=${error}`);
          } else {
            router.push('/auth/login');
          }
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.push('/auth/login?error=oauth_failed');
      }
    };

    handleCallback();
  }, [router]);

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-white mb-2">Completing OAuth Login</h2>
        <p className="text-gray-400">Please wait while we authenticate you...</p>
      </div>
    </div>
  );
}
