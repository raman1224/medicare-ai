'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, Shield, Users } from 'lucide-react';
import { contactAPI } from '@/lib/api';
import ProtectedRoute from '@/components/auth/protected-route';
import DashboardNav from '@/components/dashboard/nav';
import Footer from '@/components/footer';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (7-15 digits)';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await contactAPI.sendContactMessage(formData);
      
      if (response.success) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setSubmitError(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
        <ProtectedRoute>  
        <DashboardNav />
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="text-blue-600">Medicare Nepal</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about healthcare services? Our team is ready to assist you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 h-full">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
                      <Mail className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600 text-sm md:text-base mt-1">dangolraman3@gmail.com</p>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-green-100 p-2 md:p-3 rounded-lg">
                      <Phone className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Emergency</h3>
                    <p className="text-gray-600 text-sm md:text-base mt-1">+977 1-XXXXXXX</p>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">24/7 Emergency Support</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
                      <MapPin className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-3 md:ml-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Head Office</h3>
                    <p className="text-gray-600 text-sm md:text-base mt-1">Kathmandu, Nepal</p>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">Serving Nationwide</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-gray-600 text-sm md:text-base">24/7 Healthcare Support</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-600 text-sm md:text-base">Certified Professionals</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-gray-600 text-sm md:text-base">Patient-Centered Care</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8">
              {isSubmitted ? (
                <div className="text-center py-8 md:py-12">
                  <div className="mx-auto flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-green-100 mb-4 md:mb-6">
                    <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                    Thank you for contacting Medicare Nepal. Our healthcare team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center px-5 py-2.5 md:px-6 md:py-3 border border-transparent text-sm md:text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Send us a Message</h2>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                      Fill out the form below and our healthcare team will contact you shortly.
                    </p>
                  </div>

                  {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm md:text-base">{submitError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 text-sm md:text-base rounded-lg border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:ring-2 focus:border-transparent outline-none transition-all duration-200`}
                          placeholder="Enter your full name"
                          disabled={isSubmitting}
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 text-sm md:text-base rounded-lg border ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:ring-2 focus:border-transparent outline-none transition-all duration-200`}
                          placeholder="Enter your email address"
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 text-sm md:text-base rounded-lg border ${errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:ring-2 focus:border-transparent outline-none transition-all duration-200`}
                        placeholder="Enter your phone number"
                        disabled={isSubmitting}
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 text-sm md:text-base rounded-lg border ${errors.message ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:ring-2 focus:border-transparent outline-none transition-all duration-200 resize-none`}
                        placeholder="Tell us about your healthcare needs, questions, or concerns..."
                        disabled={isSubmitting}
                      />
                      {errors.message && (
                        <p className="mt-2 text-sm text-red-600">{errors.message}</p>
                      )}
                      <p className="mt-2 text-xs md:text-sm text-gray-500">
                        Please provide detailed information for better assistance (minimum 10 characters)
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full md:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm md:text-base font-medium rounded-lg text-white ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 md:mr-3 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </button>
                      <p className="mt-3 text-xs md:text-sm text-gray-500">
                        * Required fields. Your information is secure and confidential.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Map/Info Section */}
            <div className="mt-6 md:mt-8 bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Healthcare Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 font-bold text-lg md:text-xl">24/7</div>
                  <div className="text-gray-600 text-xs md:text-sm mt-1">Emergency Support</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-green-600 font-bold text-lg md:text-xl">50+</div>
                  <div className="text-gray-600 text-xs md:text-sm mt-1">Certified Doctors</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-purple-600 font-bold text-lg md:text-xl">100+</div>
                  <div className="text-gray-600 text-xs md:text-sm mt-1">Hospitals Network</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-orange-600 font-bold text-lg md:text-xl">10K+</div>
                  <div className="text-gray-600 text-xs md:text-sm mt-1">Patients Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
                  <Footer />
    
    </ProtectedRoute>
  );
}

export default ContactPage;