import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Veri göndereceğimiz için POST kullanıyoruz
export async function POST(request: Request) {
  try {
    // Frontend'den gelen veriyi al
    const body = await request.json();
    const { email, username, password } = body;

    // Basit validasyon
    if (!email || !username || !password) {
      return new NextResponse('Eksik bilgi', { status: 400 });
    }

    // 1. Email kullanımda mı kontrol et
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return new NextResponse('Bu email zaten kullanımda', { status: 409 });
    }

    // 2. Şifreleme (Hash)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Veritabanına kaydet
    await db.insert(users).values({
      email,
      username,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'Kullanıcı başarıyla oluşturuldu' }, { status: 201 });

  } catch (error) {
    console.error('Register Hatası:', error);
    return new NextResponse('Sunucu hatası', { status: 500 });
  }
}