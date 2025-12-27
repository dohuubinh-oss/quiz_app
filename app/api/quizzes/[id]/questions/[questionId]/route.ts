
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import mongoose from 'mongoose';

// PUT: Cập nhật một câu hỏi cụ thể
export async function PUT(req: NextRequest, { params }: { params: { id: string, questionId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id, questionId } = params;
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(questionId)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Lấy dữ liệu mới từ body
    const { questionText, options, correctOptionIndex } = await req.json();

    // **SỬA LỖI: Thêm xác thực đầu vào tương tự như API tạo mới**
    if (!questionText || !options || !Array.isArray(options) || options.length < 2 || correctOptionIndex === undefined) {
      return NextResponse.json({ message: 'Missing or invalid required question fields' }, { status: 400 });
    }

    await dbConnect();
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    if (quiz.authorId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const question = quiz.questions.id(questionId);
    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    // **SỬA LỖI: Biến đổi dữ liệu đầu vào và cập nhật câu hỏi**
    const formattedOptions = options.map((optionText: string, index: number) => ({
      optionText,
      isCorrect: index === correctOptionIndex,
    }));

    question.questionText = questionText;
    question.options = formattedOptions;
    
    await quiz.save();
    
    // Trả về câu hỏi đã được cập nhật
    return NextResponse.json({ message: 'Question updated successfully', question }, { status: 200 });

  } catch (error) {
    console.error('Failed to update question', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Xóa một câu hỏi cụ thể
export async function DELETE(req: NextRequest, { params }: { params: { id: string, questionId: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id, questionId } = params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(questionId)) {
        return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    try {
        await dbConnect();
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
        }

        if (quiz.authorId.toString() !== session.user.id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const question = quiz.questions.id(questionId);
        if (!question) {
            return NextResponse.json({ message: 'Question already deleted or not found' }, { status: 200 });
        }

        // Sử dụng Mongoose để xóa sub-document
        question.deleteOne();

        await quiz.save();
        
        return NextResponse.json({ message: 'Question deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Failed to delete question', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
