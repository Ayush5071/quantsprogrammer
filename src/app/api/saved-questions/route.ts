import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getToken';
import User from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';

connect();

export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required', success: false }, { status: 401 });
    }
    const { questionId } = await request.json();
    if (!questionId) {
      return NextResponse.json({ error: 'No questionId provided', success: false }, { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found', success: false }, { status: 404 });
    }
    if (!user.savedQuestions) user.savedQuestions = [];
    if (!user.savedQuestions.includes(questionId)) {
      user.savedQuestions.push(questionId);
      await user.save();
    }
    return NextResponse.json({ message: 'Question saved', success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error', success: false }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required', success: false }, { status: 401 });
    }
    const { questionId } = await request.json();
    if (!questionId) {
      return NextResponse.json({ error: 'No questionId provided', success: false }, { status: 400 });
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found', success: false }, { status: 404 });
    }
    user.savedQuestions = (user.savedQuestions || []).filter((id: string) => id !== questionId);
    await user.save();
    return NextResponse.json({ message: 'Question unsaved', success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error', success: false }, { status: 500 });
  }
}
