import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }
  try {
    const prompt = `You are a contact support team member of my application. Greet the customer, then answer their query clearly and concisely based on the following rules:

- Our app has routes for login, signup, forgot password, reset password, and email verification.
- If a user registers and forgets to verify their email, there is a button on the login page to resend the verification email.
- If a user forgets their password, they can use the forgot password feature.
- If a user forgets both their email and password, they must contact the admin at quantsptogrammer@gmail.com; no automated solution is available for this case.
- Only answer based on these rules and the features described. Do not invent features.

User message: ${message}`;
    
    const clarifiedMessage = await generateContent(prompt);
    
    if (!clarifiedMessage) {
      return NextResponse.json({ clarifiedMessage: 'AI could not clarify the message. (No response)' });
    }
    
    return new Response(clarifiedMessage, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } catch (err) {
    console.error('Gemini clarify error:', err);
    return NextResponse.json({ error: 'Failed to clarify message with Gemini.' }, { status: 500 });
  }
}
