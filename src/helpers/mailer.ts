import nodemailer from "nodemailer";
import User from "@/models/userModel"; // Assuming your User model path is correct
import bcryptjs from "bcryptjs";

interface Details {
  email: string;
  emailType: "RESET" | "VERIFY";
  userId: string;
}

export default async function sendEmail({ email, emailType, userId }: Details) {
  try {
    // Fetch user details first to get the username for the email
    const user = await User.findById(userId);
    const username = user?.username || email; // Fallback to email if username not found

    // Generate hashed token and email
    let hashedToken = await bcryptjs.hash(userId.toString(), 10);
    let hashedEmail = await bcryptjs.hash(email, 10);

    // Sanitize the hashed values (remove non-alphanumeric to be URL-safe if not already)
    hashedToken = hashedToken.replace(/[^a-zA-Z0-9]/g, "");
    hashedEmail = hashedEmail.replace(/[^a-zA-Z0-9]/g, "");

    // Update user document based on emailType
    // Ensure you have connected to your database before calling User.findByIdAndUpdate
    // This is typically done in your API route handler that calls sendEmail
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
        hashedEmail: hashedEmail,
      });
      console.log("Verification token updated for user:", userId);
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
        hashedEmail: hashedEmail,
      });
      console.log("Password reset token updated for user:", userId);
    }

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com", // Brevo's SMTP host
      port: 587,
      secure: false, // Use 'true' if port is 465 and your provider supports SSL/TLS
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API_KEY,
      },
    });

    // Verify transporter connection (good for debugging)
    await transporter.verify();
    console.log("SMTP transporter verified successfully.");

    // Construct the verification/reset link
    const verificationLink = `${process.env.DOMAIN}/auth/${
      emailType === "VERIFY" ? "verifyemail" : "resetpassword"
    }/?token=${encodeURIComponent(hashedToken)}&id=${encodeURIComponent(
      hashedEmail
    )}`;

    // IMPORTANT: Replace this URL with your actual logo hosted on a public CDN.
    const keyyardsLogoUrl = "https://res.cloudinary.com/dkm46q09h/image/upload/v1754115275/keyyards_vzhcba.png"; // REPLACE THIS WITH YOUR REAL LOGO URL

    const mailOptions = {
      from: process.env.CONTACT_FORM_SENDER_EMAIL || "no-reply@keyyards.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your Keyyards account" : "Reset your Keyyards password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${
            emailType === "VERIFY" ? "Keyyards Email Verification" : "Keyyards Password Reset"
          }</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f5f8fb;
              font-family: 'Inter', sans-serif;
              color: #333d47;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }

            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
              border: 1px solid #e0e6ed;
            }

            .header {
              background: linear-gradient(135deg, #155a96, #2180d3);
              padding: 30px 20px;
              color: white;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              position: relative;
            }

            .header img {
                max-width: 160px;
                height: auto;
                margin-bottom: 20px;
                filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.2));
            }

            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              line-height: 1.2;
            }

            .content {
              padding: 30px 40px;
              text-align: left;
              line-height: 1.6;
            }

            .content p {
              margin: 15px 0;
              font-size: 16px;
              color: #4a5568;
            }

            .cta-button {
              display: inline-block;
              margin: 25px 0;
              background: linear-gradient(135deg, #2180d3, #1a6cb2);
              color: #ffffff !important; /* Explicitly set color to white with !important */
              text-decoration: none;
              padding: 14px 30px;
              border-radius: 6px;
              font-weight: 600;
              font-size: 16px;
              transition: all 0.3s ease;
              box-shadow: 0 5px 15px rgba(33, 128, 211, 0.4);
            }

            .cta-button:hover {
              background: linear-gradient(135deg, #1a6cb2, #114c7c);
              box-shadow: 0 8px 20px rgba(33, 128, 211, 0.5);
              transform: translateY(-2px);
            }

            .link {
              color: #2180d3;
              font-weight: 500;
              text-decoration: underline;
              word-break: break-all;
            }

            .footer {
              padding: 20px;
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

            /* Responsive adjustments */
            @media (max-width: 600px) {
              .container {
                margin: 20px;
                border-radius: 8px;
              }
              .content {
                padding: 25px 20px;
              }
              .header {
                padding: 25px 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .header img {
                max-width: 120px;
              }
              .cta-button {
                padding: 12px 25px;
                font-size: 15px;
              }
              .footer {
                padding: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${keyyardsLogoUrl}" alt="Keyyards Logo" />
              <h1>${
                emailType === "VERIFY" ? "Welcome to Keyyards!" : "Reset Your Keyyards Password"
              }</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${username}</strong>,</p>
              <p>
                ${
                  emailType === "VERIFY"
                    ? "Thank you for joining Keyyards! To activate your account and start exploring properties, please verify your email address by clicking the button below. Your journey to finding the perfect property starts here!"
                    : "We received a request to reset your password for your Keyyards account. Please click the button below to set a new password."
                }
              </p>
              <p style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
                <a href="${verificationLink}" class="cta-button" target="_blank" style="color: #ffffff !important;">
                  ${emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"}
                </a>
              </p>
              <p>If the button above doesn’t work, you can also copy and paste the following link into your web browser:</p>
              <p><a href="${verificationLink}" class="link" target="_blank">${verificationLink}</a></p>
              <p>If you did not request this, please ignore this email.</p>
              <p>Thank you for choosing Keyyards.</p>
              <p>Best regards,<br/>The Keyyards Team</p>
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

    // Send the email
    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", mailResponse);
    return mailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw to handle it in the calling API route/function
  }
}