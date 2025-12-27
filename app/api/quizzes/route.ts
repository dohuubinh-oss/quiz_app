
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/mongodb';
import { Quiz } from '@/models/Quiz';
import mongoose from 'mongoose'; // **Thêm import mongoose**

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();

    const { title, description, coverImage } = body;

    if (!title || !description || !coverImage) {
      return NextResponse.json({ message: 'Title, description, and a cover image are required' }, { status: 400 });
    }

    const newQuizData = {
      title,
      description,
      coverImage,
      questions: [],
      published: false,
      // **Chuyển đổi session.user.id sang ObjectId**
      authorId: new mongoose.Types.ObjectId(session.user.id),
    };

    const newQuiz = new Quiz(newQuizData);

    await newQuiz.save();

    return NextResponse.json(newQuiz, { status: 201 });

  } catch (error) {
    console.error('Error creating quiz:', error);
    // Cung cấp thông báo lỗi chi tiết hơn trong môi trường development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? (error as Error).message 
      : 'Internal Server Error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const quizzes = await Quiz.find({}).sort({ _id: -1 });

    return NextResponse.json(quizzes, { status: 200 });

  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
