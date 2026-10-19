import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Extracting all possible fields (both B2C and B2B forms)
    const { 
      type, // 'Corporate' flag to differentiate form types
      tripType, 
      name, 
      mobile, 
      pickup, 
      drop, 
      travelDate, 
      car, 
      note, 
      company, 
      serviceType, 
      city 
    } = data;

    // Configure Nodemailer with strict Gmail SMTP settings for Vercel
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL for secure connection
      auth: {
        user: process.env.EMAIL_USER, // e.g. khaturides@gmail.com
        pass: process.env.EMAIL_PASS, // 16-digit App Password
      },
    });

    let mailOptions;

    // -------------------------------------------------------------
    // LOGIC 1: B2B CORPORATE LEAD EMAIL FORMAT
    // -------------------------------------------------------------
    if (type === "Corporate") {
      mailOptions = {
        from: `"Khatu Rides B2B Leads" <${process.env.EMAIL_USER}>`,
        to: "khaturides@gmail.com",
        subject: `🚨 B2B ENQUIRY: ${company} from ${city}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0f172a; color: #fbbf24; padding: 20px; border-bottom: 4px solid #fbbf24;">
              <h2 style="margin: 0;">New Corporate B2B Request</h2>
            </div>
            <div style="padding: 20px; background-color: #f8fafc;">
              <table style="width: 100%; border-collapse: collapse; color: #334155;">
                <tbody>
                  <tr style="background-color: #e2e8f0;">
                    <td style="padding: 12px 10px; font-weight: bold; width: 140px; border-bottom: 1px solid #cbd5e1;">Company Name</td>
                    <td style="padding: 12px 10px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #cbd5e1;">${company}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #cbd5e1;">Contact Person</td>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #cbd5e1;">${name}</td>
                  </tr>
                  <tr style="background-color: #e2e8f0;">
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #cbd5e1;">Mobile Number</td>
                    <td style="padding: 12px 10px; font-weight: bold; color: #2563eb; border-bottom: 1px solid #cbd5e1;">${mobile}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #cbd5e1;">City/Location</td>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #cbd5e1;">${city}</td>
                  </tr>
                  <tr style="background-color: #e2e8f0;">
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #cbd5e1;">Service Required</td>
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #cbd5e1;">${serviceType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #cbd5e1;">Additional Details</td>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #cbd5e1;">${note || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 25px; text-align: center;">
                <a href="tel:${mobile}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Call Client Now</a>
              </div>
            </div>
          </div>
        `,
      };
    } 
    // -------------------------------------------------------------
    // LOGIC 2: REGULAR B2C TAXI ENQUIRY EMAIL FORMAT
    // -------------------------------------------------------------
    else {
      mailOptions = {
        from: `"Khatu Rides Leads" <${process.env.EMAIL_USER}>`,
        to: "khaturides@gmail.com",
        subject: `🚖 ${tripType || 'Taxi'} enquiry: ${pickup} -> ${drop}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1a42c6; color: white; padding: 20px; border-bottom: 4px solid #fbbf24;">
              <h2 style="margin: 0;">New ${tripType?.toLowerCase() || 'taxi'} enquiry</h2>
            </div>
            <div style="padding: 20px; background-color: #ffffff;">
              <table style="width: 100%; border-collapse: collapse; color: #333;">
                <tbody>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 10px; font-weight: bold; width: 120px; border-bottom: 1px solid #e2e8f0;">Name</td>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Mobile</td>
                    <td style="padding: 12px 10px; font-weight: bold; color: #1a42c6; border-bottom: 1px solid #e2e8f0;">${mobile}</td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Pickup</td>
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${pickup}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Drop</td>
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${drop}</td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Travel date</td>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0;">${travelDate || 'Flexible'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Car Preference</td>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0;">${car || 'Any'}</td>
                  </tr>
                  <tr style="background-color: #f8fafc;">
                    <td style="padding: 12px 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Note</td>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #e2e8f0;">${note || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 25px; text-align: center;">
                <a href="tel:${mobile}" style="background-color: #1a42c6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Call the customer now</a>
              </div>
            </div>
          </div>
        `,
      };
    }

    // Execute email sending
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Email API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}