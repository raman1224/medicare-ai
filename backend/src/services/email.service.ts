
// src/services/email.service.ts
import nodemailer from 'nodemailer';
export interface ContactEmailData {
  to: string;
  subject: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}
export const sendContactEmail = async (data: ContactEmailData) => {
  try {
    // Use SendGrid SMTP configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Medicare Nepal - New Contact Message</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px; }
            .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; color: #4b5563; font-size: 14px; margin-bottom: 5px; }
            .field-value { color: #111827; padding: 10px; background-color: white; border-radius: 6px; border: 1px solid #d1d5db; font-size: 15px; }
            .message-box { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin-top: 20px; }
            .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
            .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏥 Medicare Nepal</div>
              <h2 style="margin: 10px 0 0 0; font-weight: 500;">New Contact Form Submission</h2>
            </div>
            
            <div class="content">
              <div class="info-box">
                <h3 style="color: #1e40af; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Contact Information</h3>
                
                <div class="field">
                  <div class="field-label">👤 Name:</div>
                  <div class="field-value">${data.name}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">📧 Email:</div>
                  <div class="field-value">
                    <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a>
                  </div>
                </div>
                
                <div class="field">
                  <div class="field-label">📱 Phone:</div>
                  <div class="field-value">
                    <a href="tel:${data.phone}" style="color: #2563eb; text-decoration: none;">${data.phone}</a>
                  </div>
                </div>
                
                <div class="field">
                  <div class="field-label">🕒 Submitted at:</div>
                  <div class="field-value">${new Date().toLocaleString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</div>
                </div>
              </div>
              
              <div class="message-box">
                <div class="field-label">💬 Message:</div>
                <div style="white-space: pre-wrap; padding: 15px; background: white; border-radius: 6px; margin-top: 10px; line-height: 1.6;">
                  ${data.message}
                </div>
              </div>
              
              <div style="margin-top: 30px; padding: 15px; background-color: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
                <p style="margin: 0; color: #166534;">
                  <strong>⚠️ Action Required:</strong> Please respond to this inquiry within 24 hours.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">
                This message was sent from the Medicare Nepal website contact form.<br>
                <strong>📧 Reply to:</strong> ${data.email}<br>
                <strong>© ${new Date().getFullYear()} Medicare Nepal.</strong> All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || `"${process.env.FROM_NAME || 'Medicare Nepal'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: data.to,
      subject: data.subject,
      html: htmlContent,
      text: `
        Medicare Nepal - New Contact Message
        ====================================
        
        📋 Contact Information:
        ------------------------
        👤 Name: ${data.name}
        📧 Email: ${data.email}
        📱 Phone: ${data.phone}
        🕒 Submitted: ${new Date().toLocaleString()}
        
        💬 Message:
        -----------
        ${data.message}
        
        ====================================
        🏥 Medicare Nepal
        📧 Reply to: ${data.email}
        © ${new Date().getFullYear()} Medicare Nepal
        
        This message was sent from the Medicare Nepal website contact form.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact email sent successfully:', info.messageId);
    console.log('📧 To:', data.to);
    console.log('👤 From:', data.name, `<${data.email}>`);
    return info;
  } catch (error: any) {
    console.error('❌ Error sending contact email:', error.message);
    console.error('📧 SMTP Details:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM
    });
    throw new Error(`Failed to send contact email: ${error.message}`);
  }
};
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

// Free email service using SendGrid (100 emails/day free)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'apikey',
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Medicare Nepal'}" <${process.env.FROM_EMAIL || 'noreply@medicarenepal.com'}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', options.to);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Don't throw error in production to avoid breaking user experience
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
  }
};

// Email templates for Medicare Nepal
export const emailTemplates = {
  welcome: (name: string, verificationLink: string) => ({
    subject: 'Welcome to Medicare Nepal - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Medicare Nepal!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <p style="font-size: 16px; color: #333;">Hello ${name},</p>
          <p style="font-size: 16px; color: #333;">Thank you for joining Medicare Nepal - your trusted healthcare companion.</p>
          <p style="font-size: 16px; color: #333;">Please verify your email address to complete your registration:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
          </div>
          <p style="font-size: 14px; color: #666;">If you didn't create an account, please ignore this email.</p>
          <p style="font-size: 14px; color: #666;">Best regards,<br>The Medicare Nepal Team</p>
        </div>
      </div>
    `,
  }),

  appointmentConfirmation: (appointmentDetails: any) => ({
    subject: 'Appointment Confirmed - Medicare Nepal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Appointment Confirmed! ✅</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <p style="font-size: 16px; color: #333;">Your appointment has been successfully booked.</p>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Appointment Details:</h3>
            <p><strong>Doctor:</strong> ${appointmentDetails.doctorName}</p>
            <p><strong>Date:</strong> ${appointmentDetails.date}</p>
            <p><strong>Time:</strong> ${appointmentDetails.time}</p>
            <p><strong>Type:</strong> ${appointmentDetails.type}</p>
            ${appointmentDetails.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${appointmentDetails.meetingLink}">Click to Join</a></p>` : ''}
          </div>
          <p style="font-size: 14px; color: #666;">Please arrive 10 minutes before your appointment time.</p>
          <p style="font-size: 14px; color: #666;">Best regards,<br>The Medicare Nepal Team</p>
        </div>
      </div>
    `,
  }),

  emergencyAlert: (emergencyDetails: any) => ({
    subject: '🚨 EMERGENCY ALERT - Immediate Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🚨 EMERGENCY ALERT</h1>
        </div>
        <div style="padding: 30px; background: #fff5f5;">
          <p style="font-size: 16px; color: #333; font-weight: bold;">Urgent medical attention required!</p>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ff0000;">
            <h3 style="color: #333; margin-top: 0;">Emergency Details:</h3>
            <p><strong>Patient:</strong> ${emergencyDetails.patientName}</p>
            <p><strong>Symptoms:</strong> ${emergencyDetails.symptoms}</p>
            <p><strong>Location:</strong> ${emergencyDetails.location}</p>
            <p><strong>Contact:</strong> ${emergencyDetails.contact}</p>
          </div>
          <div style="background: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #d32f2f; margin-top: 0;">Immediate Actions:</h4>
            <ol style="color: #333;">
              <li>Call Emergency Services: <strong>${process.env.EMERGENCY_PHONE || '102'}</strong></li>
              <li>Notify nearest hospital emergency department</li>
              <li>Stay with the patient until help arrives</li>
            </ol>
          </div>
          <p style="font-size: 12px; color: #999;">This is an automated emergency alert from Medicare Nepal.</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (name: string, resetLink: string) => ({
    subject: 'Reset Your Password - Medicare Nepal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <p style="font-size: 16px; color: #333;">Hello ${name},</p>
          <p style="font-size: 16px; color: #333;">You requested to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #666;">This link will expire in 1 hour.</p>
          <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          <p style="font-size: 14px; color: #666;">Best regards,<br>The Medicare Nepal Team</p>
        </div>
      </div>
    `,
  }),
};
