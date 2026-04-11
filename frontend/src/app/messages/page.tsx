"use client";

import WhatsAppMessenger from '@/components/messenger/WhatsAppMessenger';
import { useAuth } from '@/context/auth-context';
import DashboardNav from '@/components/dashboard/nav';

export default function MessagesPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to access messages</p>
          <a
            href="/auth/login"
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
                 <DashboardNav />

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl font-bold text-white mb-6">Messages</h1>
        <WhatsAppMessenger />
      </div>
    </div>
        </>

  );
}