
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/mongodb';
import { Quiz } from '@/models/Quiz';
import { IQuiz } from '@/models/Quiz';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body: IQuiz = await req.json();

    const { title, description, coverImage, questions } = body;

    if (!title || !description || !coverImage || !questions) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newQuiz = new Quiz({
      ...body,
      authorId: session.user.id,
    });

    await newQuiz.save();

    return NextResponse.json(newQuiz, { status: 201 });

  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const quizzes = await Quiz.find({}).sort({ _id: -1 }); // Get all quizzes, sort by newest

    return NextResponse.json(quizzes, { status: 200 });

  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
