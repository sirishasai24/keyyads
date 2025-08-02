// src/app/api/contact/route.ts
import { NextResponse, NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fullName, email, phoneNumber, propertyInterest, message } = body;

        // --- Validations ---
        if (!fullName || typeof fullName !== "string" || fullName.trim().length < 3) {
            return NextResponse.json({ message: "Invalid name. Must be at least 3 characters long." }, { status: 400 });
        }
        if (!email || typeof email !== "string" || !/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) {
            return NextResponse.json({ message: "Invalid email format." }, { status: 400 });
        }
        if (!message || typeof message !== "string" || message.trim().length === 0) {
            return NextResponse.json({ message: "Message cannot be empty." }, { status: 400 });
        }
        // phoneNumber and propertyInterest are optional based on your frontend (no 'required' in form for them)
        // You can add more specific validations if needed, e.g., phone number format

        // --- Nodemailer Transport Setup ---
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com", // Brevo's SMTP host
            port: 587,
            secure: false, // Use 'true' if port is 465 and your provider supports SSL/TLS
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_API_KEY,
            },
        });

        // Optional: Verify transporter connection (good for debugging)
        try {
            await transporter.verify();
            console.log("SMTP transporter verified successfully.");
        } catch (verifyError) {
            console.error("SMTP transporter verification failed:", verifyError);
            // You might choose to return an error here or proceed if it's not critical
        }

        // IMPORTANT: Replace this URL with your actual logo hosted on a public CDN.
        // Example: "https://your-cdn.com/images/keyyards-logo-full.png" (consider a transparent background logo)
        const keyyardsLogoUrl = "https://res.cloudinary.com/dkm46q09h/image/upload/v1754115275/keyyards_vzhcba.png"; // Example placeholder, replace with your real logo!

        // --- Email Content (mailOptions) ---
        const mailOptions = {
            from: process.env.CONTACT_FORM_SENDER_EMAIL || "no-reply@keyyards.com", // Sender email
            to: process.env.CONTACT_FORM_RECIPIENT_EMAIL || "tarun8008058309@gmail.com", // Recipient email
            subject: "New Contact Form Submission - Keyyards Website",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Contact Request - Keyyards</title>
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
                            padding: 20px; /* Adjust padding for horizontal layout */
                            color: white;
                            text-align: center;
                            display: flex; /* Changed to flex */
                            flex-direction: row; /* Arranged elements in a row */
                            align-items: center; /* Vertically align items in the center */
                            justify-content: center; /* Horizontally center items */
                        }
                        .header img {
                            max-width: 100px; /* Adjust logo size for horizontal layout */
                            height: auto;
                            margin-right: 15px; /* Space between logo and title */
                            margin-bottom: 0; /* Reset margin-bottom as it's now horizontal */
                            filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.2));
                        }
                        .header h1 {
                            margin: 0; /* Reset margin */
                            font-size: 24px; /* Adjust title size for horizontal layout */
                            font-weight: 700;
                            line-height: 1.2;
                            white-space: nowrap; /* Prevent text wrapping if it fits */
                        }
                        .content {
                            padding: 30px 40px;
                            text-align: left;
                            line-height: 1.6;
                            font-size: 16px;
                            color: #4a5568;
                        }
                        .content p {
                            margin: 15px 0;
                        }
                        .details-table {
                            width: 100%;
                            border-collapse: separate;
                            border-spacing: 0;
                            margin-top: 25px;
                            border: 1px solid #e0e6ed;
                            border-radius: 8px;
                            overflow: hidden;
                        }
                        .details-table th, .details-table td {
                            padding: 12px 18px;
                            text-align: left;
                            border-bottom: 1px solid #e0e6ed;
                        }
                        .details-table th {
                            background-color: #f8f9fa;
                            font-weight: 600;
                            width: 35%;
                            color: #333d47;
                        }
                        .details-table tr:last-child th,
                        .details-table tr:last-child td {
                            border-bottom: none;
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
                                flex-direction: column; /* Stack on small screens */
                                padding: 25px 20px;
                            }
                            .header img {
                                margin-right: 0;
                                margin-bottom: 15px; /* Add back bottom margin when stacked */
                                max-width: 120px; /* Adjust size for stacked mobile */
                            }
                            .header h1 {
                                font-size: 24px;
                            }
                            .details-table th, .details-table td {
                                padding: 10px 15px;
                                display: block;
                                width: 100%;
                                text-align: left;
                            }
                            .details-table th {
                                background-color: #f0f0f0;
                                border-bottom: none;
                                border-radius: 5px 5px 0 0;
                                margin-bottom: -1px;
                            }
                            .details-table td {
                                border-top: none;
                                border-bottom: 1px solid #e0e6ed;
                                border-radius: 0 0 5px 5px;
                            }
                            .details-table tr {
                                margin-bottom: 15px;
                                display: block;
                                border: 1px solid #e0e6ed;
                                border-radius: 8px;
                                overflow: hidden;
                            }
                            .details-table tr:last-child {
                                margin-bottom: 0;
                            }
                            .details-table tr:last-child td {
                                border-bottom: none;
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
                            <h1>New Contact Request</h1>
                        </div>
                        <div class="content">
                            <p>You have received a new message from your Keyyards website contact form. Here are the details:</p>
                            <table class="details-table">
                                <tr>
                                    <th>Full Name:</th>
                                    <td>${fullName}</td>
                                </tr>
                                <tr>
                                    <th>Email:</th>
                                    <td>${email}</td>
                                </tr>
                                ${phoneNumber ? `
                                <tr>
                                    <th>Phone Number:</th>
                                    <td>${phoneNumber}</td>
                                </tr>` : ''}
                                ${propertyInterest ? `
                                <tr>
                                    <th>Property Interest:</th>
                                    <td>${propertyInterest}</td>
                                </tr>` : ''}
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

        // --- Send Email ---
        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("Contact form email sent successfully:", mailResponse);

        return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });

    } catch (error) {
        console.error("Error processing contact form:", error);
        let errorMessage = "Failed to send message due to a server error.";

        return NextResponse.json({ message: errorMessage, error: error || "Unknown error" }, { status: 500 });
    }
}