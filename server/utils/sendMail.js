import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createEmailTemplate = (options) => {
  // Extract OTP from message if it exists
  const otpMatch = options.message.match(/\d{6}/);
  const otp = otpMatch ? otpMatch[0] : '';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${options.subject}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #0a0a0a;
          color: #ffffff;
        }
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, rgba(255, 59, 48, 0.8) 0%, rgba(255, 45, 85, 0.8) 100%);
          padding: 40px 20px;
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .header h1 {
          margin: 0;
          font-size: 2.5em;
          font-weight: 700;
          background: linear-gradient(to right, #ffffff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .content {
          padding: 40px 30px;
          background: rgba(255, 255, 255, 0.05);
        }
        .greeting {
          font-size: 1.2em;
          color: #ffffff;
          margin-bottom: 30px;
          text-align: center;
        }
        .otp-container {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 30px;
          margin: 20px 0;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
        }
        .otp-number {
          font-size: 3em;
          font-weight: 700;
          letter-spacing: 8px;
          color: #ffffff;
          text-shadow: 0 0 10px rgba(255, 59, 48, 0.5);
          margin: 20px 0;
          font-family: monospace;
        }
        .notice {
          font-size: 0.9em;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin-top: 30px;
          padding: 20px;
          background: rgba(255, 59, 48, 0.1);
          border-radius: 10px;
        }
        .footer {
          background: rgba(0, 0, 0, 0.3);
          padding: 20px;
          text-align: center;
          font-size: 0.8em;
          color: rgba(255, 255, 255, 0.6);
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
          margin: 20px 0;
        }
        .security-notice {
          font-size: 0.85em;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          margin-top: 20px;
        }
        @media (max-width: 600px) {
          .email-container {
            margin: 20px;
          }
          .header h1 {
            font-size: 2em;
          }
          .otp-number {
            font-size: 2.5em;
            letter-spacing: 6px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>OTP Verification</h1>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${options.name || 'User'},
          </div>
          
          <div class="otp-container">
            <div style="color: rgba(255, 255, 255, 0.8); margin-bottom: 10px;">
              Your One-Time Password is:
            </div>
            <div class="otp-number">
              ${otp}
            </div>
            <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.9em;">
              This OTP will expire in 10 minutes
            </div>
          </div>

          <div class="notice">
            If you didn't request this verification code, please ignore this email.
          </div>

          <div class="security-notice">
            For security reasons, never share this OTP with anyone.
            Our team will never ask for your OTP.
          </div>
        </div>
        
        <div class="footer">
          <div class="divider"></div>
          <p> ${new Date().getFullYear()} Your Learning Platform. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password
    }
  });

  const mailOptions = {
    from: `"Learning Platform" <${process.env.Gmail}>`,
    to: options.email,
    subject: options.subject,
    html: createEmailTemplate(options)
  };

  try {
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email: ' + error.message);
  }
};

export default sendMail;
