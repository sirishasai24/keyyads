import nodemailer from "nodemailer";


interface UserPlanDetails {
    userId: string;
    title: "Quarterly Plan" | "Half Yearly Plan" | "Annual Plan";
    startDate: string;
    expiryDate: string;
    transactionId: string;
    price: number;
    listings: number;
    premiumBadging: number;
    shows: number;
    emi: boolean;
    saleAssurance: boolean;
    socialMedia: boolean;
    moneyBack: boolean | string;
    teleCalling: boolean;
    originalPrice: number;
    note: string;
    planDetailsSnapshot: object;
    createdAt: string;
}

interface InvoiceDetails {
  toEmail: string;
  planDetails: UserPlanDetails; // Use a more specific type if you have one for your plan
  transactionId: string;
  startDate: Date;
  expiryDate: Date;
  username: string;
}

export async function sendInvoiceEmail({
  toEmail,
  planDetails,
  transactionId,
  startDate,
  expiryDate,
  username,
}: InvoiceDetails) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API_KEY,
      },
    });

    await transporter.verify();
    console.log("SMTP transporter verified successfully for invoice email.");

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const keyyardsLogoUrl = "https://res.cloudinary.com/dkm46q09h/image/upload/v1754115275/keyyards_vzhcba.png";

    const mailOptions = {
      from: process.env.CONTACT_FORM_SENDER_EMAIL || "no-reply@keyyards.com",
      to: toEmail,
      subject: `Your Keyyards Invoice for ${planDetails.title}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Keyyards Purchase Invoice</title>
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
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a202c;
      margin-top: 25px;
      margin-bottom: 10px;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
    .invoice-table th, .invoice-table td {
      text-align: left;
      padding: 15px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 15px;
    }
    .invoice-table th {
      background-color: #f7fafc;
      font-weight: 600;
      color: #4a5568;
    }
    .invoice-table td {
      background-color: #ffffff;
      color: #333d47;
    }
    .invoice-table tr:last-child td {
      border-bottom: none;
    }
    .total-row td {
      font-weight: 700;
      background-color: #f0f4f8;
      font-size: 16px;
      color: #155a96;
    }
    .feature-list {
      list-style-type: none;
      padding: 0;
      margin: 15px 0;
    }
    .feature-list li {
      padding: 8px 0;
      border-bottom: 1px dashed #e2e8f0;
      font-size: 15px;
      color: #4a5568;
    }
    .feature-list li:before {
      content: '✓';
      color: #2180d3;
      font-weight: bold;
      margin-right: 10px;
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
      .invoice-table th, .invoice-table td {
        padding: 10px !important;
        font-size: 14px !important;
      }
      .total-row td {
        font-size: 15px !important;
      }
      .feature-list li {
        font-size: 14px !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${keyyardsLogoUrl}" alt="Keyyards Logo" />
      <h1>Payment Confirmation</h1>
      <p>Thank you for your purchase, ${username}!</p>
    </div>
    <div class="content">
      <h2>Invoice for ${planDetails.title}</h2>
      
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${planDetails.title}</td>
            <td>₹${planDetails.price.toLocaleString("en-IN")}</td>
          </tr>
          <tr class="total-row">
            <td>Total Paid</td>
            <td>₹${planDetails.price.toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">Order Details</div>
      <table class="invoice-table">
        <tr>
          <td class="label">Transaction ID:</td>
          <td class="value">${transactionId}</td>
        </tr>
        <tr>
          <td class="label">Purchase Date:</td>
          <td class="value">${formatDate(startDate)}</td>
        </tr>
        <tr>
          <td class="label">Plan Expiry:</td>
          <td class="value">${formatDate(expiryDate)}</td>
        </tr>
      </table>

      <div class="section-title">What's Included in Your Plan:</div>
      <ul class="feature-list">
        <li>${planDetails.listings} Listings</li>
        <li>${planDetails.premiumBadging} Premium Badging</li>
        <li>${planDetails.shows} Shows</li>
        ${planDetails.emi ? '<li>EMI Option Available</li>' : ''}
        ${planDetails.saleAssurance ? '<li>Sale Assurance</li>' : ''}
        ${planDetails.teleCalling ? '<li>Dedicated Tele-calling Support</li>' : ''}
      </ul>

      <p>If you have any questions about your invoice or plan, please don't hesitate to contact our support team.</p>
      <p>We're excited to help you with your property needs!</p>
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

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Invoice email sent successfully:", mailResponse);
    return mailResponse;
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw error;
  }
}