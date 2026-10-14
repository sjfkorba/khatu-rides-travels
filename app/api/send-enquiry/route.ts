import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { tripType, name, mobile, pickup, drop, travelDate, car, note } = data;

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

    const mailOptions = {
      from: `"Khatu Rides Leads" <${process.env.EMAIL_USER}>`,
      to: "khaturides@gmail.com",
      subject: `New ${tripType.toLowerCase()} enquiry: ${pickup} -> ${drop}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1a42c6; color: white; padding: 20px;">
            <h2 style="margin: 0;">New ${tripType.toLowerCase()} taxi enquiry</h2>
          </div>
          <div style="padding: 20px; background-color: #ffffff;">
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold; width: 120px;">Name</td>
                  <td style="padding: 10px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold;">Mobile</td>
                  <td style="padding: 10px 0;">${mobile}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold;">Pickup</td>
                  <td style="padding: 10px 0;">${pickup}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold;">Drop</td>
                  <td style="padding: 10px 0;">${drop}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold;">Travel date</td>
                  <td style="padding: 10px 0;">${travelDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold;">Car</td>
                  <td style="padding: 10px 0;">${car}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-weight: bold;">Note</td>
                  <td style="padding: 10px 0;">${note}</td>
                </tr>
              </tbody>
            </table>
            <div style="margin-top: 20px;">
              <a href="tel:${mobile}" style="background-color: #1a42c6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Call the customer now</a>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Email API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}