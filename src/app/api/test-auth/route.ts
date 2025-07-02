import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  
  return NextResponse.json({
    success: true,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    message: token ? 'Token found in cookies' : 'No token in cookies',
    cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value.slice(0, 10) + '...']))
  });
}
