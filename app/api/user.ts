import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // تأكد أن prisma تم إعدادها بشكل صحيح

export async function POST(req: NextRequest) {
  try {
    // استلام بيانات المستخدم من الطلب
    const userData = await req.json();

    // التحقق من صحة البيانات
    if (!userData || !userData.id) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    // البحث عن المستخدم في قاعدة البيانات باستخدام Telegram ID
    let user = await prisma.user.findUnique({
      where: { telegramId: userData.id },
    });

    // إذا لم يتم العثور على المستخدم، قم بإنشائه
    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: userData.id,
          username: userData.username || '',
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
        },
      });
    }

    // إرجاع بيانات المستخدم كاستجابة
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error processing user data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
