import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }
  try {
    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a contact support team member of my application. Greet the customer, then answer their query clearly and concisely based on the following rules:

- Our app has routes for login, signup, forgot password, reset password, and email verification.
- If a user registers and forgets to verify their email, there is a button on the login page to resend the verification email.
- If a user forgets their password, they can use the forgot password feature.
- If a user forgets both their email and password, they must contact the admin at quantsptogrammer@gmail.com; no automated solution is available for this case.
- Only answer based on these rules and the features described. Do not invent features.

User message: ${message}` }] }]
      })
    });
    const geminiData = await geminiRes.json();
    // Improved logging for debugging
    if (!geminiData || !Array.isArray(geminiData.candidates) || !geminiData.candidates.length) {
      console.error('Gemini API error or empty response:', JSON.stringify(geminiData, null, 2));
      return NextResponse.json({ clarifiedMessage: 'AI could not clarify the message. (No candidates returned)' });
    }
    const part = geminiData.candidates[0]?.content?.parts?.[0];
    if (!part || !part.text) {
      console.error('Gemini API candidate missing text:', JSON.stringify(geminiData, null, 2));
      return NextResponse.json({ clarifiedMessage: 'AI could not clarify the message. (No text in candidate)' });
    }
    const clarifiedMessage = part.text;
    return new Response(clarifiedMessage, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } catch (err) {
    console.error('Gemini clarify error:', err);
    return NextResponse.json({ error: 'Failed to clarify message with Gemini.' }, { status: 500 });
  }
}
