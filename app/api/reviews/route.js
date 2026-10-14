import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Replace is necessary to format the private key correctly
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/business.manage'],
    });

    const client = await auth.getClient();
    const accountId = process.env.GBP_ACCOUNT_ID; 
    const locationId = '5014800034363776060'; // Khatu Rides Korba Location ID

    const url = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`;
    
    const res = await client.request({ url });

    return NextResponse.json({ 
      success: true, 
      reviews: res.data.reviews || [],
      averageRating: res.data.averageRating || 4.7,
      totalReviewCount: res.data.totalReviewCount || 44
    });

  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}