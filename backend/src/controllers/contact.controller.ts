import { Request, Response } from 'express';
import { sendContactEmail } from '../services/email.service';
import asyncHandler from 'express-async-handler';

// Define contact request interface
interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
}

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, message, subject } = req.body as ContactRequest;

  // Validation
  if (!name || !email || !phone || !message) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }

  // Phone validation (simple check)
  if (phone.length < 7) {
    res.status(400);
    throw new Error('Please enter a valid phone number');
  }

  // Message length validation
  if (message.length < 10) {
    res.status(400);
    throw new Error('Message must be at least 10 characters');
  }

  const emailSubject = subject || `New Contact Message from ${name} - Medicare Nepal`;
  
  // Send email
  await sendContactEmail({
    to: process.env.CONTACT_EMAIL || 'dangolraman3@gmail.com',
    subject: emailSubject,
    name,
    email,
    phone,
    message
  });

  res.status(200).json({
    success: true,
    message: 'Message sent successfully. We will contact you soon.'
  });
});