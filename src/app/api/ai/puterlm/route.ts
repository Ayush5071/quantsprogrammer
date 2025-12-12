import { NextRequest, NextResponse } from 'next/server';

// Lightweight placeholder route for Puter LLM integration.
// The external Puter package previously failed to install; keep a safe
// placeholder that returns 501 so callers can degrade gracefully.
export async function GET(_request: NextRequest) {
	return NextResponse.json({ error: 'Puter LLM integration unavailable' }, { status: 501 });
}

