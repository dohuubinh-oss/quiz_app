
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/mongodb';
// SỬA LỖI: Sử dụng named import cho Quiz Model
import { Quiz } from '@/models/Quiz';

// Sửa lỗi: Thay đổi chữ ký hàm để xử lý params đúng cách
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    // Lấy id từ params
    const { id } = params;
    
    // Cải tiến: Thêm .populate('questions') để lấy dữ liệu câu hỏi
    const quiz = await Quiz.findById(id).populate('questions');

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(quiz, { status: 200 });

  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Sửa lỗi: Thay đổi chữ ký hàm để xử lý params đúng cách
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    // Lấy id từ params
    const { id } = params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    if (quiz.authorId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    // Cải tiến bảo mật: Ngăn người dùng tự thay đổi chủ sở hữu của quiz
    delete body.authorId;
    // Không cho phép cập nhật câu hỏi trực tiếp qua endpoint này
    delete body.questions;

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json(updatedQuiz, { status: 200 });

  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Sửa lỗi: Thay đổi chữ ký hàm để xử lý params đúng cách
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    // Lấy id từ params
    const { id } = params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    if (quiz.authorId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await Quiz.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Quiz deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
