// app/api/send-support-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from "nodemailer";

// Interface for the incoming support request body
interface SupportRequest {
  name: string;
  email: string;
  phoneNumber?: string; // phoneNumber is now optional
  message: string;
}

// Function to send the support email
async function sendSupportEmail({ name, email, phoneNumber, message }: SupportRequest) {
  try {
    // Configure the Nodemailer transporter with Brevo SMTP details
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // Use 'true' if port is 465 and your provider supports SSL/TLS
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API_KEY,
      },
    });

    // Verify transporter connection (optional but good for debugging)
    await transporter.verify();

    const keyyardsLogoUrl = "https://res.cloudinary.com/dkm46q09h/image/upload/v1754115275/keyyards_vzhcba.png";

    // Create the email content with the new, refined template
    const mailOptions = {
      from: process.env.CONTACT_FORM_SENDER_EMAIL || "no-reply@keyyards.com",
      to: process.env.CONTACT_FORM_RECIPIENT_EMAIL || "support@keyyards.in",
      subject: `New Support Request from ${name}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Support Request - Keyyards</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Inter', sans-serif; 
              background-color: #f0f4f8; 
              margin: 0; 
              padding: 0; 
              color: #333d47; 
              -webkit-font-smoothing: antialiased; 
              line-height: 1.6;
            }
            .container { 
              max-width: 640px; 
              margin: 40px auto; 
              background-color: #ffffff; 
              border-radius: 12px; 
              overflow: hidden; 
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); 
              border: 1px solid #e2e8f0;
            }
            .header { 
              background: linear-gradient(135deg, #155a96, #2180d3);
              color: white;
              padding: 40px 30px; 
              text-align: center;
              border-bottom: 5px solid #0f436d;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            .header p {
              margin: 5px 0 0;
              font-size: 16px;
              opacity: 0.9;
            }
            .header img { 
              max-width: 160px; 
              height: auto; 
              margin-bottom: 20px;
              filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.2));
            }
            .content { 
              padding: 30px 40px; 
            }
            .content h2 { 
              color: #1a202c; 
              font-size: 22px; 
              font-weight: 600;
              margin-top: 0;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 15px;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              overflow: hidden;
            }
            .details-table th, .details-table td {
              text-align: left;
              padding: 15px;
              border-bottom: 1px solid #e2e8f0;
              font-size: 15px;
            }
            .details-table th {
              background-color: #f7fafc;
              font-weight: 600;
              color: #4a5568;
              width: 35%;
            }
            .details-table td {
              background-color: #ffffff;
              color: #333d47;
            }
            .details-table tr:last-child td {
              border-bottom: none;
            }
            .footer { 
              padding: 25px; 
              background-color: #eef3f7; 
              font-size: 13px; 
              color: #6b7280; 
              text-align: center; 
              border-top: 1px solid #dbe3eb; 
            }
            .footer a { 
              color: #2180d3; 
              font-weight: 600; 
              text-decoration: none; 
            }
            .footer a:hover {
              text-decoration: underline;
            }

            /* === Mobile Responsiveness === */
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                border-radius: 0 !important;
                box-shadow: none !important;
              }
              .content {
                padding: 20px !important;
              }
              .header {
                padding: 30px 20px !important;
              }
              .header h1 {
                font-size: 24px !important;
              }
              .header img {
                max-width: 140px !important;
              }
              .details-table th, .details-table td {
                padding: 10px !important;
                font-size: 14px !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${keyyardsLogoUrl}" alt="Keyyards Logo" />
              <h1>New Support Request</h1>
            </div>
            <div class="content">
              <p>You have received a new message from the Keyyards website AI assistant chat form. Here are the details:</p>
              
              <table class="details-table">
                <tr>
                  <th>Name:</th>
                  <td>${name}</td>
                </tr>
                <tr>
                  <th>Email:</th>
                  <td>${email}</td>
                </tr>
                <tr>
                  <th>Phone Number:</th>
                  <td>${phoneNumber || 'Not provided'}</td>
                </tr>
                <tr>
                  <th>Message:</th>
                  <td>${message}</td>
                </tr>
              </table>

              <p style="margin-top: 30px;">Please respond to this inquiry at your earliest convenience.</p>
              <p>Best regards,<br/>Keyyards Website Automated System</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Keyyards. All rights reserved.</p>
              <p>
                <a href="${process.env.DOMAIN}" target="_blank">Visit Keyyards Website</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Support email sent successfully:", mailResponse);
    return mailResponse;
  } catch (error) {
    console.error("Error sending support email:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Destructure all fields including phoneNumber
    const { name, email, phoneNumber, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All form fields are required' }, { status: 400 });
    }

    // Call the new email sending function with all fields
    await sendSupportEmail({ name, email, phoneNumber, message });

    return NextResponse.json({ message: 'Support request received successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending support email:', error);
    return NextResponse.json({ error: 'Failed to send support email' }, { status: 500 });
  }
}