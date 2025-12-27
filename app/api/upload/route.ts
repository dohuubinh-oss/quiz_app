
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
    }

    // Chuyển đổi tệp thành Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Tạo tên tệp duy nhất để tránh ghi đè
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    // Xác định đường dẫn đến thư mục public/uploads
    // process.cwd() trỏ đến thư mục gốc của dự án
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Đảm bảo thư mục upload tồn tại, tạo nếu chưa có
    await fs.mkdir(uploadDir, { recursive: true });

    // Ghi tệp vào thư mục
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Tạo URL công khai để truy cập tệp
    const publicUrl = `/uploads/${filename}`;

    // Trả về URL công khai trong response
    return NextResponse.json({ imageUrl: publicUrl }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'An error occurred during file upload.' }, { status: 500 });
  }
}
